import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadConfig } from '../src/config.js';
import { isOptOut, normalizeContact, withinHours, type Campaign } from '../src/domain.js';
import { parseCsv, SheetsSync } from '../src/importer.js';
import { Store } from '../src/store.js';
import { Worker, SimulationSender, type Sender } from '../src/worker.js';
import { encryptedAuthState } from '../src/auth-state.js';

export const config = (overrides = {}) => loadConfig({ ADMIN_API_KEY: 'a'.repeat(64), AUTH_ENCRYPTION_KEY: 'b'.repeat(64), WHATSAPP_PROVIDER: 'baileys', ...overrides });
const now = new Date('2026-10-16T12:00:00Z'); // viernes, 09:00 en Córdoba
const contact = normalizeContact({ id: 'local_1', name: 'Local', phone: '+12025550123', country: 'US', source: 'test' });
const second = { ...contact, id: 'local_2', phone: '+12025550124' };
const campaign = (id = 'c1', mode: 'simulation' | 'live' = 'simulation'): Campaign => ({ id, mode, template: 'Hola {{lugar}}', scope: 'marketing', scheduledAt: '2026-10-16T11:00:00.000Z', expiresAt: '2026-10-16T23:00:00.000Z' });
function authorize(store: Store, id = contact.id) { store.grantConsent(id, 'marketing', '2026-10-15T12:00:00Z', 'Formulario de prueba aceptado', now); }
function seeded() { const store = new Store(':memory:'); store.importContacts([contact]); authorize(store); return store; }

test('configuración rechaza booleanos ambiguos y activación parcial', () => {
  assert.throws(() => config({ SEND_ENABLED: 'yes' }));
  assert.throws(() => config({ MODE: 'live' }));
  assert.throws(() => config({ DAILY_LIMIT: '21' }));
  assert.throws(() => config({ ACTIVE_DAYS: '' }));
});

test('horario de Córdoba incluye las 08:00 y excluye las 20:00 y fines de semana', () => {
  const c = config();
  assert.equal(withinHours(new Date('2026-10-16T10:59:59Z'), c), false);
  assert.equal(withinHours(new Date('2026-10-16T11:00:00Z'), c), true);
  assert.equal(withinHours(new Date('2026-10-16T22:59:59Z'), c), true);
  assert.equal(withinHours(new Date('2026-10-16T23:00:00Z'), c), false);
  assert.equal(withinHours(new Date('2026-10-17T12:00:00Z'), c), false);
});

test('CSV importa como pendiente y no toma columnas de permiso como autorización', () => {
  const store = new Store(':memory:');
  const rows = parseCsv('contact_id,lugar,telefono,pais,origen_contacto,consentimiento\nlocal_1,Local,+12025550123,US,Lista,true');
  store.importContacts(rows);
  assert.equal(store.contact('local_1')?.consent_state, 'pending');
  assert.deepEqual(store.queueCampaign(campaign(), 'Aquatech'), { queued: 0, ineligible: 1, alreadyExists: 0 });
  assert.throws(() => parseCsv('contact_id,lugar,telefono,pais,origen_contacto\na,A,no-es-telefono,AR,Lista'));
  store.close();
});

test('duplicados por teléfono no se envían dos veces y cambiar teléfono revierte toda la importación', () => {
  const store = seeded();
  assert.equal(store.importContacts([{ ...contact, id: 'otro' }]).duplicates, 1);
  assert.throws(() => store.importContacts([second, { ...contact, phone: '+12025550125' }]));
  assert.equal(store.contact(second.id), undefined);
  store.queueCampaign(campaign(), 'Aquatech'); store.queueCampaign(campaign(), 'Aquatech');
  assert.equal(store.jobs().length, 1);
  assert.throws(() => store.queueCampaign({ ...campaign(), template: 'Otro texto' }, 'Aquatech'));
  store.close();
});

test('la baja cancela pendientes, sobrevive reimportación y requiere permiso posterior para reactivación', () => {
  const store = seeded(); store.queueCampaign(campaign(), 'Aquatech');
  store.revokePhone(contact.phone, now);
  store.importContacts([contact]);
  assert.equal(store.contact(contact.id)?.consent_state, 'revoked');
  assert.equal(store.jobs()[0].state, 'cancelled');
  assert.throws(() => authorize(store));
  store.close();
});

test('el alcance de atención no habilita marketing', () => {
  const store = new Store(':memory:'); store.importContacts([contact]);
  store.grantConsent(contact.id, 'service', '2026-10-15T12:00:00Z', 'Pedido de aviso operativo', now);
  assert.equal(store.queueCampaign(campaign(), 'Aquatech').queued, 0);
  store.close();
});

test('simulación nunca usa un conector real y persiste el cupo y el espaciado', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'aquatech-'));
  const path = join(directory, 'test.sqlite');
  let store = new Store(path);
  try {
    store.importContacts([contact, second]); authorize(store); authorize(store, second.id);
    store.queueCampaign(campaign(), 'Aquatech');
    let worker = new Worker(store, config({ DAILY_LIMIT: '1' }), new SimulationSender(), () => true);
    await worker.tick(now);
    assert.equal(store.jobs().filter(j => j.state === 'simulated').length, 1);
    store.close(); store = new Store(path);
    worker = new Worker(store, config({ DAILY_LIMIT: '1' }), new SimulationSender(), () => true);
    await worker.tick(new Date(now.getTime() + 3600000));
    assert.equal(store.jobs().filter(j => j.state === 'simulated').length, 1);
    assert.equal(store.usage('simulation', '2026-10-16'), 1);
  } finally { store.close(); rmSync(directory, { recursive: true, force: true }); }
});

