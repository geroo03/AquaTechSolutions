import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { BufferJSON, initAuthCreds, proto, type AuthenticationCreds, type AuthenticationState, type SignalDataTypeMap } from '@whiskeysockets/baileys';
import type { Store } from './store.js';

export function encryptedAuthState(store: Store, hexKey: string) {
  const key = Buffer.from(hexKey, 'hex');
  const read = (name: string): unknown => {
    const row = store.db.prepare('SELECT value FROM auth_state WHERE key=?').get(name) as { value: string } | undefined;
    if (!row) return null;
    try {
      const payload = Buffer.from(row.value, 'base64');
      const decipher = createDecipheriv('aes-256-gcm', key, payload.subarray(0, 12));
      decipher.setAuthTag(payload.subarray(12, 28));
      const plaintext = Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]);
      return JSON.parse(plaintext.toString('utf8'), BufferJSON.reviver);
    } catch { throw new Error('No se pudo descifrar la sesión; revisar AUTH_ENCRYPTION_KEY y el respaldo'); }
  };
  const write = (name: string, value: unknown) => {
    if (value == null) { store.db.prepare('DELETE FROM auth_state WHERE key=?').run(name); return; }
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value, BufferJSON.replacer)), cipher.final()]);
    const payload = Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64');
    store.db.prepare('INSERT INTO auth_state(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(name, payload);
  };
  const creds = (read('creds') as AuthenticationCreds | null) ?? initAuthCreds();
  const state: AuthenticationState = {
    creds,
    keys: {
      get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => {
        const result: { [id: string]: SignalDataTypeMap[T] } = {};
        for (const id of ids) {
          let value = read(`${type}:${id}`);
          if (type === 'app-state-sync-key' && value) value = proto.Message.AppStateSyncKeyData.fromObject(value as Record<string, unknown>);
          if (value) result[id] = value as SignalDataTypeMap[T];
        }
        return result;
      },
      set: async data => {
        store.transaction(() => {
          for (const [type, entries] of Object.entries(data)) {
            for (const [id, value] of Object.entries(entries ?? {})) write(`${type}:${id}`, value);
          }
        });
      },
    },
  };
  return {
    state,
    saveCreds: (update: Partial<AuthenticationCreds> = {}) => { Object.assign(creds, update); write('creds', creds); },
  };
}
