import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApi } from '../src/api.js';
import { loadConfig } from '../src/config.js';
import { Store } from '../src/store.js';
import { SimulationSender } from '../src/worker.js';

test('API: autenticación, importación pendiente, autorización explícita y baja persistente', async () => {
  const config = loadConfig({ ADMIN_API_KEY: 'a'.repeat(64), AUTH_ENCRYPTION_KEY: 'b'.repeat(64) });
  const store = new Store(':memory:');
  const server = createApi(store, config, { healthy: () => true, sync: async () => ({ added: 0, updated: 0, duplicates: 0 }) }, new SimulationSender());
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = (server.address() as { port: number }).port;
  async function request(path: string, body?: unknown, authenticated = true) {
    return fetch(`http://127.0.0.1:${port}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { 'content-type': 'application/json', ...(authenticated ? { authorization: `Bearer ${config.ADMIN_API_KEY}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  }
  try {
    assert.equal((await request('/health', undefined, false)).status, 200);
    assert.equal((await request('/contacts', undefined, false)).status, 401);
    assert.equal((await request('/imports/contacts', { contacts: [{ id: 'a', name: 'Ejemplo', phone: '+12025550123', country: 'US', source: 'test' }] })).status, 200);
    const scheduledAt = new Date().toISOString(), expiresAt = new Date(Date.now() + 86400000).toISOString();
    const campaign = { id: 'api_test', template: 'Hola {{lugar}}', scope: 'marketing', scheduledAt, expiresAt };
    assert.equal((await (await request('/campaigns/preview', campaign)).json()).eligible, 0);
    assert.equal((await request('/contacts/a/consent', { scope: 'marketing', at: scheduledAt, evidence: 'Formulario aceptado de prueba' })).status, 400);
    assert.equal((await request('/contacts/a/consent', { scope: 'marketing', at: scheduledAt, evidence: 'Formulario aceptado de prueba', verified: true })).status, 200);
    const queued = await request('/campaigns', campaign);
    assert.equal(queued.status, 201); assert.equal((await queued.json()).queued, 1);
    assert.equal((await request('/contacts/a/revoke', {})).status, 200);
    assert.equal(store.jobs()[0].state, 'cancelled');
    assert.equal((await request('/campaigns', { ...campaign, id: 'other', template: '{{variable_desconocida}}' })).status, 400);
    store.finishJob(store.jobs()[0].id, 'unknown');
    assert.equal((await request('/resume', {})).status, 409);
    assert.equal((await request(`/jobs/${store.jobs()[0].id}/resolve`, { action: 'cancel', note: 'Revisado manualmente por operador' })).status, 200);
    assert.equal((await request('/resume', {})).status, 200);
  } finally {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    store.close();
  }
});
