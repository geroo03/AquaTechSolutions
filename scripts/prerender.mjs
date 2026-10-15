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
const { render, jsonLd } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

const indexPath = path.join(dist, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
if (!html.includes('<!--app-->') || !html.includes('<!--jsonld-->')) {
  throw new Error('dist/index.html no tiene los marcadores <!--app--> / <!--jsonld-->');
}
const ld = JSON.stringify(jsonLd(site)).replace(/</g, '\\u003c');
html = html
  .replace('<!--app-->', render())
  .replace('<!--jsonld-->', `<script type="application/ld+json">${ld}</script>`);
fs.writeFileSync(indexPath, html);

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.url}</loc><lastmod>${today}</lastmod></url>
</urlset>
`,
);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}sitemap.xml\n`);

fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`✓ pre-render listo (${Math.round(html.length / 1024)} KB) + sitemap.xml + robots.txt → ${site.url}`);
