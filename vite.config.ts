import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import site from './site.config.json' with { type: 'json' };

/**
 * Completa los datos del sitio en index.html (%SITE_URL%, %TITLE%, %DESCRIPTION%)
 * e inyecta la analítica solo si está configurada:
 *   VITE_CF_BEACON_TOKEN=xxxxxxxx          → Cloudflare Web Analytics (gratis, sin cookies; recomendado)
 *   VITE_PLAUSIBLE_DOMAIN=aquatech.com.ar  → Plausible (pago, sin cookies)
 *   VITE_GA_ID=G-XXXXXXX                   → Google Analytics 4
 */
function siteHtml(env: Record<string, string>): Plugin {
  const analytics: string[] = [];
  if (env.VITE_CF_BEACON_TOKEN) {
    analytics.push(
      `<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${env.VITE_CF_BEACON_TOKEN}"}'></script>`,
    );
  }
  if (env.VITE_PLAUSIBLE_DOMAIN) {
    analytics.push(
      `<script defer data-domain="${env.VITE_PLAUSIBLE_DOMAIN}" src="https://plausible.io/js/script.js"></script>`,
      `<script>window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}</script>`,
    );
  }
  if (env.VITE_GA_ID) {
    analytics.push(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${env.VITE_GA_ID}"></script>`,
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${env.VITE_GA_ID}');</script>`,
    );
  }
  return {
    name: 'aquatech-site-html',
    transformIndexHtml: {
      order: 'pre',
      handler: (html, ctx) =>
        (ctx.server ? html.replace('<!--base-->', '<base href="/">') : html)
          .replaceAll('%SITE_URL%', site.url)
          .replaceAll('%TITLE%', site.title)
          .replaceAll('%DESCRIPTION%', site.description)
          .replace('</head>', `${analytics.join('\n    ')}\n  </head>`),
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    // Rutas relativas: la web funciona igual en GitHub Pages (/AquaTechSolutions/) y con dominio propio
    base: './',
    plugins: [react(), tailwindcss(), siteHtml(env)],
    // Fecha de compilación: decide qué promos se generan (ver src/data/promo.ts)
    define: { __BUILD_TIME__: JSON.stringify(Date.now()) },
  };
});