test('el worker vuelve a verificar permiso, horario, fuente y espaciado antes de enviar', async () => {
  const store = seeded(); store.importContacts([second]); authorize(store, second.id);
  store.queueCampaign(campaign(), 'Aquatech');
  const worker = new Worker(store, config(), new SimulationSender(), () => true);
  await new Worker(store, config(), new SimulationSender(), () => false).tick(now);
  assert.equal(store.usage('simulation', '2026-10-16'), 0);
  await worker.tick(new Date('2026-10-16T10:00:00Z'));
  assert.equal(store.usage('simulation', '2026-10-16'), 0);
  await worker.tick(now); await worker.tick(new Date(now.getTime() + 1000));
  assert.equal(store.usage('simulation', '2026-10-16'), 1);
  // Cambio de alcance después de poner en cola: tampoco permite el envío.
  store.grantConsent(second.id, 'service', '2026-10-16T11:30:00Z', 'Nuevo alcance operativo', now);
  await worker.tick(new Date(now.getTime() + 1800000));
  assert.equal(store.jobs().find(j => j.contact_id === second.id)?.state, 'cancelled');
  store.close();
});

test('una campaña de simulación no se convierte en envío real al cambiar el modo', async () => {
  const store = seeded(); store.queueCampaign(campaign(), 'Aquatech');
  let calls = 0;
  const sender: Sender = { ready: () => true, send: async () => { calls++; return 'x'; }, close: async () => {} };
  await new Worker(store, config({ MODE: 'live', SEND_ENABLED: 'true' }), sender, () => true).tick(now);
  assert.equal(calls, 0); store.close();
});

test('una falla de envío queda incierta, pausa el worker y no se reintenta', async () => {
  const store = seeded(); store.queueCampaign(campaign(), 'Aquatech');
  let calls = 0;
  const sender: Sender = { ready: () => true, send: async () => { calls++; throw new Error('timeout'); }, close: async () => {} };
  const worker = new Worker(store, config(), sender, () => true);
  await worker.tick(now); await worker.tick(new Date(now.getTime() + 3600000));
  assert.equal(store.jobs()[0].state, 'unknown'); assert.equal(calls, 1);
  assert.equal(store.setting('paused'), 'send_result_unknown');
  store.close();
});

test('dos ticks simultáneos invocan una sola vez el envío', async () => {
  const store = seeded(); store.queueCampaign(campaign(), 'Aquatech');
  let calls = 0;
  const sender: Sender = { ready: () => true, send: async () => { calls++; await new Promise(r => setImmediate(r)); return 'x'; }, close: async () => {} };
  const worker = new Worker(store, config(), sender, () => true);
  await Promise.all([worker.tick(now), worker.tick(now)]);
  assert.equal(calls, 1); store.close();
});

test('reinicio con envío en curso exige revisión y vencidos no se recuperan en ráfaga', () => {
  const store = seeded(); store.queueCampaign(campaign(), 'Aquatech');
  const job = store.nextJob('simulation', now)!;
  store.claim(job, '2026-10-16', 20, now, 1800);
  assert.equal(store.recoverInterrupted(), 1);
  assert.equal(store.jobs()[0].state, 'unknown');
  store.queueCampaign(campaign('c2'), 'Aquatech');
  store.nextJob('simulation', new Date('2026-10-17T12:00:00Z'));
  assert.equal(store.jobs()[0].state, 'expired'); store.close();
});

test('Sheets no se considera fresco solo porque hubo una sincronización antes del reinicio', () => {
  const store = new Store(':memory:'); store.setSetting('sheets_healthy', 'true');
  store.setSetting('sheets_last_success', String(now.getTime()));
  const sheets = new SheetsSync(config({ SHEETS_SPREADSHEET_ID: 'test', GOOGLE_APPLICATION_CREDENTIALS: '/no-se-lee.json' }), store);
  assert.equal(sheets.healthy(now), false); store.close();
});

test('se reconocen solicitudes comunes de baja en español', () => {
  for (const text of ['BAJA', 'Stop!', 'No me escriban más.', 'Quiero darme de baja', 'No quiero recibir más mensajes']) assert.equal(isOptOut(text), true, text);
  assert.equal(isOptOut('Hola, quiero información'), false);
});

test('la sesión persiste cifrada, restaura buffers y rechaza una clave incorrecta', async () => {
  const store = new Store(':memory:');
  const auth = encryptedAuthState(store, 'b'.repeat(64)); auth.saveCreds();
  await auth.state.keys.set({ 'pre-key': { example: { public: Buffer.from('public'), private: Buffer.from('secret-key') } } });
  const raw = JSON.stringify(store.db.prepare('SELECT * FROM auth_state').all());
  assert.equal(raw.includes('secret-key'), false);
  const restored = encryptedAuthState(store, 'b'.repeat(64));
  const key = await restored.state.keys.get('pre-key', ['example']);
  assert.equal(Buffer.from(key.example.private).toString(), 'secret-key');
  assert.throws(() => encryptedAuthState(store, 'c'.repeat(64)));
  await auth.state.keys.set({ 'pre-key': { example: null } });
  assert.deepEqual(await restored.state.keys.get('pre-key', ['example']), {});
  store.close();
});

test('el lease impide dos procesos activos sobre la misma base', () => {
  const store = new Store(':memory:'); const lease = store.lock();
  assert.throws(() => store.lock()); lease.release();
  const next = store.lock(); next.release(); store.close();
});
