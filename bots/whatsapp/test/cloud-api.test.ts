import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { once } from 'node:events';
import { loadConfig } from '../src/config.js';
import { AUTO_REPLY, CloudApiSender, MetaRejectedError, parseMetaMessages, validMetaSignature, type Inbound } from '../src/cloud-api.js';
import { CloudWorker } from '../src/cloud-worker.js';
import { Store } from '../src/store.js';
import { createApi } from '../src/api.js';
import { SimulationSender } from '../src/worker.js';

const config = (overrides = {}) => loadConfig({ ADMIN_API_KEY: 'a'.repeat(64), AUTH_ENCRYPTION_KEY: 'b'.repeat(64), WHATSAPP_PROVIDER: 'cloud_api',
  META_ACCESS_TOKEN: 'token-ficticio-solo-para-pruebas', META_PHONE_NUMBER_ID: '12345', META_WABA_ID: '67890', META_GRAPH_VERSION: 'v99.0', META_APP_SECRET: 'c'.repeat(32), META_WEBHOOK_VERIFY_TOKEN: 'd'.repeat(64), ...overrides });
const now = new Date('2026-10-17T15:00:00Z');
const incoming = (overrides = {}): Inbound => ({ id: 'wamid.inbound-1', phone: '+12025550123', name: 'Consulta de prueba', at: now.getTime(), type: 'text', text: 'Quiero un presupuesto', ...overrides });
const payload = (timestamp = String(Math.floor(Date.now() / 1000))) => ({ object: 'whatsapp_business_account', entry: [{ id: '67890', changes: [{ field: 'messages', value: { metadata: { phone_number_id: '12345' }, contacts: [{ wa_id: '12025550123', profile: { name: 'Cliente de prueba' } }], messages: [{ id: 'wamid.webhook-test', from: '12025550123', timestamp, type: 'text', text: { body: 'Necesito impermeabilizar' } }] } }] }] });

test('Cloud API: live exige credenciales completas; simulación arranca sin Meta', () => {
  assert.throws(() => loadConfig({ ADMIN_API_KEY: 'a'.repeat(64), AUTH_ENCRYPTION_KEY: 'b'.repeat(64), MODE: 'live', SEND_ENABLED: 'true' }), /Falta configurar WhatsApp oficial/);
  assert.equal(loadConfig({ ADMIN_API_KEY: 'a'.repeat(64), AUTH_ENCRYPTION_KEY: 'b'.repeat(64) }).WHATSAPP_PROVIDER, 'cloud_api');
});

test('firma Meta se verifica sobre los bytes originales y rechaza modificaciones', () => {
  const raw = Buffer.from('{ "object": "whatsapp_business_account" }');
  const signature = `sha256=${createHmac('sha256', config().META_APP_SECRET).update(raw).digest('hex')}`;
  assert.equal(validMetaSignature(raw, signature, config().META_APP_SECRET), true);
  assert.equal(validMetaSignature(Buffer.from('{}'), signature, config().META_APP_SECRET), false);
  assert.equal(validMetaSignature(raw, signature, ''), false);
  assert.equal(validMetaSignature(raw, 'x', config().META_APP_SECRET), false);
});

test('se ignoran otras cuentas, otros números y timestamps futuros', () => {
  const data = payload(String(now.getTime() / 1000));
  assert.equal(parseMetaMessages(data, config(), now).length, 1);
  assert.equal(parseMetaMessages(data, config(), now)[0].name, 'Cliente de prueba');
  assert.deepEqual(parseMetaMessages(data, config({ META_WABA_ID: '999' }), now), []);
  assert.deepEqual(parseMetaMessages(data, config({ META_PHONE_NUMBER_ID: '999' }), now), []);
  assert.deepEqual(parseMetaMessages(payload(String(now.getTime() / 1000 + 120)), config(), now), []);
});

test('entrada deduplicada, una bienvenida por 24 h y sin consentimiento de marketing automático', () => {
  const store = new Store(':memory:');
  try {
    assert.equal(store.receiveCloudMessage(incoming(), 'simulation', AUTO_REPLY, now), true);
    assert.equal(store.receiveCloudMessage(incoming(), 'simulation', AUTO_REPLY, now), false);
    store.receiveCloudMessage(incoming({ id: 'wamid.inbound-2', text: 'Adjunto fotos' }), 'simulation', AUTO_REPLY, now);
    assert.equal(store.cloudInbox().length, 2);
    assert.equal(store.cloudReplies().length, 1);
    assert.equal(store.contacts()[0].consent_state, 'pending');
    store.receiveCloudMessage(incoming({ id: 'wamid.optout', text: 'BAJA' }), 'simulation', AUTO_REPLY, now);
    assert.equal(store.suppressed(incoming().phone), true);
    assert.equal(store.cloudReplies()[0].state, 'cancelled');
  } finally { store.close(); }
});

test('la ventana de atención se revalida al enviar y las respuestas simuladas no pasan a live', async () => {
  const store = new Store(':memory:');
  let calls = 0;
  const sender = { ready: () => true, sendText: async () => { calls++; return 'wamid.out'; } };
  try {
    store.receiveCloudMessage(incoming(), 'simulation', AUTO_REPLY, now);
    await new CloudWorker(store, config({ MODE: 'live', SEND_ENABLED: 'true' }), sender).tick(now);
    assert.equal(calls, 0);
    assert.throws(() => store.queueCloudReply(incoming().phone, 'Hola', 'simulation', new Date(now.getTime() + 86400000)), /ventana de atención/);
    await new CloudWorker(store, config(), sender).tick(new Date(now.getTime() + 86400000));
    assert.equal(calls, 0); assert.equal(store.cloudReplies()[0].state, 'expired');
  } finally { store.close(); }
});

