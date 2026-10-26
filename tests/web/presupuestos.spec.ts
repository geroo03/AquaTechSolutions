import { test, expect, type Page } from '@playwright/test';
import supabase from '../../src/presupuestos/supabase.json' with { type: 'json' };

// Supabase simulado: la prueba no toca la base real.
async function mockSupabase(page: Page) {
  const saved: unknown[] = [];
  const b64 = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const user = { id: '00000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated', email: 'martin@example.com', app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() };
  const token = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: user.id, email: user.email, role: 'authenticated', aud: 'authenticated', exp })}.firma`;
  await page.route(`${supabase.url}/**`, async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === '/auth/v1/token') {
      const body = request.postDataJSON();
      if (body.password !== 'clave-correcta') return route.fulfill({ status: 400, json: { code: 400, error_code: 'invalid_credentials', msg: 'Invalid login credentials' } });
      return route.fulfill({ json: { access_token: token, token_type: 'bearer', expires_in: 3600, expires_at: exp, refresh_token: 'refresh', user } });
    }
    if (url.pathname.startsWith('/rest/v1/')) {
      if (request.method() === 'GET') return route.fulfill({ json: [] });
      if (request.method() === 'POST') {
        saved.push(...[request.postDataJSON()].flat());
        return route.fulfill({ status: 201, json: [] });
      }
    }
    return route.fulfill({ json: {} });
  });
  return saved;
}

test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, route => route.fulfill({ contentType: 'text/html', body: '' }));
});

test('panel de presupuestos: pide login, calcula, guarda en la nube y genera el PDF', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && !message.text().includes('status of 400')) errors.push(message.text()); });
  const saved = await mockSupabase(page);
  await page.goto('/presupuestos/');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content', new RegExp(`connect-src 'self' ${supabase.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[ ;]`));

  // Sin login no se ve el panel
  await expect(page.getByRole('heading', { name: 'Ingresar' })).toBeVisible();
  await expect(page.getByLabel('Nombre y apellido')).toHaveCount(0);
  await page.getByLabel('Email').fill('martin@example.com');
  await page.getByLabel('Contraseña').fill('otra');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page.getByRole('alert')).toHaveText('El mail o la contraseña no son correctos.');
  await page.getByLabel('Contraseña').fill('clave-correcta');
  await page.getByRole('button', { name: 'Entrar' }).click();

  await page.getByLabel('Nombre y apellido').fill('Cliente de Prueba');
  await page.getByLabel('Cantidad').first().fill('140');
  await page.getByRole('button', { name: 'Agregar trabajo' }).click();
  await page.getByLabel('Unidad').nth(1).selectOption('global');
  await page.getByLabel(/^Precio/).nth(1).fill('85.000');
  await page.getByLabel('Descuento (%)').fill('10');
  await expect(page.locator('[data-total]')).toHaveText('$1.336.500');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.getByText('Guardado en la nube')).toBeVisible();
  expect(JSON.stringify(saved)).toContain('Cliente de Prueba');

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /^(PDF|Descargar PDF)$/ }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('Presupuesto-AquaTech-0001-Cliente-de-Prueba.pdf');
  const chunks: Buffer[] = [];
  for await (const chunk of await file.createReadStream()) chunks.push(chunk as Buffer);
  expect(Buffer.concat(chunks).subarray(0, 5).toString()).toBe('%PDF-');
  expect(errors).toEqual([]);
});

test('robots.txt excluye el panel y el sitemap no lo lista', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /presupuestos/');
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('presupuestos');
});
