import assert from 'node:assert/strict';
import { test } from 'node:test';
import { escapeHtml, secureHtml, validateAnalytics } from '../scripts/security.ts';

test('la configuración de analítica rechaza inyección sin mostrar valores en los errores', () => {
  validateAnalytics({ VITE_CF_BEACON_TOKEN: '0'.repeat(32), VITE_GA_ID: 'G-TEST1234', VITE_PLAUSIBLE_DOMAIN: 'aquatechsolutions.com.ar' });
  for (const key of ['VITE_CF_BEACON_TOKEN', 'VITE_GA_ID', 'VITE_PLAUSIBLE_DOMAIN']) {
    assert.throws(() => validateAnalytics({ [key]: '\"><script>alert(1)</script>' }), { message: `Formato inválido para ${key}` });
  }
});

test('el HTML de producción no acepta scripts de un origen desconocido', () => {
  assert.throws(() => secureHtml('<meta charset="UTF-8"><script src="https://evil.invalid/track.js"></script>'), /Origen de script externo no permitido/);
  assert.throws(() => secureHtml('<meta charset="UTF-8"><script src="https://static.cloudflareinsights.com.evil.invalid/script.js"></script>'), /Origen de script externo no permitido/);
  assert.throws(() => secureHtml('<script src="./main.js"></script>'), /Falta charset/);
});

test('la política mantiene solo los proveedores configurados y escapa el HTML', () => {
  const html = secureHtml('<meta charset="UTF-8"><script src="https://static.cloudflareinsights.com/beacon.min.js"></script><script>document.documentElement.classList.add("js")</script>');
  assert.ok(html.indexOf('Content-Security-Policy') < html.indexOf('<script'));
  assert.ok(html.includes('https://cloudflareinsights.com'));
  assert.ok(!html.includes('google-analytics.com'));
  assert.ok(!html.includes('plausible.io'));
  assert.equal(escapeHtml('<img title="x" onerror=\'alert(1)\'>&'), '&lt;img title=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt;&amp;');
});
