import site from '../site.config.json' with { type: 'json' };

export interface SitePage {
  path: string;
  kind: 'home' | 'service' | 'work';
  label: string;
  title: string;
  description: string;
  serviceId?: string;
}

export const PAGES: SitePage[] = [
  {
    path: '/', kind: 'home', label: 'Inicio',
    title: site.title,
    description: site.description,
  },
  {
    path: '/servicios/impermeabilizacion-techos/', kind: 'service', serviceId: 'techos', label: 'Techos',
    title: 'Impermeabilización de techos en Córdoba | AquaTech Solutions',
    description: 'Membranas asfálticas con aluminio o geotextil para techos en Córdoba. Conocé los sistemas, una obra real y cómo pedir presupuesto sin cargo.',
  },
  {
    path: '/servicios/humedad-cimientos/', kind: 'service', serviceId: 'cimientos', label: 'Humedad de cimientos',
    title: 'Tratamiento de humedad de cimientos en Córdoba | AquaTech Solutions',
    description: 'Consultá por humedad en muros y zócalos en Córdoba. Evaluamos el problema para recomendar el tratamiento y la garantía según el sistema.',
  },
  {
    path: '/servicios/terrazas-balcones/', kind: 'service', serviceId: 'terrazas', label: 'Terrazas y balcones',
    title: 'Impermeabilización de terrazas y balcones en Córdoba | AquaTech Solutions',
    description: 'Impermeabilización de terrazas y balcones en Córdoba. Contanos el estado de la superficie y pedí un presupuesto con garantía según el sistema.',
  },
  {
    path: '/trabajos/greenville/', kind: 'work', label: 'Obra en GreenVille',
    title: 'Impermeabilización en Country GreenVille, Córdoba | AquaTech Solutions',
    description: 'Conocé la obra de AquaTech en Country GreenVille: membrana asfáltica con geotextil de 4 mm y pintura poliuretánica. Publicación de septiembre de 2026.',
  },
];

/** Admite también el prefijo del repositorio cuando se sirve en GitHub Pages. */
export function pageForPath(pathname: string): SitePage {
  const path = `${pathname.replace(/\/+$/, '')}/`;
  return PAGES.find(p => p.path !== '/' && path.endsWith(p.path)) ?? PAGES[0];
}

export const serviceHref = (serviceId: string) => {
  const page = PAGES.find(p => p.serviceId === serviceId);
  return page ? `.${page.path}` : './#servicios';
};

export const GREENVILLE_PATH = '/trabajos/greenville/';
