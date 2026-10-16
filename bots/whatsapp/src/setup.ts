import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

process.umask(0o077);
const example = readFileSync(new URL('../.env.example', import.meta.url), 'utf8');
const content = example.replace(/^ADMIN_API_KEY=$/m, `ADMIN_API_KEY=${randomBytes(32).toString('hex')}`)
  .replace(/^AUTH_ENCRYPTION_KEY=$/m, `AUTH_ENCRYPTION_KEY=${randomBytes(32).toString('hex')}`);
try {
  writeFileSync('.env', content, { flag: 'wx', mode: 0o600 });
  mkdirSync('data', { recursive: true, mode: 0o700 });
  console.log('Se creó .env con claves nuevas y modo simulación. Editá los días y la conexión a Sheets antes de activar.');
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === 'EEXIST') console.log('.env ya existe; no se sobrescribió.');
  else throw error;
}
