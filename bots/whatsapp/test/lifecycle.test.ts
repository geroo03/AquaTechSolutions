import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { once } from 'node:events';

test('el servidor arranca en simulación, importa sin enviar y se apaga liberando la base', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'aquatech-process-'));
  const probe = createServer(); probe.listen(0, '127.0.0.1'); await once(probe, 'listening');
  const port = (probe.address() as { port: number }).port;
  await new Promise<void>(resolve => probe.close(() => resolve()));
  const environment = {
    ...process.env, ADMIN_API_KEY: 'a'.repeat(64), AUTH_ENCRYPTION_KEY: 'b'.repeat(64),
    DATABASE_PATH: join(directory, 'bot.sqlite'), PORT: String(port), HOST: '127.0.0.1',
    MODE: 'simulation', SEND_ENABLED: 'false', SHEETS_SPREADSHEET_ID: '',
  };
  const start = async () => {
    const child = spawn(process.execPath, ['--import', 'tsx', 'src/main.ts'], { env: environment, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', data => { output += data.toString(); });
    child.stderr.on('data', data => { output += data.toString(); });
    const exit = once(child, 'exit');
    const waitUntilReady = async () => {
      const deadline = Date.now() + 10000;
      while (Date.now() < deadline) {
        if (child.exitCode !== null) throw new Error(`El servidor terminó antes de iniciar: ${output}`);
        if (output.includes('API en')) return;
        await new Promise(resolve => setTimeout(resolve, 25));
      }
      throw new Error('El servidor no inició a tiempo');
    };
    try { await waitUntilReady(); }
    catch (error) { child.kill('SIGKILL'); await exit; throw error; }
    return { child, exit };
  };
  let processInfo: Awaited<ReturnType<typeof start>> | undefined;
  try {
    for (let restart = 0; restart < 2; restart++) {
      processInfo = await start();
      const response = await fetch(`http://127.0.0.1:${port}/status`, { headers: { authorization: `Bearer ${environment.ADMIN_API_KEY}` } });
      const status = await response.json();
      assert.equal(status.mode, 'simulation'); assert.equal(status.usedToday, 0);
      const imported = await fetch(`http://127.0.0.1:${port}/imports/contacts`, {
        method: 'POST', headers: { authorization: `Bearer ${environment.ADMIN_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({ contacts: [{ id: 'process_test', name: 'Prueba', phone: '+12025550123', country: 'US', source: 'Prueba de proceso' }] }),
      });
      assert.equal(imported.status, 200);
      processInfo.child.kill('SIGTERM');
      const [code] = await processInfo.exit;
      assert.equal(code, 0);
      processInfo = undefined;
    }
  } finally {
    if (processInfo) { processInfo.child.kill('SIGKILL'); await processInfo.exit; }
    rmSync(directory, { recursive: true, force: true });
  }
});
