/**
 * Analítica opcional. No hace nada hasta que se configure un proveedor al compilar
 * (VITE_CF_BEACON_TOKEN, VITE_PLAUSIBLE_DOMAIN o VITE_GA_ID; ver vite.config.ts y CLAUDE.md).
 * Con Plausible o GA4 se registra el evento "WhatsApp" con el botón de origen. Cloudflare no
 * registra eventos: ahí el origen se ve en el texto del mensaje que llega al WhatsApp.
 */
import { attributionProperties, captureAttribution, trackedWhatsAppLink } from './attribution';
import { pageForPath } from './routes';

type Props = Record<string, string>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props: Props = {}) {
  window.plausible?.(event, { props });
  window.gtag?.('event', event, props);
}

/** De qué parte de la página salió el clic: data-origen explícito, la sección, el header o el footer */
function originOf(el: Element): string {
  const tagged = el.closest<HTMLElement>('[data-origen]');
  if (tagged?.dataset.origen) return tagged.dataset.origen;
  const section = el.closest('section[id]');
  if (section) return section.id;
  if (el.closest('header')) return 'header';
  if (el.closest('footer')) return 'footer';
  return 'otro';
}

export function initAnalytics() {
  const page = pageForPath(window.location.pathname).label;
  captureAttribution(page);
  const original = new WeakMap<HTMLAnchorElement, string>();
  const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="https://wa.me/"]');
      if (link) {
        // Decorar al interactuar, después de hidratar: el HTML inicial coincide con el servidor.
        const href = link.getAttribute('href')!;
        const previous = original.get(link);
        const base = previous && href === trackedWhatsAppLink(previous, page) ? previous : href;
        original.set(link, base);
        link.href = trackedWhatsAppLink(base, page);
        track('WhatsApp', { origen: originOf(link), pagina: page, ...attributionProperties() });
      }
  };
  document.addEventListener('click', onClick, { capture: true });
  return () => document.removeEventListener('click', onClick, true);
}
