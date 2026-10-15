import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { SERVICES, ZONES } from './data/mockData';

/** HTML de la página completa, para el pre-renderizado (scripts/prerender.mjs) */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

interface Site {
  url: string;
  name: string;
  description: string;
  telephone: string;
  city: string;
  region: string;
  country: string;
  instagram: string;
}

/**
 * Datos estructurados de negocio local para Google.
 * Solo datos confirmados: sin dirección exacta, horario ni reseñas hasta que el dueño los confirme.
 */
export function jsonLd(site: Site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${site.url}#negocio`,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.telephone,
    image: `${site.url}og-image.png`,
    logo: `${site.url}logo-aquatech.png`,
    slogan: 'Impermeabilizaciones que perduran',
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: ZONES.filter((z) => !z.name.startsWith('Toda')).map((z) => ({ '@type': 'City', name: z.name })),
    sameAs: [site.instagram],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de impermeabilización',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.shortDesc },
      })),
    },
  };
}
