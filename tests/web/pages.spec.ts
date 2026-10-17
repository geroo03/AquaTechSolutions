import { test, expect } from '@playwright/test';
import { PAGES } from '../../src/routes';
import { chooseAttribution, enrichWhatsAppLink } from '../../src/attribution';

test.beforeEach(async ({ context }) => {
  // La prueba no envía visitas de ensayo a proveedores de analítica ni abre WhatsApp real.
  await context.route(/^https?:\/\/(?!127\.0\.0\.1:4173)/, route => route.fulfill({
    contentType: route.request().resourceType() === 'script' ? 'application/javascript' : 'text/html',
    body: '',
  }));
});

for (const route of PAGES) {
  test(`${route.label}: HTML, metadatos, imágenes y diseño`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:4173')) errors.push(`${response.status()} ${response.url()}`); });
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://aquatechsolutions.com.ar${route.path}`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://aquatechsolutions.com.ar${route.path}`);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', route.description);
    const data = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(data!)).toHaveProperty('@context', 'https://schema.org');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.evaluate(async () => {
      // Cargar también las fotos lazy antes de comprobar recursos y guardar la captura.
      for (const image of document.images) image.loading = 'eager';
      await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
    });
    expect(await page.locator('img').evaluateAll(elements => (elements as HTMLImageElement[]).filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src))).toEqual([]);
    await page.screenshot({ path: info.outputPath(`${route.kind}-${route.serviceId ?? route.label}.png`), fullPage: true, animations: 'disabled' });
    expect(errors).toEqual([]);
  });
}

test('la navegación conserva el origen y el mensaje de WhatsApp no se duplica', async ({ page }) => {
  await page.goto('/?utm_source=instagram&utm_campaign=bio');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.locator('a[href="./servicios/impermeabilizacion-techos/"]').first().click();
  await expect(page).toHaveURL(/\/servicios\/impermeabilizacion-techos\/$/);
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  const link = page.getByRole('link', { name: 'Consultar por mi techo', exact: true }).first();
  for (let click = 0; click < 2; click++) {
    const opened = page.waitForEvent('popup');
    await link.click();
    const popup = await opened;
    await popup.waitForLoadState();
    const text = new URL(popup.url()).searchParams.get('text')!;
    expect(text).toContain('presupuesto de impermeabilización de techo');
    expect(text).toContain('Origen: Instagram');
    expect(text).toContain('Página: Techos');
    expect(text).toContain('Entrada: Inicio');
    expect(text).toContain('Campaña: bio');
    expect(text.match(/Origen:/g)).toHaveLength(1);
    await popup.close();
  }
  await page.getByRole('link', { name: /Country GreenVille, Córdoba/ }).click();
  await expect(page).toHaveURL(/\/trabajos\/greenville\/$/);
  await page.getByRole('link', { name: 'Inicio', exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173/');
});

test('el servicio abre su cotizador y las preguntas funcionan', async ({ page }) => {
  await page.goto('/servicios/humedad-cimientos/');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: 'Armar mi consulta' }).click();
  const dialog = page.getByRole('dialog', { name: 'Cotizador' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('- Trabajo: Humedad de cimientos', { exact: false })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  const faq = page.locator('details').first();
  await faq.locator('summary').click();
  await expect(faq).toHaveAttribute('open', '');
});

test('el diagnóstico por fotos incluye el origen al abrir WhatsApp desde el formulario', async ({ page }) => {
  await page.goto('/?utm_source=facebook&utm_campaign=diagnostico');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  await page.getByRole('button', { name: 'Empezar', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Diagnóstico por fotos' });
  await dialog.getByPlaceholder('Ej: Cerro, Villa Allende').fill('Córdoba');
  const opened = page.waitForEvent('popup');
  await dialog.getByRole('button', { name: 'Continuar en WhatsApp' }).click();
  const popup = await opened;
  await popup.waitForLoadState();
  const text = new URL(popup.url()).searchParams.get('text')!;
  expect(text).toContain('diagnóstico por fotos');
  expect(text).toContain('Córdoba');
  expect(text).toContain('Origen: Facebook');
  expect(text).toContain('Campaña: diagnostico');
  await popup.close();
});

test('bloquear sessionStorage no impide abrir una consulta con su origen actual', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Bloqueado', 'SecurityError'); } }));
  await page.goto('/servicios/impermeabilizacion-techos/?utm_source=instagram');
  await expect(page.locator('html')).toHaveAttribute('data-ready', 'true');
  const opened = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Consultar por mi techo', exact: true }).first().click();
  const popup = await opened;
  await popup.waitForLoadState();
  expect(new URL(popup.url()).searchParams.get('text')).toContain('Origen: Instagram');
  await popup.close();
});

test('el contenido y la navegación de las páginas existen sin JavaScript', async ({ browser }, info) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: info.project.use.viewport });
  const page = await context.newPage();
  try {
    for (const route of PAGES) {
      const response = await page.goto(`http://127.0.0.1:4173${route.path}`);
      expect(response?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
      expect(await page.locator('main').innerText()).not.toHaveLength(0);
      if (route.kind === 'service') {
        const faq = page.locator('details').first();
        await faq.locator('summary').click();
        await expect(faq).toHaveAttribute('open', '');
      }
    }
  } finally { await context.close(); }
});

test('el sitemap incluye las cinco páginas', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  for (const route of PAGES) expect(xml).toContain(`<loc>https://aquatechsolutions.com.ar${route.path}</loc>`);
});

test('atribución: etiquetas acotadas, referencias externas y navegación interna', () => {
  const existing = { source: 'instagram' as const, landing: 'Inicio', campaign: 'bio' };
  expect(chooseAttribution('', 'https://aquatechsolutions.com.ar/', 'https://aquatechsolutions.com.ar', 'Techos', existing)).toEqual(existing);
  expect(chooseAttribution('', 'https://www.google.com.ar/search?q=techo', 'https://aquatechsolutions.com.ar', 'Techos').source).toBe('google');
  expect(chooseAttribution('?utm_source=__proto__', '', 'https://aquatechsolutions.com.ar', 'Inicio').source).toBe('otro');
  const unsafe = chooseAttribution('?utm_source=instagram&utm_campaign=persona%40ejemplo.com&telefono=12345', '', 'https://aquatechsolutions.com.ar', 'Inicio');
  expect(unsafe.campaign).toBeUndefined();
  const link = enrichWhatsAppLink('https://wa.me/5493516134658?text=Hola', unsafe, 'Techos');
  expect(link).not.toContain('12345'); expect(link).not.toContain('ejemplo.com');
});
