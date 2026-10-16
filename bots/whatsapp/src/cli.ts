import { readFileSync } from 'node:fs';
import { loadConfig } from './config.js';
import { parseCsv } from './importer.js';

const config = loadConfig();
const [command, argument] = process.argv.slice(2);
const base = process.env.API_BASE_URL || `http://127.0.0.1:${config.PORT}`;
async function request(path: string, data?: unknown, method = 'POST') {
  const response = await fetch(`${base}${path}`, {
    method, headers: { authorization: `Bearer ${config.ADMIN_API_KEY}`, 'content-type': 'application/json' },
    body: method === 'GET' ? undefined : JSON.stringify(data ?? {}), signal: AbortSignal.timeout(30000),
  });
  const result = await response.json();
  console.log(JSON.stringify(result, null, 2));
  if (!response.ok) process.exitCode = 1;
}
try {
  if (['status', 'contacts', 'jobs', 'audit'].includes(command)) await request(`/${command}`, undefined, 'GET');
  else if (command === 'import-csv' && argument) await request('/imports/contacts', { contacts: parseCsv(readFileSync(argument, 'utf8')) });
  else if (command === 'sync-sheets') await request('/imports/sheets');
  else if ((command === 'campaign' || command === 'preview') && argument) await request(command === 'preview' ? '/campaigns/preview' : '/campaigns', JSON.parse(readFileSync(argument, 'utf8')));
  else if (command === 'consent' && argument) {
    const { contactId, ...data } = JSON.parse(readFileSync(argument, 'utf8'));
    await request(`/contacts/${encodeURIComponent(contactId)}/consent`, data);
  } else if (command === 'revoke' && argument) await request(`/contacts/${encodeURIComponent(argument)}/revoke`);
  else if (command === 'cancel-campaign' && argument) await request(`/campaigns/${encodeURIComponent(argument)}/cancel`);
  else if (command === 'pause' || command === 'resume') await request(`/${command}`);
  else {
    console.error('Uso: npm run cli -- status|contacts|jobs|audit|sync-sheets|import-csv archivo.csv|preview campaña.json|campaign campaña.json|consent autorización.json|revoke contacto|cancel-campaign campaña|pause|resume');
    process.exitCode = 1;
  }
} catch { console.error('No se pudo ejecutar el comando. Revisá los argumentos, el archivo y que el servidor esté iniciado.'); process.exitCode = 1; }
