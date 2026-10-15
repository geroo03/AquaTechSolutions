/**
 * Datos del negocio. Fuente: "Datos para la web de AquaTech" (15/10/2026), confirmados por el dueño
 * (Martín Emiliano Nieto) o por Sebastián. No agregar datos que no estén confirmados: lo pendiente
 * está en docs/negocio-y-marca.md.
 */
import { House, Building2, Droplets, CloudRain, Waves, Wrench, Camera, MapPin, ReceiptText, ShieldCheck } from 'lucide-react';
import { ServiceItem, CaseStudy, FaqItem, ZoneItem, WarrantyItem } from '../types';

// Ruta relativa: igual en el pre-render y en el navegador, funcione bajo /AquaTechSolutions/ o en un dominio propio
const img = (name: string) => `./images/${name}`;

/** Imágenes ilustrativas (generadas por IA) hasta tener las fotos originales de obra */
export const ASSETS = {
  heroBg: img('hero.webp'),
  case1Before: img('case1-before.webp'),
  case1After: img('case1-after.webp'),
};

export const PHONE_NUMBER = '5493516134658';
export const PHONE_DISPLAY = '351 613-4658';
export const EMAIL = 'aquatech.cba@gmail.com';
export const INSTAGRAM_URL = 'https://www.instagram.com/aqua.tech.solutions/';
export const INSTAGRAM_HANDLE = '@aqua.tech.solutions';
export const FACEBOOK_URL = 'https://www.facebook.com/p/Aquatech-Solutions-61563827794730/';
export const FOUNDED_YEAR = 2008;
export const SQUARE_METERS = '5.000 m²';

/** Garantía por sistema, confirmada por el dueño */
export const WARRANTIES: WarrantyItem[] = [
  { system: 'Membrana con geotextil', years: '10 años' },
  { system: 'Membrana con aluminio', years: '5 años' },
  { system: 'Pintura', years: '2 años' },
  { system: 'Tratamientos y productos específicos', years: '15, 20 o 25 años' },
];

const BY_SYSTEM = 'Garantía según el sistema';

export const SERVICES: ServiceItem[] = [
  {
    id: 'techos',
    title: 'Techos',
    shortDesc: 'Membrana asfáltica con aluminio o con geotextil, y terminación con pintura poliuretánica.',
    icon: House,
    warranty: '5 a 10 años según la membrana',
  },
  {
    id: 'terrazas',
    title: 'Terrazas y balcones',
    shortDesc: 'Impermeabilización de terrazas, balcones y superficies expuestas a la lluvia.',
    icon: Building2,
    warranty: BY_SYSTEM,
  },
  {
    id: 'cimientos',
    title: 'Humedad de cimientos',
    shortDesc: 'Tratamiento de la humedad que sube por muros y zócalos.',
    icon: Droplets,
    warranty: BY_SYSTEM,
  },
  {
    id: 'filtraciones',
    title: 'Filtraciones',
    shortDesc: 'Búsqueda del origen de goteras y filtraciones, y su reparación.',
    icon: CloudRain,
    warranty: BY_SYSTEM,
  },
  {
    id: 'tanques',
    title: 'Tanques y piletas',
    shortDesc: 'Impermeabilización de tanques de agua y piletas.',
    icon: Waves,
    warranty: BY_SYSTEM,
  },
  {
    id: 'mantenimiento',
    title: 'Mantenimiento preventivo',
    shortDesc: 'Revisión y mantenimiento de techos y terrazas para anticiparse a las lluvias.',
    icon: Wrench,
    warranty: BY_SYSTEM,
  },
];

/** Servicio secundario, se muestra aparte */
export const SECONDARY_SERVICE = { title: 'Pintura interior y exterior', warranty: '2 años de garantía' };

/**
 * Obra real (posteo de Instagram del 20/09/2026). El nombre del country no se publica hasta tener permiso.
 * Las fotos todavía son ilustrativas.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'country-zona-sur',
    title: 'Techo en un country de zona sur',
    location: 'Zona sur, Córdoba Capital',
    system: 'Membrana asfáltica con geotextil de 4 mm y pintura poliuretánica.',
    warranty: '10 años (membrana con geotextil)',
    beforeImg: ASSETS.case1Before,
    afterImg: ASSETS.case1After,
    beforeAlt: 'Techo antes de la impermeabilización (imagen ilustrativa)',
    afterAlt: 'Techo impermeabilizado (imagen ilustrativa)',
  },
];

export const WORK_PROCESS = [
  {
    step: '1',
    title: 'Nos mandás fotos por WhatsApp',
    description: 'Fotos del problema, tu barrio y los metros cuadrados aproximados. Con eso arrancamos.',
    icon: Camera,
    tag: 'Desde tu celular',
  },
  {
    step: '2',
    title: 'Visita técnica',
    description: 'Coordinamos una visita para ver la superficie, medir y revisar el estado de lo que hay.',
    icon: MapPin,
    tag: 'Coordinada con vos',
  },
  {
    step: '3',
    title: 'Presupuesto',
    description: 'Te pasamos el presupuesto con el sistema recomendado y su garantía.',
    icon: ReceiptText,
    tag: 'Sistema y garantía',
  },
  {
    step: '4',
    title: 'Trabajo terminado',
    description: 'Hacemos el trabajo y queda cubierto por la garantía del sistema elegido.',
    icon: ShieldCheck,
    tag: 'Hasta 10 años de garantía',
  },
];

/** Lugares con obras confirmadas. Facebook indica cobertura en la provincia de Córdoba. */
export const ZONES: ZoneItem[] = [
  { id: 'capital', name: 'Córdoba Capital', detail: 'Barrios de la ciudad', x: 50, y: 46 },
  { id: 'zona-sur', name: 'Countries de zona sur', detail: 'Barrios cerrados al sur de la ciudad', x: 46, y: 68 },
  { id: 'jesus-maria', name: 'Jesús María', detail: 'Norte de la provincia', x: 60, y: 14 },
];

export const FAQS: FaqItem[] = [
  {
    id: 'presupuesto',
    question: '¿Cómo pido un presupuesto?',
    answer:
      'Escribinos por WhatsApp con fotos del problema (una general y otras de cerca), tu barrio o localidad y los metros cuadrados aproximados. Con eso evaluamos el caso y coordinamos una visita para medir.',
  },
  {
    id: 'garantia',
    question: '¿Qué garantía tienen los trabajos?',
    answer:
      'Depende del sistema: membrana con geotextil, 10 años; membrana con aluminio, 5 años; pintura, 2 años. Con tratamientos y productos específicos la garantía puede ser de 15, 20 o 25 años. Para tanques, piletas y cimientos, consultanos según el sistema.',
  },
  {
    id: 'trayectoria',
    question: '¿Desde cuándo trabajan?',
    answer: `Trabajamos en impermeabilizaciones desde ${FOUNDED_YEAR} y llevamos más de ${SQUARE_METERS} trabajados.`,
  },
  {
    id: 'zona',
    question: '¿Trabajan en mi zona?',
    answer:
      'Trabajamos en Córdoba Capital y en la provincia de Córdoba. Escribinos con tu barrio o localidad y te confirmamos.',
  },
];
