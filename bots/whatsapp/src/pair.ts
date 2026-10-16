import qrcode from 'qrcode-terminal';
import { loadConfig } from './config.js';
import { Store } from './store.js';
import { WhatsAppSender } from './whatsapp.js';

if (!process.stdout.isTTY) throw new Error('La vinculación requiere una terminal interactiva; no guardar el QR en logs');
process.umask(0o077);
const config = loadConfig();
const store = new Store(config.DATABASE_PATH);
const lease = store.lock();
let closing = false;
const sender = new WhatsAppSender(store, config, qr => qrcode.generate(qr, { small: true }), () => {
  console.log('Sesión vinculada y cifrada. Este comando no envía mensajes.');
  setTimeout(() => { void close(); }, 3000);
});
const heartbeat = setInterval(() => { try { lease.heartbeat(); } catch { void close(); } }, 10000);
const timeout = setTimeout(() => { console.error('Vinculación finalizada por tiempo de espera.'); void close(); }, 120000);
async function close() {
  if (closing) return;
  closing = true; clearInterval(heartbeat); clearTimeout(timeout);
  await sender.close(); lease.release(); store.close();
}
process.on('SIGINT', () => { void close(); });
process.on('SIGTERM', () => { void close(); });
console.log('Detené el servidor antes de vincular. Escaneá este QR desde Dispositivos vinculados.');
sender.connect();
