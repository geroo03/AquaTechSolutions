import { loadConfig } from './config.js';
import { Store } from './store.js';
import { SheetsSync } from './importer.js';
import { Worker, SimulationSender, type Sender } from './worker.js';
import { createApi } from './api.js';
import { CloudApiSender } from './cloud-api.js';
import { CloudWorker } from './cloud-worker.js';

process.umask(0o077);
const config = loadConfig();
const store = new Store(config.DATABASE_PATH);
const lease = store.lock();
store.recoverInterrupted();
const sheets = new SheetsSync(config, store);
let sender: Sender = new SimulationSender();
const official = new CloudApiSender(config);
if (config.MODE === 'live' && config.WHATSAPP_PROVIDER === 'cloud_api') sender = official;
else if (config.MODE === 'live') {
  const { WhatsAppSender } = await import('./whatsapp.js');
  const whatsapp = new WhatsAppSender(store, config);
  whatsapp.connect(); sender = whatsapp;
}
const worker = new Worker(store, config, sender, now => sheets.healthy(now));
const cloudWorker = new CloudWorker(store, config, config.MODE === 'simulation' ? { ready: () => true, sendText: async (_phone, _body, id) => `simulation-cloud-${id}` } : official);
const server = createApi(store, config, sheets, sender);
let shuttingDown = false;
const heartbeat = setInterval(() => {
  try { lease.heartbeat(); }
  catch { store.pause('process_lease_lost'); void shutdown(1); }
}, 10000);

async function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  clearInterval(heartbeat);
  const deadline = setTimeout(() => process.exit(1), 25000);
  deadline.unref();
  const requestsFinished = new Promise<void>(resolve => server.close(() => resolve()));
  await worker.stop();
  await cloudWorker.stop();
  await sheets.stop();
  await requestsFinished;
  await sender.close();
  await official.close();
  lease.release(); store.close();
  process.exitCode = code;
}

server.on('error', () => { console.error('No se pudo abrir el servidor; revisar HOST y PORT'); void shutdown(1); });
server.listen(config.PORT, config.HOST, () => {
  console.log(`Aquatech: ${config.MODE}, API en ${config.HOST}:${config.PORT}. No se imprimen claves ni teléfonos.`);
  sheets.start(() => console.error('Falló Sheets; envíos detenidos hasta sincronizar.'));
  if (config.MODE === 'simulation' || config.WHATSAPP_PROVIDER === 'baileys') worker.start(() => console.error('El procesador se pausó; revisar /status y /audit.'));
  if (config.WHATSAPP_PROVIDER === 'cloud_api') cloudWorker.start();
});
process.on('SIGINT', () => { void shutdown(); });
process.on('SIGTERM', () => { void shutdown(); });
