import { parsePhoneNumberFromString, type CountryCode, isSupportedCountry } from 'libphonenumber-js/max';
import type { Config } from './config.js';

export type Mode = 'simulation' | 'live';
export type Scope = 'marketing' | 'service';
export type ContactInput = { id: string; name: string; phone: string; country: string; source: string };
export type Contact = ContactInput & {
  consent_state: 'pending' | 'granted' | 'revoked';
  consent_scope: Scope | null;
  consent_at: string | null;
  consent_evidence: string | null;
};
export type Campaign = {
  id: string; template: string; scope: Scope; scheduledAt: string; expiresAt: string; mode: Mode;
};
export type Job = {
  id: number; campaign_id: string; contact_id: string; body: string; mode: Mode;
  scope: Scope; scheduled_at: string; expires_at: string; state: string;
  provider_id: string | null; reason: string | null;
};

export class InputError extends Error {}
export class ConflictError extends InputError {}

export function normalizeContact(input: ContactInput): ContactInput {
  const country = input.country.trim().toUpperCase();
  if (!isSupportedCountry(country)) throw new InputError('País inválido; usar código ISO como AR');
  const phone = parsePhoneNumberFromString(input.phone.trim(), country as CountryCode);
  if (!phone?.isValid()) throw new InputError('Teléfono inválido; revisar formato internacional y prefijo móvil');
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(input.id)) throw new InputError('contact_id inválido');
  if (!input.name.trim() || input.name.length > 200 || !input.source.trim() || input.source.length > 500) throw new InputError('Falta lugar u origen_contacto, o son demasiado largos');
  return { id: input.id, name: input.name.trim(), phone: phone.number, country, source: input.source.trim() };
}

export function localClock(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', hourCycle: 'h23', weekday: 'short',
  }).formatToParts(now);
  const part = (name: string) => parts.find(p => p.type === name)!.value;
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return { day: `${part('year')}-${part('month')}-${part('day')}`, hour: Number(part('hour')), weekday: weekdays.indexOf(part('weekday')) + 1 };
}

export function withinHours(now: Date, config: Config) {
  const c = localClock(now, config.TIME_ZONE);
  return config.activeDays.includes(c.weekday) && c.hour >= config.START_HOUR && c.hour < config.END_HOUR;
}

export function eligible(contact: Contact, scope: Scope) {
  return contact.consent_state === 'granted' && contact.consent_scope === scope;
}

export function renderMessage(template: string, contact: ContactInput, business: string) {
  if (template.length > 3000 || !template.trim()) throw new InputError('El mensaje debe tener entre 1 y 3000 caracteres');
  if (/\{\{(?!\s*(?:lugar|empresa)\s*\}\})/.test(template)) throw new InputError('Solo se admiten {{lugar}} y {{empresa}}');
  const text = template.replace(/\{\{\s*lugar\s*\}\}/g, () => contact.name).replace(/\{\{\s*empresa\s*\}\}/g, () => business);
  return `${business}: ${text}\n\nSi no querés recibir más mensajes, respondé BAJA.`;
}

export function isOptOut(text: string) {
  const normalized = text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  return /^(baja|stop|cancelar|desuscribir|no gracias)$/.test(normalized)
    || /\b(no (me )?(escriban|escribas|contacten|contactes|manden|envien)( mas)?|no quiero (mas mensajes|recibir mas mensajes)|darme de baja)\b/.test(normalized);
}
