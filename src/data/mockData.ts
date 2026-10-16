/**
 * Datos del negocio. Fuente: "Datos para la web de AquaTech" (15/10/2026) y respuestas de Martín (16/10/2026), confirmados por el dueño
 * (Martín Emiliano Nieto) o por Sebastián. No agregar datos que no estén confirmados: lo pendiente
 * está en docs/negocio-y-marca.md.
 */
import { House, Building2, Droplets, CloudRain, Waves, Wrench, Camera, MapPin, ReceiptText, ShieldCheck } from 'lucide-react';
import { ServiceItem, CaseStudy, FaqItem, ZoneItem, WarrantyItem } from '../types';

// Ruta relativa: igual en el pre-render y en el navegador, funcione bajo /AquaTechSolutions/ o en un dominio propio
const img = (name: string) => `./images/${name}`;

export const ASSETS = {
  /** Foto real de obra (16/10/2026) */
  heroBg: img('obra-techo-sierras.webp'),
  heroBgSmall: img('obra-techo-sierras-960.webp'),
  /** Ilustrativas (IA) hasta tener el antes y después real de la obra */
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
export const SQUARE_METERS = '15.000 m²';
export const OPENING_HOURS = 'Todos los días de 8 a 20 h';
export const PRIVATE_NEIGHBORHOODS_NOTE = 'En barrios privados trabajamos de lunes a viernes.';
export const RESPONSE_TIME = 'unos 20 minutos';
export const QUOTE_TIME = 'menos de 24 h';
export const NEIGHBOR_PROVINCES = ['Catamarca', 'Santiago del Estero', 'Santa Fe', 'Buenos Aires', 'La Pampa', 'San Luis', 'La Rioja'];

/** Obras que el dueño autorizó nombrar */
export const NOTABLE_WORKS = [
  'Hospital Italiano',
  'Colegio de Abogados de Jesús María',
  'Country GreenVille',
  'Country Campo de Vuelo',
  'Country La Cascada',
  'Country Los Cerezos',
];

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

/** Obra real (posteo de Instagram del 20/09/2026). Las fotos todavía son ilustrativas. */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'greenville',
    title: 'Techo en Country GreenVille',
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
    description: 'Fotos del problema, tu barrio y los metros cuadrados aproximados. Te respondemos en unos 20 minutos.',
    icon: Camera,
    tag: 'Respuesta en ~20 min',
  },
  {
    step: '2',
    title: 'Visita técnica',
    description: 'Coordinamos una visita para medir y revisar el estado de la superficie. Puede tener un costo de viáticos según la distancia.',
    icon: MapPin,
    tag: 'Coordinada con vos',
  },
  {
    step: '3',
    title: 'Presupuesto sin cargo',
    description: 'Te pasamos el presupuesto con el sistema recomendado y su garantía, en menos de 24 h.',
    icon: ReceiptText,
    tag: 'En menos de 24 h',
  },
  {
    step: '4',
    title: 'Trabajo terminado',
    description: 'Hacemos el trabajo y te entregamos la garantía por escrito, en papel y en formato digital.',
    icon: ShieldCheck,
    tag: 'Garantía por escrito',
  },
];

/** Cobertura confirmada: toda la provincia de Córdoba y las provincias limítrofes. Los puntos del mapa son lugares con obras. */
export const ZONES: ZoneItem[] = [
  { id: 'capital', name: 'Córdoba Capital', detail: 'Barrios de la ciudad y Gran Córdoba', map: 'pin' },
  { id: 'zona-sur', name: 'Countries de zona sur', detail: 'GreenVille, Campo de Vuelo, La Cascada, Los Cerezos. De lunes a viernes', map: 'pin' },
  { id: 'jesus-maria', name: 'Jesús María', detail: 'Norte de la provincia', map: 'pin' },
  { id: 'provincia', name: 'Resto de la provincia', detail: 'Todo el interior de Córdoba', map: 'province' },
  { id: 'limitrofes', name: 'Provincias limítrofes', detail: NEIGHBOR_PROVINCES.join(', '), map: 'neighbors' },
];

export const FAQS: FaqItem[] = [
  {
    id: 'presupuesto',
    question: '¿Cómo pido un presupuesto? ¿Tiene costo?',
    answer:
      'El presupuesto es sin cargo. Escribinos por WhatsApp con fotos del problema (una general y otras de cerca), tu barrio o localidad y los metros cuadrados aproximados. Te respondemos en unos 20 minutos y te pasamos el presupuesto en menos de 24 h. Si hace falta ir a medir, la visita puede tener un costo de viáticos según la distancia.',
  },
  {
    id: 'garantia',
    question: '¿Qué garantía tienen los trabajos?',
    answer:
      'Depende del sistema: membrana con geotextil, 10 años; membrana con aluminio, 5 años; pintura, 2 años. Con tratamientos y productos específicos la garantía puede ser de 15, 20 o 25 años. Para tanques, piletas y cimientos, consultanos según el sistema. La garantía se entrega por escrito, en papel y en formato digital.',
  },
  {
    id: 'factura',
    question: '¿Hacen factura?',
    answer:
      'Sí. Contanos qué tipo de factura necesitás cuando pidas el presupuesto: el precio de la mano de obra puede variar según la factura.',
  },
  {
    id: 'cuotas',
    question: '¿Se puede pagar en cuotas?',
    answer:
      'Sí, con la financiación de Mercado Pago. Las cuotas tienen el interés que aplica Mercado Pago según el plan que elijas.',
  },
  {
    id: 'seguro',
    question: '¿Trabajan con seguro?',
    answer: 'Sí. Contamos con seguro y cumplimos los requisitos de higiene y seguridad según las normas IRAM.',
  },
  {
    id: 'trayectoria',
    question: '¿Desde cuándo trabajan?',
    answer: `Trabajamos en impermeabilizaciones desde ${FOUNDED_YEAR} y llevamos más de ${SQUARE_METERS} trabajados, con obras como el Hospital Italiano, el Colegio de Abogados de Jesús María y los countries GreenVille, Campo de Vuelo, La Cascada y Los Cerezos.`,
  },
  {
    id: 'zona',
    question: '¿Trabajan en mi zona?',
    answer: `Trabajamos en toda la provincia de Córdoba y en las provincias limítrofes (${NEIGHBOR_PROVINCES.join(', ')}). Atendemos todos los días de 8 a 20 h; en barrios privados trabajamos de lunes a viernes. Escribinos con tu localidad y coordinamos.`,
  },
];

/** Reseña real, publicada en Muovi. Alejandra Guzmán autorizó usarla (16/10/2026). */
export const TESTIMONIAL = {
  quote: 'Hace más de 10 años me hicieron la impermeabilización del techo. Hasta ahora no tengo filtraciones.',
  author: 'Alejandra G.',
  source: 'Reseña publicada en Muovi',
};

/** Fotos reales de obra enviadas por Martín (16/10/2026) */
export const WORK_PHOTOS = [
  {
    src: img('obra-techo-sierras.webp'),
    alt: 'Techo plano en obra, con las sierras de fondo',
    width: 1600,
    height: 1200,
  },
  {
    src: img('obra-aplicacion.webp'),
    alt: 'Aplicación de impermeabilizante en el borde del techo',
    width: 960,
    height: 1280,
  },
  {
    src: img('obra-recorrida.webp'),
    alt: 'Recorrida del techo durante la obra',
    width: 1280,
    height: 960,
  },
];
