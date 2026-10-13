import {
  House,
  Building2,
  Droplets,
  CloudRain,
  Waves,
  Wrench,
  Camera,
  MapPin,
  ReceiptText,
  BadgeCheck,
} from 'lucide-react';
import { ServiceItem, CaseStudy, FaqItem, ReviewItem, ZoneItem } from '../types';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

export const ASSETS = {
  heroBg: img('hero.jpg'),
  case1Before: img('case1-before.jpg'),
  case1After: img('case1-after.jpg'),
  case2Before: img('case2-before.jpg'),
  case2After: img('case2-after.jpg'),
  case3Before: img('case3-before.jpg'),
  case3After: img('case3-after.jpg'),
};

export const PHONE_NUMBER = '5493516134658';
export const PHONE_DISPLAY = '351 613-4658';
export const OPENING_HOURS = 'Lunes a sábado, de 8 a 19 h';
export const INSTAGRAM_URL = 'https://www.instagram.com/aqua.tech.solutions/';
export const INSTAGRAM_HANDLE = '@aqua.tech.solutions';

export const SERVICES: ServiceItem[] = [
  {
    id: 'techos',
    title: 'Techos',
    shortDesc: 'Impermeabilización de losas de hormigón, techos de chapa y tejas con sistemas multicapa y sellado térmico.',
    icon: House,
    features: [
      'Membrana asfáltica 4mm con alma de poliéster y geotextil',
      'Sellado elasto-térmico para techos de chapa galvanizada y sinusoidal',
      'Protección hidrófuga para tejas coloniales, francesas y pizarras',
      'Regularización de pendientes y desagües pluviales'
    ],
    materials: ['Megaflex Geotrans', 'Ormiflex 40', 'Sika Fill Elástico'],
    recommendedFor: 'Viviendas, galpones comerciales y cubiertas expuestas',
    warrantyYears: 10
  },
  {
    id: 'terrazas',
    title: 'Terrazas y balcones',
    shortDesc: 'Membranas transitables, poliuretano de alta resistencia a la intemperie y sellado de juntas de dilatación.',
    icon: Building2,
    features: [
      'Poliuretano líquido transitable de secado rápido (sin juntas)',
      'Sellado de juntas de dilatación con masillas elastoméricas PU',
      'Resistencia UV extrema y apto para tránsito peatonal diario',
      'Compatible con cerámicos preexistentes sin necesidad de picar'
    ],
    materials: ['Sikalastic 560', 'Megaflex Líquido', 'Sikaflex 1A'],
    recommendedFor: 'Terrazas de uso familiar, áreas comunes de edificios y balcones',
    warrantyYears: 7
  },
  {
    id: 'cimientos',
    title: 'Humedad de cimientos',
    shortDesc: 'Inyección de resinas hidrófugas y barreras químicas para erradicar la humedad ascendente desde la base.',
    icon: Droplets,
    features: [
      'Inyección a presión controlada de siliconas y siloxanos hidrofugantes',
      'Bloqueo definitivo de capilaridad ascendente en muros de ladrillo',
      'Sin roturas destructivas ni compromiso estructural',
      'Saneamiento de revoques afectados con morteros microporosos'
    ],
    materials: ['SikaMur InjectoCream-100', 'Inyec-Sil Concentrado'],
    recommendedFor: 'Muros interiores y perimetrales con salitre o descascarado',
    warrantyYears: 10
  },
  {
    id: 'filtraciones',
    title: 'Filtraciones',
    shortDesc: 'Detección precisa del origen de goteras, sellado de grietas estructurales y babetas perimetrales.',
    icon: CloudRain,
    features: [
      'Inspección técnica de puntos críticos (encuentros, babetas, cañerías)',
      'Sellado elástico de fisuras activas con bandas de expansión',
      'Zinguería técnica a medida para remates y cargas perimetrales',
      'Prueba de estanqueidad posterior con garantía certificada'
    ],
    materials: ['Sikadur 31', 'Cinta Selladora Autoadhesiva Bituminosa', 'Sikaflex Construction'],
    recommendedFor: 'Urgencias pluviales, goteras localizadas y filtraciones ocultas',
    warrantyYears: 5
  },
  {
    id: 'tanques',
    title: 'Tanques y piletas',
    shortDesc: 'Revestimientos impermeables de grado sanitario para depósitos de agua potable y piscinas de hormigón.',
    icon: Waves,
    features: [
      'Morteros poliméricos bicomponentes certificados para agua potable',
      'Resistencia a contrapresión hidrostática positiva y negativa',
      'Sellado de pasamuros, skimmers y juntas frías de hormigonado',
      'Inocuidad bacteriológica y cumplimiento de normas bromatológicas'
    ],
    materials: ['Sikatop Seal 107', 'Protex Bicomponente Sanitario'],
    recommendedFor: 'Tanques elevados, cisternas subterráneas y piscinas',
    warrantyYears: 7
  },
  {
    id: 'mantenimiento',
    title: 'Mantenimiento preventivo',
    shortDesc: 'Planes anuales para consorcios, empresas y viviendas particulares antes de cada temporada de lluvias.',
    icon: Wrench,
    features: [
      'Limpieza profunda y desobstrucción de rejillas, canaletas y embudos',
      'Reaplicación de capas de sacrificio y pintura reflectiva UV',
      'Revisión semestral programada con informe técnico fotográfico',
      'Prioridad de atención en guardias y alertas de tormentas severas'
    ],
    materials: ['Pintura Asfáltica Aluminiada', 'Poliuretano reflectivo'],
    recommendedFor: 'Consorcios con expensas, industrias, colegios y clínicas',
    warrantyYears: 5
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'caso-1',
    number: '01',
    title: 'Country del Sur, Córdoba',
    location: 'Zona Sur, Córdoba Capital',
    system: 'Membrana asfáltica 4mm + geotextil + poliuretano elástico continuo. Se regularizó la pendiente y sellaron las babetas de hormigón.',
    surface: '450 m² recuperados',
    warranty: '10 años, por escrito',
    time: '5 jornadas de trabajo',
    status: 'Sin filtraciones',
    beforeImg: ASSETS.case1Before,
    afterImg: ASSETS.case1After,
    beforeCaption: 'ANTES: Filtraciones activas y membrana resquebrajada con acumulación de agua estancada.',
    afterCaption: 'DESPUÉS: Geotextil + poliuretano elástico blanco de alta reflectancia térmica y estanqueidad total.',
    details: [
      'Retiro completo de capas envejecidas desprendidas',
      'Regularización de 4 pendientes pluviales críticas',
      'Colocación de imprimación asfáltica al solvente de alta penetración',
      'Fusión a soplete de membrana 4mm Geotextil IRAM 1570',
      'Terminación con 3 manos cruzadas de poliuretano elástico blanco'
    ]
  },
  {
    id: 'caso-2',
    number: '02',
    title: 'Edificio en Nueva Córdoba',
    location: 'Nueva Córdoba, B° Güemes',
    system: 'Membrana líquida poliuretánica transitable de alto tránsito en terraza común del consorcio con sellado de juntas de dilatación.',
    surface: '280 m² transitables',
    warranty: '7 años, por escrito',
    time: '4 jornadas',
    status: 'Estanqueidad total',
    beforeImg: ASSETS.case2Before,
    afterImg: ASSETS.case2After,
    beforeCaption: 'ANTES: Desprendimiento, baldosas rotas y filtraciones a los departamentos del último piso.',
    afterCaption: 'DESPUÉS: Membrana poliuretánica transitable gris técnico de alto tránsito con juntas de dilatación selladas.',
    details: [
      'Tratamiento de sustrato cerámico existente sin demolición ruidosa',
      'Calafateo de 95 metros lineales de juntas de dilatación con poliuretano Sikaflex',
      'Incorporación de malla de fibra de vidrio de refuerzo tridimensional',
      'Acabado antideslizante con microesferas para seguridad de consorcistas',
      'Entrega de informe final con fotos para la administración'
    ]
  },
  {
    id: 'caso-3',
    number: '03',
    title: 'Chalet en Villa Allende',
    location: 'Villa Allende Golf, Sierras Chicas',
    system: 'Reemplazo y sellado de cubierta de tejas coloniales, renovación de zinguería y aplicación de sellador polimérico hidrófugo de penetración profunda.',
    surface: '190 m² de cubierta',
    warranty: '5 años, por escrito',
    time: '3 jornadas',
    status: 'Cero humedad',
    beforeImg: ASSETS.case3Before,
    afterImg: ASSETS.case3After,
    beforeCaption: 'ANTES: Goteras en cumbreras y canaletas oxidadas con filtración a tirantería de madera.',
    afterCaption: 'DESPUÉS: Sellado polimérico hidrófugo integral, tejas recolocadas y nuevas canaletas de zinc galvanizado.',
    details: [
      'Desmonte y recolocación cuidadosa de 320 tejas coloniales fracturadas',
      'Renovación integral de zinguería en chapa calibre 25 plegada a medida',
      'Fijación de cumbreras con mortero hidrófugo elástico anticrack',
      'Tratamiento hidrorrepelente siliconado invisible para protección antihongos',
      'Inspección y verificación de cielorrasos de madera intactos'
    ]
  }
];

