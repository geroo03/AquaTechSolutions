import { createHash } from 'node:crypto';

export function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** La configuración de analítica nunca puede insertar HTML o JavaScript arbitrario. */
export function validateAnalytics(env: Record<string, string>) {
  const formats: Record<string, RegExp> = {
    VITE_CF_BEACON_TOKEN: /^[a-f0-9]{32}$/i,
    VITE_PLAUSIBLE_DOMAIN: /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i,
    VITE_GA_ID: /^G-[A-Z0-9]{4,32}$/,
  };
  for (const [key, format] of Object.entries(formats)) {
    if (env[key] && !format.test(env[key])) throw new Error(`Formato inválido para ${key}`);
  }
}

/** Se aplica al HTML final, después de Vite y del pre-render, para calcular los hashes exactos. */
export function secureHtml(html: string) {
  const scripts = new Set(["'self'"]);
  const connections = new Set(["'self'"]);
  const images = new Set(["'self'", 'data:']);
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const source = /\bsrc="([^"]+)"/i.exec(match[1])?.[1];
    if (!source) {
      scripts.add(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);
    } else if (/^https?:/i.test(source)) {
      const origin = new URL(source).origin;
      if (origin === 'https://static.cloudflareinsights.com') connections.add('https://cloudflareinsights.com');
      else if (origin === 'https://plausible.io') connections.add(origin);
      else if (origin === 'https://www.googletagmanager.com') {
        connections.add(origin);
        connections.add('https://*.google-analytics.com');
        connections.add('https://*.analytics.google.com');
        images.add('https://*.google-analytics.com');
      } else throw new Error('Origen de script externo no permitido');
      scripts.add(origin);
    }
  }
  const policy = [
    "default-src 'self'", `script-src ${[...scripts].join(' ')}`, "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'", `img-src ${[...images].join(' ')}`, "font-src 'self'",
    `connect-src ${[...connections].join(' ')}`, "object-src 'none'", "frame-src 'none'",
    "base-uri 'self'", "form-action 'self'", 'upgrade-insecure-requests',
  ].join('; ');
  const charset = /<meta charset="UTF-8"\s*\/?>/i;
  if (!charset.test(html)) throw new Error('Falta charset antes de insertar la política de seguridad');
  return html.replace(charset, match => `${match}\n    <meta http-equiv="Content-Security-Policy" content="${escapeHtml(policy)}" />`);
}
