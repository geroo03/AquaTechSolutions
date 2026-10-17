import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { metaMissing, type Config } from './config.js';
import { AUTO_REPLY, parseMetaMessages, sameSecret, validMetaSignature } from './cloud-api.js';
import { ConflictError, InputError, eligible, localClock, normalizeContact, renderMessage, type Campaign } from './domain.js';
import type { SheetsSync } from './importer.js';
import type { Store } from './store.js';
import type { Sender } from './worker.js';

const contactSchema = z.object({ id: z.string(), name: z.string(), phone: z.string(), country: z.string(), source: z.string() }).strict();
const campaignSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/),
  template: z.string().trim().min(1).max(3000),
  scope: z.enum(['marketing', 'service']),
  scheduledAt: z.iso.datetime({ offset: true }),
  expiresAt: z.iso.datetime({ offset: true }),
}).strict();

async function rawBody(req: IncomingMessage) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new InputError('Content-Type debe ser application/json');
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 2 * 1024 * 1024) throw new InputError('Máximo 2 MB por solicitud');
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
async function body(req: IncomingMessage): Promise<unknown> {
  try { return JSON.parse((await rawBody(req)).toString('utf8')); }
  catch { throw new InputError('JSON inválido'); }
}

function json(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  res.end(JSON.stringify(data));
}

