import { parse } from 'csv-parse/sync';
import { GoogleAuth } from 'google-auth-library';
import type { Config } from './config.js';
import { InputError, normalizeContact, type ContactInput } from './domain.js';
import type { Store } from './store.js';

const columns = ['contact_id', 'lugar', 'telefono', 'pais', 'origen_contacto'];

export function rowsToContacts(values: unknown[][]): ContactInput[] {
  if (!values.length) throw new InputError('La planilla está vacía');
  if (values.length > 10001) throw new InputError('Máximo 10000 contactos por importación');
  const headers = values[0].map(v => String(v).trim().replace(/^\uFEFF/, ''));
  if (columns.some(c => !headers.includes(c)) || new Set(headers).size !== headers.length) throw new InputError(`Encabezados requeridos, sin repetir: ${columns.join(', ')}`);
  const seen = new Set<string>();
  return values.slice(1).flatMap((row, i) => {
    if (row.every(v => String(v ?? '').trim() === '')) return [];
    const value = (key: string) => String(row[headers.indexOf(key)] ?? '').trim();
    try {
      const contact = normalizeContact({ id: value('contact_id'), name: value('lugar'), phone: value('telefono'), country: value('pais'), source: value('origen_contacto') });
      if (seen.has(contact.id)) throw new InputError('contact_id repetido');
      seen.add(contact.id);
      return [contact];
    } catch (error) {
      throw new InputError(`Fila ${i + 2}: ${error instanceof InputError ? error.message : 'datos inválidos'}`);
    }
  });
}

export function parseCsv(text: string) {
  try {
    return rowsToContacts(parse(text, { bom: true, skip_empty_lines: true, relax_column_count: true }) as unknown[][]);
  } catch (error) {
    if (error instanceof InputError) throw error;
    throw new InputError('CSV inválido; usar UTF-8, comas y comillas para campos que contienen comas');
  }
}

export class SheetsSync {
  private running = false;
  private timer?: NodeJS.Timeout;
  private active?: Promise<unknown>;
  private auth: GoogleAuth;
  constructor(private config: Config, private store: Store) {
    this.auth = new GoogleAuth({ keyFile: config.GOOGLE_APPLICATION_CREDENTIALS || undefined, scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });
    // Siempre se exige una sincronización de este proceso antes de enviar.
    if (config.SHEETS_SPREADSHEET_ID) store.setSetting('sheets_healthy', 'false');
  }
  healthy(now: Date) {
    if (!this.config.SHEETS_SPREADSHEET_ID) return true;
    return this.store.setting('sheets_healthy') === 'true'
      && now.getTime() - Number(this.store.setting('sheets_last_success') ?? 0) < this.config.SHEETS_MAX_AGE_SECONDS * 1000;
  }
  async sync() {
    if (!this.config.SHEETS_SPREADSHEET_ID) throw new InputError('Sheets no está configurado');
    if (this.running) throw new InputError('Ya hay una sincronización en curso');
    this.running = true;
    try {
      const client = await this.auth.getClient();
      const id = encodeURIComponent(this.config.SHEETS_SPREADSHEET_ID);
      const range = encodeURIComponent(this.config.SHEETS_RANGE);
      const response = await client.request<{ values?: unknown[][] }>({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}`,
        params: { valueRenderOption: 'FORMATTED_VALUE' },
        timeout: 15000,
      });
      const result = this.store.importContacts(rowsToContacts(response.data.values ?? []));
      this.store.setSetting('sheets_last_success', String(Date.now()));
      this.store.setSetting('sheets_healthy', 'true');
      return result;
    } catch {
      this.store.setSetting('sheets_healthy', 'false');
      this.store.audit('sheets_sync_failed', null, 'Revisar credenciales, acceso y encabezados');
      // Los errores del cliente Google pueden contener claves o respuestas remotas.
      throw new InputError('Falló la sincronización de Sheets; se pausaron nuevos envíos hasta una lectura válida');
    } finally { this.running = false; }
  }
  start(onError: () => void) {
    if (!this.config.SHEETS_SPREADSHEET_ID) return;
    const run = () => { this.active = this.sync().catch(onError); };
    run();
    this.timer = setInterval(run, this.config.SHEETS_SYNC_SECONDS * 1000);
  }
  async stop() { if (this.timer) clearInterval(this.timer); await this.active; }
}
