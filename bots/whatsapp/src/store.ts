import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { ConflictError, InputError, eligible, isOptOut, normalizeContact, renderMessage, type Campaign, type Contact, type ContactInput, type Job, type Mode, type Scope } from './domain.js';
import type { Inbound } from './cloud-api.js';

export type CloudReply = { id: number; phone: string; body: string; mode: Mode; state: string; created_at: number; expires_at: number; reason: string | null; provider_id: string | null };
const serviceWindow = 24 * 60 * 60 * 1000;

export class Store {
  readonly db: DatabaseSync;
  constructor(path: string) {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(path);
    this.db.exec(`
      PRAGMA journal_mode=WAL;
      PRAGMA synchronous=FULL;
      PRAGMA foreign_keys=ON;
      PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, phone TEXT NOT NULL UNIQUE,
        country TEXT NOT NULL, source TEXT NOT NULL,
        consent_state TEXT NOT NULL DEFAULT 'pending', consent_scope TEXT,
        consent_at TEXT, consent_evidence TEXT
      );
      CREATE TABLE IF NOT EXISTS suppressions (phone TEXT PRIMARY KEY, created_at TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY, template TEXT NOT NULL, scope TEXT NOT NULL,
        scheduled_at TEXT NOT NULL, expires_at TEXT NOT NULL, mode TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY, campaign_id TEXT NOT NULL REFERENCES campaigns(id),
        contact_id TEXT NOT NULL REFERENCES contacts(id), body TEXT NOT NULL,
        mode TEXT NOT NULL, scope TEXT NOT NULL, scheduled_at TEXT NOT NULL,
        expires_at TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'queued',
        provider_id TEXT, reason TEXT,
        UNIQUE(campaign_id, contact_id)
      );
      CREATE INDEX IF NOT EXISTS jobs_pending ON jobs(state, mode, scheduled_at);
      CREATE TABLE IF NOT EXISTS attempts (
        id INTEGER PRIMARY KEY, job_id INTEGER NOT NULL UNIQUE REFERENCES jobs(id),
        mode TEXT NOT NULL, local_day TEXT NOT NULL, created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS audit (
        id INTEGER PRIMARY KEY, event TEXT NOT NULL, contact_id TEXT, detail TEXT NOT NULL, created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS auth_state (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS cloud_inbound (
        id TEXT PRIMARY KEY, phone TEXT NOT NULL, name TEXT NOT NULL, received_at INTEGER NOT NULL,
        type TEXT NOT NULL, text TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS cloud_conversations (phone TEXT PRIMARY KEY, last_message_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS cloud_replies (
        id INTEGER PRIMARY KEY, phone TEXT NOT NULL, body TEXT NOT NULL, mode TEXT NOT NULL,
        source_id TEXT UNIQUE, state TEXT NOT NULL DEFAULT 'queued', created_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL, reason TEXT, provider_id TEXT
      );
      CREATE TABLE IF NOT EXISTS cloud_attempts (reply_id INTEGER PRIMARY KEY REFERENCES cloud_replies(id), mode TEXT NOT NULL, local_day TEXT NOT NULL);
    `);
    if (path !== ':memory:') chmodSync(path, 0o600);
  }
  close() { this.db.close(); }
  transaction<T>(fn: () => T): T {
    this.db.exec('BEGIN IMMEDIATE');
    try { const result = fn(); this.db.exec('COMMIT'); return result; }
    catch (err) { this.db.exec('ROLLBACK'); throw err; }
  }
  setting(key: string) { return (this.db.prepare('SELECT value FROM settings WHERE key=?').get(key) as { value: string } | undefined)?.value; }
  setSetting(key: string, value: string) { this.db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key, value); }
  audit(event: string, contactId: string | null, detail: string, now = new Date()) {
    this.db.prepare('INSERT INTO audit(event,contact_id,detail,created_at) VALUES(?,?,?,?)').run(event, contactId, detail, now.toISOString());
  }
  contact(id: string) { return this.db.prepare('SELECT * FROM contacts WHERE id=?').get(id) as Contact | undefined; }
  contactByPhone(phone: string) { return this.db.prepare('SELECT * FROM contacts WHERE phone=?').get(phone) as Contact | undefined; }
  contacts() { return this.db.prepare('SELECT * FROM contacts ORDER BY id LIMIT 10000').all() as Contact[]; }
  importContacts(rows: ContactInput[]) {
    return this.transaction(() => {
      let added = 0, updated = 0, duplicates = 0;
      for (const row of rows) {
        const existing = this.contact(row.id);
        if (existing && existing.phone !== row.phone) throw new ConflictError(`El teléfono de ${row.id} cambió; requiere revisión, no se transfiere el consentimiento`);
        const samePhone = this.contactByPhone(row.phone);
        if (samePhone && samePhone.id !== row.id) { duplicates++; continue; }
        if (existing) {
          this.db.prepare('UPDATE contacts SET name=?, country=?, source=? WHERE id=?').run(row.name, row.country, row.source, row.id);
          updated++;
        } else {
          const suppressed = this.db.prepare('SELECT phone FROM suppressions WHERE phone=?').get(row.phone);
          this.db.prepare('INSERT INTO contacts(id,name,phone,country,source,consent_state) VALUES(?,?,?,?,?,?)').run(row.id, row.name, row.phone, row.country, row.source, suppressed ? 'revoked' : 'pending');
          added++;
        }
      }
      this.audit('contacts_imported', null, JSON.stringify({ added, updated, duplicates }));
      return { added, updated, duplicates };
    });
  }
  grantConsent(id: string, scope: Scope, at: string, evidence: string, now: Date) {
    const contact = this.contact(id);
    if (!contact) throw new InputError('Contacto inexistente');
    const date = new Date(at);
    if (!Number.isFinite(date.getTime()) || date > now || !evidence.trim() || evidence.length > 2000) throw new InputError('La autorización requiere fecha pasada y evidencia verificable');
    const suppressed = this.db.prepare('SELECT created_at FROM suppressions WHERE phone=?').get(contact.phone) as { created_at: string } | undefined;
    if (suppressed && date <= new Date(suppressed.created_at)) throw new ConflictError('La nueva autorización debe ser posterior a la baja');
    this.transaction(() => {
      this.db.prepare('UPDATE contacts SET consent_state=?,consent_scope=?,consent_at=?,consent_evidence=? WHERE id=?').run('granted', scope, date.toISOString(), evidence.trim(), id);
      this.db.prepare('DELETE FROM suppressions WHERE phone=?').run(contact.phone);
      this.audit('consent_granted', id, JSON.stringify({ scope, at: date.toISOString(), evidence: evidence.trim() }), now);
    });
  }
  revokePhone(phone: string, now = new Date()) {
    this.transaction(() => this.revokePhoneRows(phone, now));
  }
  private revokePhoneRows(phone: string, now: Date) {
      this.db.prepare('INSERT INTO suppressions(phone,created_at) VALUES(?,?) ON CONFLICT(phone) DO UPDATE SET created_at=excluded.created_at').run(phone, now.toISOString());
      this.db.prepare("UPDATE contacts SET consent_state='revoked',consent_scope=NULL WHERE phone=?").run(phone);
      this.db.prepare("UPDATE jobs SET state='cancelled', reason='opt_out' WHERE state='queued' AND contact_id IN(SELECT id FROM contacts WHERE phone=?)").run(phone);
      this.db.prepare("UPDATE cloud_replies SET state='cancelled',reason='opt_out' WHERE phone=? AND state='queued'").run(phone);
      this.audit('consent_revoked', this.contactByPhone(phone)?.id ?? null, 'opt_out', now);
  }
  suppressed(phone: string) { return Boolean(this.db.prepare('SELECT phone FROM suppressions WHERE phone=?').get(phone)); }
  queueCampaign(c: Campaign, business: string) {
    return this.transaction(() => {
      const prev = this.db.prepare('SELECT * FROM campaigns WHERE id=?').get(c.id) as Record<string, string> | undefined;
      if (prev && (prev.template !== c.template || prev.scope !== c.scope || prev.mode !== c.mode || prev.scheduled_at !== c.scheduledAt || prev.expires_at !== c.expiresAt)) throw new ConflictError('El ID de campaña ya existe con otros datos');
      this.db.prepare('INSERT OR IGNORE INTO campaigns(id,template,scope,scheduled_at,expires_at,mode) VALUES(?,?,?,?,?,?)').run(c.id, c.template, c.scope, c.scheduledAt, c.expiresAt, c.mode);
      let queued = 0, ineligible = 0, alreadyExists = 0;
      for (const contact of this.contacts()) {
        if (!eligible(contact, c.scope) || this.suppressed(contact.phone)) { ineligible++; continue; }
        const body = renderMessage(c.template, contact, business);
        const inserted = this.db.prepare('INSERT OR IGNORE INTO jobs(campaign_id,contact_id,body,mode,scope,scheduled_at,expires_at) VALUES(?,?,?,?,?,?,?)').run(c.id, contact.id, body, c.mode, c.scope, c.scheduledAt, c.expiresAt);
        if (inserted.changes) queued++; else alreadyExists++;
      }
      this.audit('campaign_queued', null, JSON.stringify({ id: c.id, queued, ineligible, alreadyExists }));
      return { queued, ineligible, alreadyExists };
    });
  }
  jobs() { return this.db.prepare('SELECT * FROM jobs ORDER BY id DESC LIMIT 1000').all() as Job[]; }
  recoverInterrupted() {
    const result = this.db.prepare("UPDATE jobs SET state='unknown',reason='interrupted' WHERE state='sending'").run();
    const replies = this.db.prepare("UPDATE cloud_replies SET state='unknown',reason='interrupted' WHERE state='sending'").run();
    if (result.changes || replies.changes) this.pause('interrupted_send');
    return Number(result.changes) + Number(replies.changes);
  }
  receiveCloudMessage(message: Inbound, mode: Mode, autoReply: string | undefined, now = new Date()) {
    return this.transaction(() => {
      const inserted = this.db.prepare('INSERT OR IGNORE INTO cloud_inbound(id,phone,name,received_at,type,text) VALUES(?,?,?,?,?,?)')
        .run(message.id, message.phone, message.name, message.at, message.type, message.text);
      if (!inserted.changes) return false;
      let contact = this.contactByPhone(message.phone);
      if (!contact) {
        const parsed = parsePhoneNumberFromString(message.phone);
        const input = normalizeContact({ id: `wa_${message.phone.substring(1)}`, phone: message.phone, name: message.name.trim() || 'Consulta por WhatsApp', country: parsed?.country ?? 'AR', source: 'Consulta entrante por WhatsApp oficial' });
        this.db.prepare('INSERT INTO contacts(id,name,phone,country,source,consent_state) VALUES(?,?,?,?,?,?)').run(input.id, input.name, input.phone, input.country, input.source, this.suppressed(input.phone) ? 'revoked' : 'pending');
        contact = this.contact(input.id)!;
      }
      this.db.prepare('INSERT INTO cloud_conversations(phone,last_message_at) VALUES(?,?) ON CONFLICT(phone) DO UPDATE SET last_message_at=MAX(last_message_at,excluded.last_message_at)').run(message.phone, message.at);
      if (isOptOut(message.text)) this.revokePhoneRows(message.phone, now);
      else {
        this.audit('human_review_required', contact.id, JSON.stringify({ source: 'cloud_api', messageId: message.id, type: message.type }), now);
        // Una consulta entrante habilita atención, nunca consentimiento para campañas de marketing.
        const recent = this.db.prepare('SELECT id FROM cloud_replies WHERE phone=? AND mode=? AND created_at>? LIMIT 1').get(message.phone, mode, now.getTime() - serviceWindow);
        if (autoReply && !recent && !this.suppressed(message.phone) && message.at + serviceWindow - 60000 > now.getTime()) {
          this.db.prepare('INSERT INTO cloud_replies(phone,body,mode,source_id,created_at,expires_at) VALUES(?,?,?,?,?,?)').run(message.phone, autoReply, mode, message.id, now.getTime(), message.at + serviceWindow - 60000);
        }
      }
      return true;
    });
  }
  cloudInbox() { return this.db.prepare('SELECT * FROM cloud_inbound ORDER BY received_at DESC LIMIT 100').all(); }
  cloudReplies() { return this.db.prepare('SELECT * FROM cloud_replies ORDER BY id DESC LIMIT 100').all() as CloudReply[]; }
  queueCloudReply(phone: string, text: string, mode: Mode, now = new Date()) {
    const conversation = this.db.prepare('SELECT last_message_at FROM cloud_conversations WHERE phone=?').get(phone) as { last_message_at: number } | undefined;
    if (!conversation || conversation.last_message_at + serviceWindow - 60000 <= now.getTime()) throw new ConflictError('No hay ventana de atención vigente; se necesita una plantilla aprobada');
    if (this.suppressed(phone)) throw new ConflictError('El contacto pidió la baja');
    const result = this.db.prepare('INSERT INTO cloud_replies(phone,body,mode,created_at,expires_at) VALUES(?,?,?,?,?)').run(phone, text, mode, now.getTime(), conversation.last_message_at + serviceWindow - 60000);
    this.audit('cloud_reply_queued', this.contactByPhone(phone)?.id ?? null, JSON.stringify({ replyId: Number(result.lastInsertRowid), mode }), now);
    return Number(result.lastInsertRowid);
  }
  cloudUsage(mode: Mode, day: string) { return Number((this.db.prepare('SELECT count(*) AS n FROM cloud_attempts WHERE mode=? AND local_day=?').get(mode, day) as { n: number }).n); }
  claimCloudReply(mode: Mode, day: string, limit: number, now = new Date()) {
    return this.transaction(() => {
      if (this.setting('paused') || this.cloudUsage(mode, day) + this.usage(mode, day) >= limit) return;
      this.db.prepare("UPDATE cloud_replies SET state='expired',reason='service_window_closed' WHERE state='queued' AND expires_at<=?").run(now.getTime());
      this.db.prepare("UPDATE cloud_replies SET state='cancelled',reason='opt_out' WHERE state='queued' AND phone IN(SELECT phone FROM suppressions)").run();
      const reply = this.db.prepare("SELECT * FROM cloud_replies WHERE state='queued' AND mode=? ORDER BY id LIMIT 1").get(mode) as CloudReply | undefined;
      if (!reply) return;
      const conversation = this.db.prepare('SELECT last_message_at FROM cloud_conversations WHERE phone=?').get(reply.phone) as { last_message_at: number } | undefined;
      if (!conversation || conversation.last_message_at + serviceWindow - 60000 <= now.getTime()) { this.finishCloudReply(reply.id, 'expired', 'service_window_closed'); return; }
      this.db.prepare("UPDATE cloud_replies SET state='sending' WHERE id=?").run(reply.id);
      this.db.prepare('INSERT INTO cloud_attempts(reply_id,mode,local_day) VALUES(?,?,?)').run(reply.id, mode, day);
      return reply;
    });
  }
  finishCloudReply(id: number, state: string, reason: string | null = null, providerId: string | null = null) {
    this.db.prepare('UPDATE cloud_replies SET state=?,reason=?,provider_id=? WHERE id=?').run(state, reason, providerId, id);
  }
  pause(reason: string) { this.setSetting('paused', reason); this.audit('paused', null, reason); }
  resume() { this.setSetting('paused', ''); this.audit('resumed', null, 'operator'); }
  nextJob(mode: Mode, now: Date) {
    this.db.prepare("UPDATE jobs SET state='expired',reason='expired' WHERE state='queued' AND expires_at<=?").run(now.toISOString());
    return this.db.prepare("SELECT * FROM jobs WHERE state='queued' AND mode=? AND scheduled_at<=? ORDER BY scheduled_at,id LIMIT 1").get(mode, now.toISOString()) as Job | undefined;
  }
  finishJob(id: number, state: string, reason: string | null = null, providerId: string | null = null) {
    this.db.prepare('UPDATE jobs SET state=?,reason=?,provider_id=? WHERE id=?').run(state, reason, providerId, id);
  }
  usage(mode: Mode, day: string) { return Number((this.db.prepare('SELECT count(*) AS n FROM attempts WHERE mode=? AND local_day=?').get(mode, day) as { n: number }).n); }
  claim(job: Job, day: string, limit: number, now: Date, intervalSeconds: number) {
    return this.transaction(() => {
      if (this.setting('paused') || this.usage(job.mode, day) + this.cloudUsage(job.mode, day) >= limit) return false;
      const next = Number(this.setting(`next_send_${job.mode}`) ?? 0);
      if (now.getTime() < next) return false;
      const contact = this.contact(job.contact_id);
      if (!contact || !eligible(contact, job.scope) || this.suppressed(contact.phone)) {
        this.finishJob(job.id, 'cancelled', 'consent_required'); return false;
      }
      const claimed = this.db.prepare("UPDATE jobs SET state='sending' WHERE id=? AND state='queued' AND expires_at>?").run(job.id, now.toISOString());
      if (!claimed.changes) return false;
      this.db.prepare('INSERT INTO attempts(job_id,mode,local_day,created_at) VALUES(?,?,?,?)').run(job.id, job.mode, day, now.toISOString());
      this.setSetting(`next_send_${job.mode}`, String(now.getTime() + intervalSeconds * 1000));
      return true;
    });
  }
  lock() {
    const owner = randomUUID();
    // Una sola instancia; el lease se renueva mientras vive el servidor.
    const heartbeat = () => this.transaction(() => {
      const current = this.setting('process_owner');
      const at = Number(this.setting('process_heartbeat') ?? 0);
      if (current && current !== owner && Date.now() - at < 120000) throw new Error('Ya hay otro proceso usando esta base');
      this.setSetting('process_owner', owner); this.setSetting('process_heartbeat', String(Date.now()));
    });
    heartbeat();
    return {
      heartbeat,
      release: () => this.transaction(() => { if (this.setting('process_owner') === owner) { this.setSetting('process_owner', ''); this.setSetting('process_heartbeat', '0'); } }),
    };
  }
}
