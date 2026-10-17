import { chownSync, existsSync, lstatSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

process.umask(0o077);
// Railway monta los volúmenes como root. Solo el arranque ajusta el disco; la app pierde esos privilegios.
if (process.getuid?.() === 0) {
  const database = resolve(process.env.DATABASE_PATH ?? '/app/data/bot.sqlite');
  if (dirname(database) !== '/app/data') throw new Error('El arranque como root solo admite DATABASE_PATH dentro de /app/data');
  mkdirSync('/app/data', { recursive: true, mode: 0o700 });
  for (const path of ['/app/data', database, `${database}-wal`, `${database}-shm`]) {
    if (!existsSync(path)) continue;
    if (lstatSync(path).isSymbolicLink()) throw new Error('No se permiten enlaces simbólicos en el almacenamiento del bot');
    chownSync(path, 1000, 1000);
  }
  process.setgroups?.([]);
  process.setgid?.(1000);
  process.setuid?.(1000);
}
await import('./main.js');
