export interface Attribution {
  source: 'instagram' | 'facebook' | 'google' | 'buscador' | 'referido' | 'otro' | 'directo';
  campaign?: string;
  landing: string;
}

const SOURCES: Record<Attribution['source'], string> = {
  instagram: 'Instagram', facebook: 'Facebook', google: 'Google', buscador: 'Buscador',
  referido: 'Referido', otro: 'Otro canal', directo: 'Directo o sin identificar',
};
const storageKey = 'aquatech:origen:v1';
let current: Attribution | undefined;

/** Solo se conservan etiquetas de campaña, nunca la query completa ni datos de contacto. */
function campaignLabel(value: string | null) {
  return value && /^[a-zA-Z0-9_-]{1,64}$/.test(value) ? value : undefined;
}

export function chooseAttribution(search: string, referrer: string, origin: string, landing: string, previous?: Attribution): Attribution {
  const params = new URLSearchParams(search);
  const utm = params.get('utm_source')?.toLowerCase();
  let source: Attribution['source'] | undefined;
  if (utm) {
    const aliases: Record<string, Attribution['source']> = { instagram: 'instagram', ig: 'instagram', facebook: 'facebook', fb: 'facebook', google: 'google', referido: 'referido', referral: 'referido' };
    source = Object.hasOwn(aliases, utm) ? aliases[utm] : 'otro';
  } else if (referrer) {
    try {
      const url = new URL(referrer);
      const host = url.hostname.toLowerCase();
      if (url.origin !== origin) {
        if (host === 'instagram.com' || host.endsWith('.instagram.com')) source = 'instagram';
        else if (host === 'facebook.com' || host.endsWith('.facebook.com')) source = 'facebook';
        else if (/^(?:www\.)?google\.(?:com|com\.ar|es)$/.test(host)) source = 'google';
        else if (['www.bing.com', 'bing.com', 'duckduckgo.com'].includes(host)) source = 'buscador';
        else source = 'otro';
      }
    } catch { /* Un referrer inválido no impide abrir WhatsApp. */ }
  }
  if (!source && previous) return previous;
  return { source: source ?? 'directo', campaign: campaignLabel(params.get('utm_campaign')), landing };
}

export function captureAttribution(landing: string) {
  let previous: Attribution | undefined;
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null');
    if (stored && typeof stored === 'object') {
      const value = stored as Attribution;
      if (Object.hasOwn(SOURCES, value.source) && typeof value.landing === 'string' && value.landing.length <= 100) {
        previous = { source: value.source, landing: value.landing, campaign: campaignLabel(value.campaign ?? null) };
      }
    }
  } catch { /* Funciona también con almacenamiento bloqueado. */ }
  current = chooseAttribution(location.search, document.referrer, location.origin, landing, previous);
  try { sessionStorage.setItem(storageKey, JSON.stringify(current)); } catch { /* Mantener solo en memoria. */ }
  return current;
}

export function enrichWhatsAppLink(href: string, attribution: Attribution, page: string) {
  const url = new URL(href);
  if (url.origin !== 'https://wa.me') return href;
  const text = url.searchParams.get('text') ?? '';
  const detail = [`Origen: ${SOURCES[attribution.source]}`, `Página: ${page}`];
  if (attribution.landing !== page) detail.push(`Entrada: ${attribution.landing}`);
  if (attribution.campaign) detail.push(`Campaña: ${attribution.campaign}`);
  url.searchParams.set('text', `${text}\n${detail.join('\n')}`);
  return url.href;
}

export function trackedWhatsAppLink(href: string, page: string) {
  return enrichWhatsAppLink(href, current ?? captureAttribution(page), page);
}

export function attributionProperties(): Record<string, string> {
  return current ? { canal: current.source, campana: current.campaign ?? '', entrada: current.landing } : {};
}
