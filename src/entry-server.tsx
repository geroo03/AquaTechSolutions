import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { SERVICES, SECONDARY_SERVICE } from './data/mockData';
import DetailPage from './pages/DetailPage';
import BusinessPage from './pages/BusinessPage';
import { PAGES, pageForPath, type SitePage } from './routes';
import { MAINTENANCE_PLAN } from './data/mantenimiento';

export const pages = PAGES;

/** HTML de la página completa, para el pre-renderizado (scripts/prerender.mjs) */
export function render(path = '/') {
  const page = pageForPath(path);
  return renderToString(
    <StrictMode>
      {page.kind === 'home' ? <App /> : page.kind === 'business' ? <BusinessPage page={page} /> : <DetailPage page={page} />}
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
  streetAddress: string;
  mapsUrl: string;
  region: string;
  country: string;
  areaServed: string[];
  sameAs: string[];
}

/**
 * Datos estructurados de negocio local para Google, solo con datos confirmados.
 * Dirección y ficha autorizadas por Sebastián el 17/10/2026. Sin reseñas propias en este marcado.
 */
export function jsonLd(site: Site, page: SitePage = PAGES[0]) {
  const business = {
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
      streetAddress: site.streetAddress,
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
    hasMap: site.mapsUrl,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de impermeabilización',
      itemListElement: [
        ...[...SERVICES.map((s) => s.title), SECONDARY_SERVICE.title].map((name) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name } as Record<string, unknown>,
        })),
        // Plan de Mantenimiento (contrato 1.0): sin precio, se ajusta por IPC
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': `${site.url}#plan-mantenimiento`,
            name: MAINTENANCE_PLAN.title,
            description: MAINTENANCE_PLAN.subtitle,
            provider: { '@id': `${site.url}#negocio` },
            areaServed: { '@type': 'Place', name: MAINTENANCE_PLAN.areaServed },
          },
        },
      ],
    },
  };
  if (page.kind === 'home') {
    // Preguntas del Plan de Mantenimiento (sección nueva de la home)
    const faq = {
      '@type': 'FAQPage',
      '@id': `${site.url}#preguntas-plan`,
      mainEntity: MAINTENANCE_PLAN.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    };
    const { '@context': context, ...businessNode } = business;
    return { '@context': context, '@graph': [businessNode, faq] };
  }
  const url = new URL(page.path.slice(1), site.url).href;
  const isService = page.kind === 'service' || page.kind === 'business';
  const entityId = `${url}#${isService ? 'servicio' : 'obra'}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      business,
      {
        '@type': 'WebPage', '@id': url, url, name: page.title, description: page.description,
        inLanguage: 'es-AR', mainEntity: { '@id': entityId }, breadcrumb: { '@id': `${url}#ruta` },
      },
      {
        '@type': 'BreadcrumbList', '@id': `${url}#ruta`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: site.url },
          { '@type': 'ListItem', position: 2, name: page.label, item: url },
        ],
      },
      isService ? {
        '@type': 'Service', '@id': entityId, name: page.title.split(' | ')[0],
        description: page.description, url, provider: { '@id': business['@id'] },
        areaServed: business.areaServed,
      } : {
        '@type': 'CreativeWork', '@id': entityId, name: 'Impermeabilización en Country GreenVille',
        description: page.description, url, creator: { '@id': business['@id'] },
        isBasedOn: 'https://www.instagram.com/p/Ddhm_k-jgwd/',
      },
    ],
  };
}