test('worker oficial respeta el cupo, no duplica ticks y pausa resultados inciertos', async () => {
  const store = new Store(':memory:');
  let calls = 0;
  try {
    store.receiveCloudMessage(incoming(), 'simulation', AUTO_REPLY, now);
    const worker = new CloudWorker(store, config(), { ready: () => true, sendText: async () => { calls++; await new Promise(resolve => setImmediate(resolve)); throw new Error('timeout'); } });
    await Promise.all([worker.tick(now), worker.tick(now)]);
    assert.equal(calls, 1); assert.equal(store.cloudReplies()[0].state, 'unknown');
    await worker.tick(now); assert.equal(calls, 1);
    assert.equal(store.setting('paused'), 'send_result_unknown');
  } finally { store.close(); }
});

test('aceptación del proveedor, rechazo explícito y recuperación de respuestas interrumpidas', async () => {
  const store = new Store(':memory:');
  try {
    store.receiveCloudMessage(incoming(), 'simulation', AUTO_REPLY, now);
    await new CloudWorker(store, config({ DAILY_LIMIT: '1' }), { ready: () => true, sendText: async () => 'wamid.accepted' }).tick(now);
    assert.equal(store.cloudReplies()[0].provider_id, 'wamid.accepted');
    store.queueCloudReply(incoming().phone, 'Otra respuesta', 'simulation', now);
    await new CloudWorker(store, config({ DAILY_LIMIT: '1' }), { ready: () => true, sendText: async () => { throw new Error('No debe llamar'); } }).tick(now);
    assert.equal(store.cloudReplies()[0].state, 'queued');
    await new CloudWorker(store, config(), { ready: () => true, sendText: async () => { throw new MetaRejectedError(401); } }).tick(now);
    assert.equal(store.cloudReplies()[0].state, 'failed');
    store.resume(); store.queueCloudReply(incoming().phone, 'Respuesta nueva', 'simulation', now);
    store.claimCloudReply('simulation', '2026-10-17', 20, now);
    assert.equal(store.recoverInterrupted(), 1); assert.equal(store.cloudReplies()[0].state, 'unknown');
  } finally { store.close(); }
});

test('cliente oficial usa Graph con Bearer y no envía en simulación', async () => {
  let calls = 0;
  const request: typeof fetch = async (url, init) => {
    calls++;
    assert.equal(String(url), 'https://graph.facebook.com/v99.0/12345/messages');
    assert.equal(init?.redirect, 'error');
    assert.equal((init?.headers as Record<string, string>).authorization, `Bearer ${config().META_ACCESS_TOKEN}`);
    assert.deepEqual(JSON.parse(String(init?.body)), { messaging_product: 'whatsapp', recipient_type: 'individual', to: '12025550123', type: 'text', text: { preview_url: false, body: 'Respuesta de prueba' } });
    return Response.json({ messages: [{ id: 'wamid.response' }] });
  };
  await assert.rejects(new CloudApiSender(config(), request).sendText(incoming().phone, 'No enviar', 1));
  assert.equal(calls, 0);
  assert.equal(await new CloudApiSender(config({ MODE: 'live', SEND_ENABLED: 'true' }), request).sendText(incoming().phone, 'Respuesta de prueba', 1), 'wamid.response');
  assert.equal(calls, 1);
});

test('webhook público exige token y firma; administración e inbox requieren Bearer', async () => {
  const c = config({ AUTO_REPLY_ENABLED: 'true', MODE: 'live', SEND_ENABLED: 'true' });
  const store = new Store(':memory:');
  const server = createApi(store, c, { healthy: () => true, sync: async () => ({}) }, new SimulationSender());
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  const raw = JSON.stringify(payload());
  const signature = `sha256=${createHmac('sha256', c.META_APP_SECRET).update(raw).digest('hex')}`;
  try {
    assert.equal((await fetch(`${base}/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=123&hub.verify_token=wrong`)).status, 403);
    const verified = await fetch(`${base}/webhooks/whatsapp?hub.mode=subscribe&hub.challenge=123&hub.verify_token=${c.META_WEBHOOK_VERIFY_TOKEN}`);
    assert.equal(verified.status, 200); assert.equal(await verified.text(), '123');
    assert.equal((await fetch(`${base}/cloud/inbox`)).status, 401);
    assert.equal((await fetch(`${base}/webhooks/whatsapp`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: raw })).status, 401);
    for (let i = 0; i < 2; i++) assert.equal((await fetch(`${base}/webhooks/whatsapp`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-hub-signature-256': signature }, body: raw })).status, 200);
    assert.equal(store.cloudInbox().length, 1); assert.equal(store.cloudReplies().length, 1);
    const deniedCampaign = await fetch(`${base}/campaigns`, { method: 'POST', headers: { authorization: `Bearer ${c.ADMIN_API_KEY}`, 'content-type': 'application/json' }, body: '{}' });
    assert.equal(deniedCampaign.status, 409);
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); store.close(); }
});