export function createApi(store: Store, config: Config, sheets: Pick<SheetsSync, 'sync' | 'healthy'>, sender: Sender) {
  const secret = Buffer.from(`Bearer ${config.ADMIN_API_KEY}`);
  return createServer({ requestTimeout: 30000, headersTimeout: 10000 }, async (req, res) => {
    try {
      const path = new URL(req.url ?? '/', 'http://localhost').pathname;
      if (req.method === 'GET' && path === '/health') { json(res, 200, { ok: true }); return; }
      if (path === '/webhooks/whatsapp' && config.WHATSAPP_PROVIDER === 'cloud_api') {
        if (req.method === 'GET') {
          const params = new URL(req.url!, 'http://localhost').searchParams;
          const challenge = params.get('hub.challenge') ?? '';
          if (params.get('hub.mode') !== 'subscribe' || !sameSecret(params.get('hub.verify_token') ?? '', config.META_WEBHOOK_VERIFY_TOKEN) || !/^\d{1,100}$/.test(challenge)) { json(res, 403, { error: 'Verificación inválida' }); return; }
          res.writeHead(200, { 'content-type': 'text/plain', 'cache-control': 'no-store' }); res.end(challenge); return;
        }
        if (req.method === 'POST') {
          const raw = await rawBody(req);
          const signature = req.headers['x-hub-signature-256'];
          if (typeof signature !== 'string' || !validMetaSignature(raw, signature, config.META_APP_SECRET)) { json(res, 401, { error: 'Firma inválida' }); return; }
          let data: unknown;
          try { data = JSON.parse(raw.toString('utf8')); } catch { throw new InputError('JSON inválido'); }
          for (const message of parseMetaMessages(data, config)) store.receiveCloudMessage(message, config.MODE, config.AUTO_REPLY_ENABLED ? AUTO_REPLY : undefined);
          json(res, 200, { ok: true }); return;
        }
      }
      const token = Buffer.from(req.headers.authorization ?? '');
      if (token.length !== secret.length || !timingSafeEqual(token, secret)) { json(res, 401, { error: 'No autorizado' }); return; }
      if (req.method === 'GET' && path === '/status') {
        const now = new Date();
        json(res, 200, { mode: config.MODE, runtimeUid: process.getuid?.(), whatsappProvider: config.WHATSAPP_PROVIDER, metaMissing: metaMissing(config), autoReplyEnabled: config.AUTO_REPLY_ENABLED, paused: store.setting('paused') || false, senderReady: sender.ready(), sheetsHealthy: sheets.healthy(now), day: localClock(now, config.TIME_ZONE).day, usedToday: store.usage(config.MODE, localClock(now, config.TIME_ZONE).day) + store.cloudUsage(config.MODE, localClock(now, config.TIME_ZONE).day), dailyLimit: config.DAILY_LIMIT, hours: [config.START_HOUR, config.END_HOUR], activeDays: config.activeDays, timeZone: config.TIME_ZONE }); return;
      }
      if (req.method === 'GET' && path === '/cloud/inbox') { json(res, 200, store.cloudInbox()); return; }
      if (req.method === 'GET' && path === '/cloud/replies') { json(res, 200, store.cloudReplies()); return; }
      if (req.method === 'POST' && path === '/cloud/replies') {
        if (config.WHATSAPP_PROVIDER !== 'cloud_api') throw new InputError('El proveedor oficial no está seleccionado');
        const data = z.object({ contactId: z.string(), text: z.string().trim().min(1).max(3000) }).strict().parse(await body(req));
        const contact = store.contact(data.contactId);
        if (!contact) throw new InputError('Contacto inexistente');
        json(res, 201, { id: store.queueCloudReply(contact.phone, data.text, config.MODE) }); return;
      }
      const cloudResolve = path.match(/^\/cloud\/replies\/([0-9]+)\/resolve$/);
      if (req.method === 'POST' && cloudResolve) {
        const data = z.object({ action: z.enum(['mark_sent', 'cancel']), note: z.string().trim().min(10).max(1000) }).strict().parse(await body(req));
        const reply = store.db.prepare('SELECT state FROM cloud_replies WHERE id=?').get(Number(cloudResolve[1])) as { state: string } | undefined;
        if (reply?.state !== 'unknown') throw new ConflictError('La respuesta no está pendiente de revisión');
        store.finishCloudReply(Number(cloudResolve[1]), data.action === 'mark_sent' ? 'sent' : 'cancelled', 'operator_reviewed');
        store.audit('cloud_reply_reviewed', null, JSON.stringify({ replyId: Number(cloudResolve[1]), ...data }));
        json(res, 200, { ok: true }); return;
      }
      if (req.method === 'GET' && path === '/contacts') { json(res, 200, store.contacts()); return; }
      if (req.method === 'GET' && path === '/jobs') { json(res, 200, store.jobs()); return; }
      if (req.method === 'GET' && path === '/audit') { json(res, 200, store.db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 100').all()); return; }
      if (req.method === 'POST' && path === '/imports/contacts') {
        const data = z.object({ contacts: z.array(contactSchema).max(10000) }).strict().parse(await body(req));
        const contacts = data.contacts.map(normalizeContact);
        if (new Set(contacts.map(c => c.id)).size !== contacts.length) throw new InputError('contact_id repetido');
        json(res, 200, store.importContacts(contacts)); return;
      }
      if (req.method === 'POST' && path === '/imports/sheets') { json(res, 200, await sheets.sync()); return; }
      const consentPath = path.match(/^\/contacts\/([a-zA-Z0-9_-]+)\/consent$/);
      if (req.method === 'POST' && consentPath) {
        const data = z.object({ scope: z.enum(['marketing', 'service']), at: z.iso.datetime({ offset: true }), evidence: z.string().trim().min(10).max(2000), verified: z.literal(true) }).strict().parse(await body(req));
        store.grantConsent(consentPath[1], data.scope, data.at, data.evidence, new Date());
        json(res, 200, { ok: true }); return;
      }
      const revokePath = path.match(/^\/contacts\/([a-zA-Z0-9_-]+)\/revoke$/);
      if (req.method === 'POST' && revokePath) {
        const contact = store.contact(revokePath[1]);
        if (!contact) throw new InputError('Contacto inexistente');
        store.revokePhone(contact.phone); json(res, 200, { ok: true }); return;
      }
      if (req.method === 'POST' && (path === '/campaigns' || path === '/campaigns/preview')) {
        if (config.MODE === 'live' && config.WHATSAPP_PROVIDER === 'cloud_api' && path === '/campaigns') throw new ConflictError('Las campañas proactivas oficiales requieren plantillas aprobadas; este conector habilita atención entrante');
        const data = campaignSchema.parse(await body(req));
        const scheduledAt = new Date(data.scheduledAt).toISOString();
        const expiresAt = new Date(data.expiresAt).toISOString();
        if (expiresAt <= scheduledAt || new Date(expiresAt) <= new Date()) throw new InputError('La campaña debe tener una vigencia futura y posterior al inicio');
        // Validar la plantilla incluso si no hay destinatarios autorizados.
        renderMessage(data.template, { id: 'preview', name: 'Ejemplo', phone: '', country: '', source: '' }, config.BUSINESS_NAME);
        const campaign: Campaign = { ...data, scheduledAt, expiresAt, mode: config.MODE };
        if (path.endsWith('/preview')) {
          const contacts = store.contacts();
          const allowed = contacts.filter(c => eligible(c, data.scope) && !store.suppressed(c.phone));
          json(res, 200, { mode: config.MODE, eligible: allowed.length, ineligible: contacts.length - allowed.length, sample: allowed.slice(0, 20).map(c => ({ contactId: c.id, body: renderMessage(data.template, c, config.BUSINESS_NAME) })) }); return;
        }
        json(res, 201, store.queueCampaign(campaign, config.BUSINESS_NAME)); return;
      }
      const cancelPath = path.match(/^\/campaigns\/([a-zA-Z0-9_-]+)\/cancel$/);
      if (req.method === 'POST' && cancelPath) {
        const result = store.db.prepare("UPDATE jobs SET state='cancelled',reason='operator_cancelled' WHERE campaign_id=? AND state='queued'").run(cancelPath[1]);
        store.audit('campaign_cancelled', null, cancelPath[1]); json(res, 200, { cancelled: Number(result.changes) }); return;
      }
      if (req.method === 'POST' && path === '/pause') { store.pause('operator'); json(res, 200, { ok: true }); return; }
      if (req.method === 'POST' && path === '/resume') {
        if (store.db.prepare("SELECT id FROM jobs WHERE state='unknown' LIMIT 1").get() || store.db.prepare("SELECT id FROM cloud_replies WHERE state='unknown' LIMIT 1").get()) throw new ConflictError('Hay envíos inciertos pendientes de revisión; resolverlos antes de reanudar');
        store.resume(); json(res, 200, { ok: true }); return;
      }
      const resolvePath = path.match(/^\/jobs\/([0-9]+)\/resolve$/);
      if (req.method === 'POST' && resolvePath) {
        const data = z.object({ action: z.enum(['mark_sent', 'cancel']), note: z.string().trim().min(10).max(1000) }).strict().parse(await body(req));
        const job = store.db.prepare('SELECT state FROM jobs WHERE id=?').get(Number(resolvePath[1])) as { state: string } | undefined;
        if (job?.state !== 'unknown') throw new ConflictError('El envío no está pendiente de revisión');
        store.finishJob(Number(resolvePath[1]), data.action === 'mark_sent' ? 'sent' : 'cancelled', 'operator_reviewed');
        store.audit('job_reviewed', null, JSON.stringify({ jobId: Number(resolvePath[1]), ...data }));
        json(res, 200, { ok: true }); return;
      }
      json(res, 404, { error: 'Ruta inexistente' });
    } catch (error) {
      if (error instanceof z.ZodError) json(res, 400, { error: 'Datos inválidos', fields: error.issues.map(i => i.path.join('.')) });
      else if (error instanceof InputError) json(res, error instanceof ConflictError ? 409 : 400, { error: error.message });
      else json(res, 500, { error: 'Error interno; revisar el estado del servidor' });
    }
  });
}
