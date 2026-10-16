import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { SERVICES, SECONDARY_SERVICE } from './data/mockData';

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
  email: string;
  foundingDate: string;
  city: string;
  region: string;
  country: string;
  areaServed: string[];
  sameAs: string[];
}

/**
 * Datos estructurados de negocio local para Google, solo con datos confirmados.
 * Sin calle (la dirección es la casa del dueño). Sin reseñas: Google no acepta reseñas propias en este marcado.
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
    email: site.email,
    foundingDate: site.foundingDate,
    image: `${site.url}og-image.png`,
    logo: `${site.url}logo-aquatech.png`,
    slogan: 'Impermeabilizaciones que perduran',
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: site.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '20:00',
    },
    sameAs: site.sameAs,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de impermeabilización',
      itemListElement: [...SERVICES.map((s) => s.title), SECONDARY_SERVICE.title].map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  };
}
