/**
 * Después de `vite build`: mete el HTML de la app ya renderizado en dist/index.html
 * (Google y las vistas previas leen el texto sin ejecutar JavaScript) y genera
 * los datos estructurados, sitemap.xml y robots.txt con la URL de site.config.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const site = JSON.parse(fs.readFileSync(path.join(root, 'site.config.json'), 'utf8'));
const { render, jsonLd, pages } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

const indexPath = path.join(dist, 'index.html');
const template = fs.readFileSync(indexPath, 'utf8');
if (!template.includes('<!--app-->') || !template.includes('<!--jsonld-->') || !template.includes('<!--base-->')) {
  throw new Error('dist/index.html no tiene los marcadores <!--app--> / <!--jsonld-->');
}
const escape = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
for (const page of pages) {
  const url = new URL(page.path.slice(1), site.url).href;
  const title = page.path === '/' ? site.title : page.title;
  const description = page.path === '/' ? site.description : page.description;
  const depth = page.path.split('/').filter(Boolean).length;
  const base = depth ? '../'.repeat(depth) : './';
  const ld = JSON.stringify(jsonLd(site, page)).replace(/</g, '\\u003c');
  let html = template
    .replace('<!--base-->', `<base href="${base}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, (_match, before, after) => `${before}${escape(url)}${after}`);
  for (const [attribute, key, value] of [
    ['name', 'description', description], ['property', 'og:title', title],
    ['property', 'og:description', description], ['property', 'og:url', url],
  ]) {
    const expression = new RegExp(`(<meta ${attribute}="${key}" content=")[^"]*(")`);
    html = html.replace(expression, (_match, before, after) => `${before}${escape(value)}${after}`);
  }
  html = html.replace('<!--app-->', render(page.path))
    .replace('<!--jsonld-->', `<script type="application/ld+json">${ld}</script>`);
  const output = path.join(dist, page.path.slice(1), 'index.html');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, html);
  console.log(`✓ ${page.path} (${Math.round(html.length / 1024)} KB)`);
}

fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url><loc>${escape(new URL(page.path.slice(1), site.url).href)}</loc></url>`).join('\n')}
</urlset>
`,
);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}sitemap.xml\n`);

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`✓ ${pages.length} páginas + sitemap.xml + robots.txt → ${site.url}`);
