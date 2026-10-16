import makeWASocket, { DisconnectReason, jidNormalizedUser, type WASocket } from '@whiskeysockets/baileys';
import pino from 'pino';
import type { Config } from './config.js';
import { encryptedAuthState } from './auth-state.js';
import { isOptOut } from './domain.js';
import type { Store } from './store.js';
import type { Sender } from './worker.js';

export class WhatsAppSender implements Sender {
  private socket?: WASocket;
  private connected = false;
  private stopped = false;
  private reconnect?: NodeJS.Timeout;
  private failures = 0;
  private auth;
  constructor(private store: Store, private config: Config, private onQr?: (qr: string) => void, private onReady?: () => void) {
    this.auth = encryptedAuthState(store, config.AUTH_ENCRYPTION_KEY);
  }
  connect() {
    if (this.stopped) return;
    const socket = makeWASocket({
      auth: this.auth.state,
      logger: pino({ level: 'silent' }),
      markOnlineOnConnect: false,
      syncFullHistory: false,
      getMessage: async () => undefined,
      connectTimeoutMs: 20000,
      defaultQueryTimeoutMs: 20000,
    });
    this.socket = socket;
    socket.ev.on('creds.update', update => {
      try { this.auth.saveCreds(update); }
      catch { this.store.pause('auth_persistence_failed'); void this.close(); }
    });
    socket.ev.on('connection.update', update => {
      if (this.stopped || socket !== this.socket) return;
      if (update.qr) {
        this.store.setSetting('whatsapp_status', 'pairing_required');
        this.onQr?.(update.qr);
      }
      if (update.connection === 'open') {
        this.connected = true; this.failures = 0;
        this.store.setSetting('whatsapp_status', 'connected');
        this.onReady?.();
      }
      if (update.connection === 'close') {
        this.connected = false;
        const error = update.lastDisconnect?.error as { output?: { statusCode?: number } } | undefined;
        const code = error?.output?.statusCode;
        this.store.setSetting('whatsapp_status', 'disconnected');
        if ([DisconnectReason.loggedOut, DisconnectReason.forbidden, DisconnectReason.connectionReplaced, DisconnectReason.badSession].includes(code ?? 0)) {
          this.store.pause('whatsapp_requires_review'); return;
        }
        if (++this.failures > 5) { this.store.pause('whatsapp_reconnect_failed'); return; }
        this.reconnect = setTimeout(() => this.connect(), Math.min(120000, 5000 * 2 ** (this.failures - 1)));
      }
    });
    socket.ev.on('messages.upsert', event => {
      if (event.type !== 'notify' || this.stopped) return;
      void (async () => {
        for (const message of event.messages) {
          if (message.key.fromMe) continue;
          const candidates = [message.key.remoteJid, message.key.remoteJidAlt];
          let jid = candidates.find(j => j?.endsWith('@s.whatsapp.net')) ?? candidates.find(j => j?.endsWith('@lid')) ?? '';
          if (jid.endsWith('@lid')) jid = await socket.signalRepository.lidMapping.getPNForLID(jid) ?? '';
          if (this.stopped || !jid.endsWith('@s.whatsapp.net')) continue;
          const phone = `+${jidNormalizedUser(jid).split('@')[0]}`;
          const text = message.message?.conversation ?? message.message?.extendedTextMessage?.text ?? '';
          if (isOptOut(text)) this.store.revokePhone(phone);
          else {
            const contact = this.store.contactByPhone(phone);
            if (contact) this.store.audit('human_review_required', contact.id, 'Mensaje entrante; revisar en WhatsApp Business');
          }
        }
      })().catch(() => this.store.pause('inbound_processing_failed'));
    });
  }
  ready() { return this.connected && !this.stopped; }
  async send(phone: string, body: string, _jobId: number) {
    if (!this.ready() || !this.socket) throw new Error('WhatsApp no conectado');
    const result = await this.socket.sendMessage(`${phone.substring(1)}@s.whatsapp.net`, { text: body });
    if (!result?.key.id) throw new Error('WhatsApp no devolvió un identificador');
    return result.key.id;
  }
  async close() {
    this.stopped = true; this.connected = false;
    if (this.reconnect) clearTimeout(this.reconnect);
    this.socket?.ev.removeAllListeners('creds.update');
    this.socket?.ev.removeAllListeners('messages.upsert');
    this.socket?.end(undefined);
  }
}
