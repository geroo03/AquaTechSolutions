import { createHash } from 'node:crypto';
import { parse, type DefaultTreeAdapterMap } from 'parse5';

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
/** `connect`: orígenes HTTPS extra a los que la página puede llamar (el panel de presupuestos usa Supabase). */
export function secureHtml(html: string, connect: string[] = []) {
  const scripts = new Set(["'self'"]);
  const connections = new Set(["'self'"]);
  for (const origin of connect) {
    if (!/^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(origin)) throw new Error('Origen de conexión inválido');
    connections.add(origin);
  }
  const images = new Set(["'self'", 'data:']);
  let charsetEnd: number | undefined;
  const visit = (node: DefaultTreeAdapterMap['node']) => {
    if ('tagName' in node && node.tagName === 'meta' && node.attrs.some(attr => attr.name === 'charset' && attr.value.toLowerCase() === 'utf-8')) {
      charsetEnd ??= node.sourceCodeLocation?.endOffset;
    }
    if ('tagName' in node && node.tagName === 'script') {
      const source = node.attrs.find(attr => attr.name === 'src')?.value;
      if (!source) {
        const text = node.childNodes.map(child => child.nodeName === '#text' && 'value' in child ? child.value : '').join('');
        scripts.add(`'sha256-${createHash('sha256').update(text).digest('base64')}'`);
      } else if (source.startsWith('//') || URL.canParse(source)) {
        const origin = new URL(source, 'https://build.invalid/').origin;
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
    if ('childNodes' in node) node.childNodes.forEach(visit);
  };
  visit(parse(html, { sourceCodeLocationInfo: true }));
  const policy = [
    "default-src 'self'", `script-src ${[...scripts].join(' ')}`, "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'", `img-src ${[...images].join(' ')}`, "font-src 'self'",
    `connect-src ${[...connections].join(' ')}`, "object-src 'none'", "frame-src 'none'",
    "base-uri 'self'", "form-action 'self'", 'upgrade-insecure-requests',
  ].join('; ');
  if (charsetEnd === undefined) throw new Error('Falta charset antes de insertar la política de seguridad');
  const meta = `\n    <meta http-equiv="Content-Security-Policy" content="${escapeHtml(policy)}" />`;
  return html.slice(0, charsetEnd) + meta + html.slice(charsetEnd);
}