export const WORK_PROCESS = [
  {
    step: '1',
    title: 'Nos mandás fotos por WhatsApp',
    description: 'Envianos fotos o videos de tu techo o del problema de humedad para un primer diagnóstico rápido y sin vueltas.',
    icon: Camera,
    tag: 'Desde tu celular'
  },
  {
    step: '2',
    title: 'Visita técnica sin cargo',
    description: 'Coordinamos una inspección en tu domicilio o consorcio en Córdoba para evaluar la superficie, pendientes y fisuras.',
    icon: MapPin,
    tag: 'Córdoba y Gran Córdoba'
  },
  {
    step: '3',
    title: 'Presupuesto en 24 h',
    description: 'Recibís un desglose técnico formal con opciones de materiales normalizados, plazos de ejecución y formas de pago.',
    icon: ReceiptText,
    tag: 'Sin sorpresas ni extras'
  },
  {
    step: '4',
    title: 'Trabajo con garantía escrita',
    description: 'Ejecución limpia, supervisión técnica continua y entrega de tu certificado de garantía formal firmado.',
    icon: BadgeCheck,
    tag: 'Hasta 10 años firmado'
  }
];

export const ZONES: ZoneItem[] = [
  { id: 'capital', name: 'Córdoba Capital', area: 'Todos los barrios', response: 'Visita en 24 h hábiles', x: 52, y: 50 },
  { id: 'villa-allende', name: 'Villa Allende', area: 'Sierras Chicas', response: 'Visita en 24 h hábiles', x: 38, y: 36 },
  { id: 'mendiolaza', name: 'Mendiolaza', area: 'Sierras Chicas', response: 'Visita en 24 h hábiles', x: 36, y: 27 },
  { id: 'rio-ceballos', name: 'Río Ceballos', area: 'Sierras Chicas', response: 'Visita en 24 a 48 h', x: 32, y: 17 },
  { id: 'la-calera', name: 'La Calera', area: 'Departamento Colón', response: 'Visita en 24 h hábiles', x: 30, y: 46 },
  { id: 'carlos-paz', name: 'Villa Carlos Paz', area: 'Valle de Punilla', response: 'Visita en 24 a 48 h', x: 16, y: 58 },
  { id: 'malagueno', name: 'Malagueño', area: 'Departamento Santa María', response: 'Visita en 24 h hábiles', x: 33, y: 64 },
  { id: 'alta-gracia', name: 'Alta Gracia', area: 'Departamento Santa María', response: 'Visita en 48 h hábiles', x: 40, y: 86 },
  { id: 'jesus-maria', name: 'Jesús María', area: 'Departamento Colón', response: 'Visita en 48 h hábiles', x: 62, y: 10 },
];

