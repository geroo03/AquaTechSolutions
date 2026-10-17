import assert from 'node:assert/strict';

const base = `http://127.0.0.1:${process.env.PORT || '3000'}`;
assert.ok(process.env.ADMIN_API_KEY, 'Falta la clave de la API de prueba');

async function request(path, data) {
  const response = await fetch(`${base}${path}`, {
    method: data === undefined ? 'GET' : 'POST',
    headers: {
      authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
      'content-type': 'application/json',
    },
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: AbortSignal.timeout(10000),
  });
  assert.ok(response.ok, `${path}: HTTP ${response.status}`);
  return response.json();
}

assert.deepEqual(await request('/health'), { ok: true });
const status = await request('/status');
assert.equal(status.mode, 'simulation');
assert.equal(status.whatsappProvider, 'cloud_api');
assert.equal(status.runtimeUid, 1000);
assert.equal(status.autoReplyEnabled, false);
assert.equal(status.usedToday, 0);
assert.equal(status.senderReady, true);
assert.equal(status.dailyLimit, 20);
assert.deepEqual(await request('/cloud/inbox'), []);
assert.deepEqual(await request('/cloud/replies'), []);
assert.equal((await fetch(`${base}/status`)).status, 401);
assert.equal((await fetch(`${base}/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=incorrecto&hub.challenge=123`)).status, 403);

await request('/imports/contacts', { contacts: [{
  id: 'container_smoke', name: 'Contacto ficticio de CI', phone: '+12025550123',
  country: 'US', source: 'Prueba automática del contenedor',
}] });
const contacts = await request('/contacts');
assert.equal(contacts.find(c => c.id === 'container_smoke')?.consent_state, 'pending');

const campaign = {
  id: 'container_smoke_campaign', scope: 'marketing', template: 'Hola {{lugar}}',
  scheduledAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 3600000).toISOString(),
};
const preview = await request('/campaigns/preview', campaign);
assert.equal(preview.eligible, 0);
assert.equal((await request('/campaigns', campaign)).queued, 0);
assert.deepEqual(await request('/jobs'), []);
console.log('Contenedor verificado: API operativa, contactos pendientes y cero mensajes enviados.');
