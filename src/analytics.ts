/**
 * Analítica opcional. No hace nada hasta que se configure un proveedor al compilar
 * (VITE_PLAUSIBLE_DOMAIN o VITE_GA_ID, ver vite.config.ts y CLAUDE.md).
 * El evento principal es "WhatsApp": cada clic que abre una conversación, con el botón de origen.
 */
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
  document.addEventListener(
    'click',
    (e) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="https://wa.me/"]');
      if (link) track('WhatsApp', { origen: originOf(link) });
    },
    { capture: true },
  );
}
