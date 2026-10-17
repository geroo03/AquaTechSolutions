import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import type { Config } from './config.js';

export function sameSecret(actual: string, expected: string) {
  const a = Buffer.from(actual), b = Buffer.from(expected);
  return !!expected && a.length === b.length && timingSafeEqual(a, b);
}

export function validMetaSignature(raw: Buffer, signature: string, secret: string) {
  if (!secret || !/^sha256=[a-f0-9]{64}$/i.test(signature)) return false;
  return sameSecret(signature.toLowerCase(), `sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`);
}

export class MetaRejectedError extends Error {
  constructor(readonly status: number) { super('Meta rechazó el mensaje; revisar configuración y estado de cuenta'); }
}

export class CloudApiSender {
  private stopped = false;
  constructor(private config: Config, private request: typeof fetch = fetch) {}
  ready() { return !this.stopped && !!this.config.META_ACCESS_TOKEN && !!this.config.META_PHONE_NUMBER_ID && !!this.config.META_GRAPH_VERSION; }
  async send(_phone: string, _body: string, _jobId: number): Promise<string> {
    throw new Error('Las campañas proactivas oficiales requieren plantillas aprobadas; usar la cola de atención entrante');
  }
  async sendText(phone: string, text: string, _replyId: number) {
    if (this.config.MODE !== 'live' || !this.config.SEND_ENABLED || !this.ready()) throw new Error('Envíos oficiales deshabilitados');
    const response = await this.request(`https://graph.facebook.com/${this.config.META_GRAPH_VERSION}/${this.config.META_PHONE_NUMBER_ID}/messages`, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000),
      headers: { authorization: `Bearer ${this.config.META_ACCESS_TOKEN}`, 'content-type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', recipient_type: 'individual', to: phone.replace(/^\+/, ''), type: 'text', text: { preview_url: false, body: text } }),
    });
    // No imprimir respuestas de Meta: pueden contener datos del destinatario.
    if (!response.ok) throw new MetaRejectedError(response.status);
    const data = z.object({ messages: z.array(z.object({ id: z.string().min(1).max(500) })).min(1) }).parse(await response.json());
    return data.messages[0].id;
  }
  async close() { this.stopped = true; }
}

const inboundSchema = z.object({
  object: z.literal('whatsapp_business_account'),
  entry: z.array(z.object({ id: z.string(), changes: z.array(z.object({ field: z.string(), value: z.object({
    metadata: z.object({ phone_number_id: z.string() }).optional(),
    contacts: z.array(z.object({ wa_id: z.string(), profile: z.object({ name: z.string().max(200) }) })).optional(),
    messages: z.array(z.object({
      id: z.string().min(1).max(500), from: z.string().regex(/^\d{8,15}$/), timestamp: z.string().regex(/^\d{1,12}$/), type: z.string().max(50),
      text: z.object({ body: z.string().max(10000) }).optional(),
      button: z.object({ text: z.string().max(1000) }).optional(),
      interactive: z.object({ button_reply: z.object({ id: z.string().max(1000), title: z.string().max(1000) }).optional() }).optional(),
    })).max(100).optional(),
  }) })).max(100) })).max(100),
});

export type Inbound = { id: string; phone: string; name: string; at: number; type: string; text: string };
export function parseMetaMessages(data: unknown, config: Config, now = new Date()): Inbound[] {
  const payload = inboundSchema.parse(data);
  const result: Inbound[] = [];
  for (const entry of payload.entry) {
    if (!config.META_WABA_ID || entry.id !== config.META_WABA_ID) continue;
    for (const change of entry.changes) {
      if (change.field !== 'messages' || !config.META_PHONE_NUMBER_ID || change.value.metadata?.phone_number_id !== config.META_PHONE_NUMBER_ID) continue;
      for (const message of change.value.messages ?? []) {
        const at = Number(message.timestamp) * 1000;
        if (!at || at > now.getTime() + 60000) continue;
        result.push({ id: message.id, phone: `+${message.from}`, name: change.value.contacts?.find(contact => contact.wa_id === message.from)?.profile.name ?? 'Consulta por WhatsApp', at, type: message.type,
          text: message.text?.body ?? message.button?.text ?? message.interactive?.button_reply?.title ?? '' });
      }
    }
  }
  return result;
}

export const AUTO_REPLY = 'Gracias por escribir a AquaTech Solutions. Para preparar tu consulta, contanos qué problema tenés, tu barrio o localidad y los metros cuadrados aproximados. Podés adjuntar fotos del problema. Una persona continuará la atención; atendemos de 8 a 20 h. Para detener las respuestas automáticas, respondé BAJA.';
