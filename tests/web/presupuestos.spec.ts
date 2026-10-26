import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, route => route.fulfill({ contentType: 'text/html', body: '' }));
});

test('panel de presupuestos: calcula, guarda y genera el PDF sin errores', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/presupuestos/');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(1);

  await page.getByLabel('Nombre y apellido').fill('Cliente de Prueba');
  await page.getByLabel('Cantidad').first().fill('140');
  await page.getByRole('button', { name: 'Agregar trabajo' }).click();
  await page.getByLabel('Unidad').nth(1).selectOption('global');
  await page.getByLabel(/^Precio/).nth(1).fill('85.000');
  await page.getByLabel('Descuento (%)').fill('10');
  await expect(page.locator('[data-total]')).toHaveText('$1.336.500');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /^(PDF|Descargar PDF)$/ }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe('Presupuesto-AquaTech-0001-Cliente-de-Prueba.pdf');
  const stream = await file.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk as Buffer);
  expect(Buffer.concat(chunks).subarray(0, 5).toString()).toBe('%PDF-');

  // Queda guardado al recargar
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: /Historial/ }).click();
  await expect(page.getByRole('dialog')).toContainText('Cliente de Prueba');
  expect(errors).toEqual([]);
});

test('robots.txt excluye el panel y el sitemap no lo lista', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /presupuestos/');
  expect(await (await request.get('/sitemap.xml')).text()).not.toContain('presupuestos');
});
