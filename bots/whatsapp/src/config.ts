import { resolve } from 'node:path';
import { z } from 'zod';

const bool = z.enum(['true', 'false']).transform(v => v === 'true');
const integer = (min: number, max: number, fallback: string) =>
  z.coerce.number().int().min(min).max(max).default(Number(fallback));

const schema = z.object({
  ADMIN_API_KEY: z.string().min(32),
  AUTH_ENCRYPTION_KEY: z.string().regex(/^[a-fA-F0-9]{64}$/),
  HOST: z.string().default('127.0.0.1'),
  PORT: integer(1, 65535, '3000'),
  DATABASE_PATH: z.string().default('./data/bot.sqlite'),
  MODE: z.enum(['simulation', 'live']).default('simulation'),
  WHATSAPP_PROVIDER: z.enum(['cloud_api', 'baileys']).default('cloud_api'),
  SEND_ENABLED: bool.default(false),
  META_ACCESS_TOKEN: z.string().default(''),
  META_PHONE_NUMBER_ID: z.string().regex(/^\d*$/).default(''),
  META_WABA_ID: z.string().regex(/^\d*$/).default(''),
  META_GRAPH_VERSION: z.string().regex(/^(v\d+\.\d+)?$/).default(''),
  META_APP_SECRET: z.string().regex(/^([a-fA-F0-9]{32})?$/).default(''),
  META_WEBHOOK_VERIFY_TOKEN: z.string().refine(value => !value || value.length >= 32).default(''),
  AUTO_REPLY_ENABLED: bool.default(false),
  TIME_ZONE: z.string().default('America/Argentina/Cordoba'),
  START_HOUR: integer(0, 23, '8'),
  END_HOUR: integer(1, 24, '20'),
  ACTIVE_DAYS: z.string().default('1,2,3,4,5'),
  DAILY_LIMIT: integer(1, 20, '20'),
  SEND_INTERVAL_SECONDS: integer(1, 86400, '1800'),
  BUSINESS_NAME: z.string().trim().min(1).default('Aquatech'),
  SHEETS_SPREADSHEET_ID: z.string().default(''),
  SHEETS_RANGE: z.string().default('Contactos!A:E'),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().default(''),
  SHEETS_SYNC_SECONDS: integer(60, 86400, '600'),
  SHEETS_MAX_AGE_SECONDS: integer(60, 86400, '900'),
});

export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = schema.safeParse(env);
  if (!parsed.success) {
    // No imprimir valores de variables ni secretos en errores de configuración.
    throw new Error(`Configuración inválida: ${parsed.error.issues.map(i => i.path.join('.')).join(', ')}. Ejecutá npm run setup y revisá .env.`);
  }
  const c = parsed.data;
  new Intl.DateTimeFormat('en', { timeZone: c.TIME_ZONE }).format();
  if (c.START_HOUR >= c.END_HOUR) throw new Error('START_HOUR debe ser anterior a END_HOUR');
  const days = c.ACTIVE_DAYS.split(',').map(v => Number(v.trim()));
  if (!days.length || days.some(d => !Number.isInteger(d) || d < 1 || d > 7)) throw new Error('ACTIVE_DAYS inválido');
  if (c.MODE === 'simulation' && c.SEND_ENABLED) throw new Error('SEND_ENABLED solo se usa con MODE=live');
  if (c.MODE === 'live' && !c.SEND_ENABLED) throw new Error('MODE=live requiere SEND_ENABLED=true');
  if (c.MODE === 'live' && c.WHATSAPP_PROVIDER === 'cloud_api') {
    const missing = metaMissing(c);
    if (missing.length) throw new Error(`Falta configurar WhatsApp oficial: ${missing.join(', ')}`);
  }
  if (c.SHEETS_SPREADSHEET_ID && !c.GOOGLE_APPLICATION_CREDENTIALS) throw new Error('Falta GOOGLE_APPLICATION_CREDENTIALS');
  if (c.SHEETS_SYNC_SECONDS >= c.SHEETS_MAX_AGE_SECONDS) throw new Error('La antigüedad máxima de Sheets debe superar el intervalo de sincronización');
  return { ...c, DATABASE_PATH: resolve(c.DATABASE_PATH), activeDays: days };
}
export type Config = ReturnType<typeof loadConfig>;

export function metaMissing(config: Record<string, unknown>) {
  return ['META_ACCESS_TOKEN', 'META_PHONE_NUMBER_ID', 'META_WABA_ID', 'META_GRAPH_VERSION', 'META_APP_SECRET', 'META_WEBHOOK_VERIFY_TOKEN'].filter(key => !config[key]);
}