export const TESTIMONIALS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Lucas B.',
    role: 'Administración de consorcio',
    location: 'Güemes, Córdoba',
    comment: 'Excelente trabajo en el techo del edificio en Güemes. Teníamos goteras históricas que ningún techista solucionaba. Impecable la atención y la garantía.',
    rating: 5,
    date: 'Hace 2 semanas'
  },
  {
    id: 'rev-2',
    name: 'Mariana R.',
    role: 'Propietaria de vivienda',
    location: 'Mendiolaza',
    comment: 'Mandé las fotos un lunes, el martes vinieron a ver la casa en Mendiolaza y el jueves ya estaba presupuestado. Cumplieron los plazos al pie de la letra.',
    rating: 5,
    date: 'Hace 1 mes'
  },
  {
    id: 'rev-3',
    name: 'Carlos F.',
    role: 'Nave industrial',
    location: 'Malagueño',
    comment: 'Hicieron la impermeabilización de 300 m² de nave industrial en Malagueño. Muy profesionales y con factura y garantía como corresponde.',
    rating: 5,
    date: 'Hace 3 semanas'
  },
  {
    id: 'rev-4',
    name: 'Silvina G.',
    role: 'Propietaria de dúplex',
    location: 'Villa Allende',
    comment: 'Se nos llovía la losa cada vez que caían tormentas de verano. La solución de membrana geotextil y pintura térmica dejó el techo impecable y además redujo el calor en la planta alta.',
    rating: 5,
    date: 'Hace 1 mes'
  },
  {
    id: 'rev-5',
    name: 'Esteban O.',
    role: 'Administrador de inmuebles',
    location: 'Cerro de las Rosas, Córdoba',
    comment: 'Trabajamos con AquaTech en 4 consorcios de la zona norte. Cero reclamos de filtraciones en el último invierno lluvioso. Muy prolijos y respetuosos con las normas del edificio.',
    rating: 5,
    date: 'Hace 2 meses'
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'costos',
    question: '¿Cuánto cuesta impermeabilizar un techo o terraza?',
    answer: 'El costo varía según los metros cuadrados, el estado previo de la superficie (si hay capas viejas para levantar o fisuras profundas) y el sistema técnico seleccionado (membrana asfáltica, poliuretano líquido o membrana geotextil). Por eso realizamos una visita técnica sin costo en Córdoba o un primer cálculo aproximado mandando fotos por WhatsApp, para que tengas el número exacto y sin sorpresas.'
  },
  {
    id: 'faq-2',
    category: 'sistemas',
    question: '¿Cuánto dura un trabajo de impermeabilización?',
    answer: 'Con materiales de primera línea aplicados bajo protocolo técnico, una solución completa tiene una durabilidad de entre 7 y 15 años. Además, entregamos un certificado de garantía por escrito de hasta 10 años según el sistema contratado, y realizamos planes de mantenimiento preventivo para extender su vida útil indefinidamente.'
  },
  {
    id: 'faq-3',
    category: 'sistemas',
    question: '¿Conviene membrana asfáltica o membrana poliuretánica líquida?',
    answer: 'Depende del uso y la geometría: la membrana asfáltica (especialmente con terminación geotextil) es ideal para losas planas convencionales y techos no transitables o de tránsito moderado. La membrana poliuretánica continua es insuperable para terrazas con alto tránsito peatonal, áreas con muchas babetas, cañerías o formas irregulares, ya que no deja ninguna junta por donde pueda colarse el agua. En la visita técnica te indicamos la mejor opción costo-beneficio.'
  },
  {
    id: 'faq-4',
    category: 'consorcios',
    question: '¿Trabajan con consorcios, administraciones de edificios y countries?',
    answer: 'Sí, tenemos amplia experiencia en consorcios y barrios cerrados. Contamos con emisión de Factura A y B, cobertura de seguros de trabajo ART vigentes para todo el personal y planes de financiación o pago en cuotas adaptados a expensas extraordinarias.'
  },
  {
    id: 'faq-5',
    category: 'garantia',
    question: '¿Realmente otorgan garantía por escrito?',
    answer: 'Absolutamente. Al finalizar la obra y verificar la prueba de estanqueidad, emitimos un certificado formal membretado con número de póliza, detalle de materiales, metros cuadrados intervenidos y el plazo de garantía legal vinculante (hasta 10 años). Si surge algún inconveniente, nuestro equipo técnico concurre sin costo adicional.'
  },
  {
    id: 'faq-6',
    category: 'sistemas',
    question: '¿Qué pasa si ya tengo una membrana vieja colocada y rota?',
    answer: 'En la mayoría de los casos es fundamental levantar y retirar la membrana degradada si se encuentra despegada o con agua embolsada debajo (humedad atrapada). Aplicar encima de una membrana en mal estado solo genera bolsas de vapor que vuelven a reventar el sellador. Nosotros nos encargamos del raspado, limpieza y nivelación antes de colocar el nuevo sistema.'
  }
];

export const CERTIFICATE_DATA = {
  policyNumber: 'MODELO-0001',
  technicalDirector: 'Dirección Técnica AquaTech',
  standards: 'Normas IRAM de impermeabilización',
  watertightTest: 'Prueba de inundación controlada aprobada',
  coveragePeriod: 'Según sistema, hasta 10 años',
};
