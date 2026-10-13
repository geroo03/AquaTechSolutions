import { ServiceItem, CaseStudy, FaqItem, ReviewItem, ZoneItem } from '../types';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBb_a2-XDZwd5SLTcBBX8lSeAD_eTEz1bdCRVZ0WiA3isAU14RJB5w4X6K2bSVXfsqW9hEg-9rYhSCrrmQ-vKXCf1nPUGkn3H8xYLjJn-SlNi_E2JSORRO9pvbRL9_9_3sznhHANQf5J4V5Bc1dIyXabC7Sgbhp5MHWP7084q2O5GxLaISvy-WYXODqjz1f5NoXpwrfO_fi5qRXNfOyDSopT7Gios0gH-w0DOKuMDXV27dqxyEHsjtZ-A',
  heroBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKoiMijvGan-HtYiUJBt8cjaJCSzEl7a5Mv3oXeyZBOUitngvcc1Xby1qBnM2eKHwUCLv_kOf4rH5PHzpCk7YCm4UFVGqW7wycRfTqg5NLkWpLsTtqdDjRJy86Rq8Upk6AcMTnfe_Bm1R0HZm_0oBxSyZU_tbJcJqGCLAMeSsw9fphtIDl32ne8fSICUSJKqyxciU5IhFZ5kcMN0T2Jpbo6TtFiKk4_CcfUaJJ1fsoXXIxX0xrLeNKOQ',
  case1Before: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD9uxeV4uIZ_EWNMunvonRCrrjzvDq9C2vx1Nkg8bYevfAy6rBP_Z-zT3G4iH1DIR75jZ4i29boG1rC-CN9PzuN4_9XNlq3jkOTO_tSrF8Dsh57xc0JDp3ZVR7lcCzazDs6xRPa4uX1B3xu2p7y8XBiYwY4ybSxKkZ0e8-VYp_e24RIQ9cxwF5OSud1tQp8xpT0fCf1NLNQfZDGz8-ax-b9XjmUQOscQHCdJU95ybq3zouzPSsl066Dg',
  case1After: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjKvc0OJ5tQlJfAf-pJS9rPgQJk3h59ium3T2I1apkWREdQhokPdKd1M2F9GebqSua0uy_cqjUMA9gCBYaJz_eWuFSlUIhpxNsgAP5ZTxSxj8TM7o8-z3G92FxvEe61W_weR3DHOuMZB0e3fUKx5Ccdrl3LFRCiC-wkI1TkiQQAG22oJbkTvCPKGjSk7u_7ir_GHfZgaLLBCsV5RJx3BF9_-7jKwHg_4fMHv7FW7wnmF17a5_ueT2bYw',
  case2Before: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRuGq_43GOcmnXSlR2oHZmoJyTnQWowPJsdGJvTNq_36yIxqGlAe0VVn5qsTeMDhtJEq3zsi_rhDP2XbzqZW6GDg-oKLJfvzZYUif21E-y7Mm-s2Knh-2kITE1ucyimuWYqO0-x9C_udqKa0Y5_f-yoMGzCxGzcQgGrRdWaahawRlrvclAei5ehPiNE6rrRN1sCe5jhlABx9FXTk_3AAHiZLcMCp7Iyj8067N6QwaTjqu7ro5R-y4jdQ',
  case2After: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpPXMJ0bmnks_sTQ_7dXqkmdQPe5DXyLpVLv4k5L_NsjUfvEfQThMB1D2wQbzjB0KZMu6q9rSalWpGmzXokYRbV86PgdOeRUIH739ARDHDBWPdKEMyBuYJHwCWg-yECGT71doiecLrT5HNgZD_pZK5Y1ITCxI9Q0fnM4PYvb0Q1YJ240Cj413g07hlLMVdDRl-Lobp3Mvn9PPHBLRNuaIifsX3d_JQI4krwlpimVBpFuKSEcOLlRvk-w',
  case3Before: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkcz_mchmQN4aXi-IFRGLwyaapx6R1TiSu8XIho70m0mwm2Thk78YtNcCOl6S9ndw2ZpKKkYRpEUyuztJ2JoyHK1va-9QNERToHlk8KZy1QYiNkFpK5V8OTszjgJmyjVHXzHmjBc7Ri1A3Hq_kSsmyBkTR1LiKKLG742RNwsNQkHnBr4lIfKiKR3czitfqe8Dzprp-OlTtPKC0Q0CPfZTZC73eSzk1fP_DV4aTwNpX0ge4Ztiyic9qrQ',
  case3After: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuLgjfz5OJ8BT5S7Lkkiqbclq1ZJhTNMPnKfdC0OY90DBEQwkcH9mC8vczs3k65RJZE2GNdPPD_gdNYDo_Q3cKDmOmkCRXBDzoumjNYK78B-4pId42ue4ina8N6zS_uIIstUFEosaKnlfrIP4FIe8ROd9cyxkq7FzlZvGMwxVQ4GRKJrIgQbIlX-X8EeyvwAHGHnbnTQttTX8_SyQkXiHSfDI8MVkqz2x_3yAeVdj4R_nQT4vHZaKlBQ',
  mapCordoba: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4nszmOxyEXXqzFnuL4XgPF-LhSiW0kKPNBlJ1AjyGnonuKBLOrgYGDvIIHDMds0jsF0XGxU9nuqgMRCxYQnLIwJggLyoexq8y3FuaOuNJ1a86mgguUeRhS8FhJfVu02_f7LDBZxX5U9yOCn6M9XnZP4GIQAHKS2yGTGBYkooTeGj6LCOXmFaW10kcEE8mwLSdPAR5ecGY4H1pd2llALeGDfhj2MmlLCNh4fCpyRCurVNAawt8SqU4oA'
};

export const PHONE_NUMBER = '5493516134658';
export const PHONE_DISPLAY = '351 613-4658';
export const EMAIL_CONTACT = 'contacto@aquatech.com.ar';

export const SERVICES: ServiceItem[] = [
  {
    id: 'techos',
    title: 'Techos',
    shortDesc: 'Impermeabilización de losas de hormigón, techos de chapa y tejas con sistemas multicapa y sellado térmico.',
    icon: 'roofing',
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
    icon: 'deck',
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
    icon: 'foundation',
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
    icon: 'water_damage',
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
    icon: 'pool',
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
    icon: 'engineering',
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
    warranty: '10 Años Escrita',
    time: '5 jornadas de trabajo',
    status: '100% Estanco',
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
    warranty: '7 Años Escrita',
    time: '4 jornadas',
    status: 'Factura A + ART Aprobada',
    beforeImg: ASSETS.case2Before,
    afterImg: ASSETS.case2After,
    beforeCaption: 'ANTES: Desprendimiento, baldosas rotas y filtraciones a los departamentos del último piso.',
    afterCaption: 'DESPUÉS: Membrana poliuretánica transitable gris técnico de alto tránsito con juntas de dilatación selladas.',
    details: [
      'Tratamiento de sustrato cerámico existente sin demolición ruidosa',
      'Calafateo de 95 metros lineales de juntas de dilatación con poliuretano Sikaflex',
      'Incorporación de malla de fibra de vidrio de refuerzo tridimensional',
      'Acabado antideslizante con microesferas para seguridad de consorcistas',
      'Emisión formal de Factura A y certificados de ART para la administración'
    ]
  },
  {
    id: 'caso-3',
    number: '03',
    title: 'Chalet en Villa Allende',
    location: 'Villa Allende Golf, Sierras Chicas',
    system: 'Reemplazo y sellado de cubierta de tejas coloniales, renovación de zinguería y aplicación de sellador polimérico hidrófugo de penetración profunda.',
    surface: '190 m² de cubierta',
    warranty: '5 Años Escrita',
    time: '3 jornadas',
    status: 'Cero Humedad',
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
    icon: 'photo_camera',
    tag: 'Desde tu celular'
  },
  {
    step: '2',
    title: 'Visita técnica sin cargo',
    description: 'Coordinamos una inspección en tu domicilio o consorcio en Córdoba para evaluar la superficie, pendientes y fisuras.',
    icon: 'location_on',
    tag: 'Córdoba y Gran Córdoba'
  },
  {
    step: '3',
    title: 'Presupuesto en 24 h',
    description: 'Recibís un desglose técnico formal con opciones de materiales normalizados, plazos de ejecución y formas de pago.',
    icon: 'receipt_long',
    tag: 'Sin sorpresas ni extras'
  },
  {
    step: '4',
    title: 'Trabajo con garantía escrita',
    description: 'Ejecución limpia, supervisión técnica continua y entrega de tu certificado de garantía formal firmado.',
    icon: 'verified',
    tag: 'Hasta 10 años firmado'
  }
];

export const ZONES: ZoneItem[] = [
  { id: '1', name: 'Córdoba Capital', department: 'Capital (Todos los barrios)', dispatchTime: '24 hs hábiles', mobileTeam: 'Móvil 01 & 02', status: 'Alta disponibilidad' },
  { id: '2', name: 'Villa Allende', department: 'Sierras Chicas', dispatchTime: '24 hs hábiles', mobileTeam: 'Móvil 03 (Zona Norte)', status: 'Rutas diarias' },
  { id: '3', name: 'Mendiolaza', department: 'Sierras Chicas', dispatchTime: '24 hs hábiles', mobileTeam: 'Móvil 03 (Zona Norte)', status: 'Rutas diarias' },
  { id: '4', name: 'Río Ceballos', department: 'Sierras Chicas', dispatchTime: '24 a 48 hs', mobileTeam: 'Móvil 03 (Zona Norte)', status: 'Rutas diarias' },
  { id: '5', name: 'Villa Carlos Paz', department: 'Valle de Punilla', dispatchTime: '24 a 48 hs', mobileTeam: 'Móvil 04 (Punilla)', status: 'Rutas diarias' },
  { id: '6', name: 'Malagueño', department: 'Santa María', dispatchTime: '24 hs hábiles', mobileTeam: 'Móvil 02 (Autopista)', status: 'Alta disponibilidad' },
  { id: '7', name: 'La Calera', department: 'Colón', dispatchTime: '24 hs hábiles', mobileTeam: 'Móvil 01 (Oeste)', status: 'Alta disponibilidad' },
  { id: '8', name: 'Alta Gracia', department: 'Santa María', dispatchTime: '48 hs hábiles', mobileTeam: 'Móvil 05 (Sur)', status: 'Guardia activa' },
  { id: '9', name: 'Jesús María', department: 'Colón', dispatchTime: '48 hs hábiles', mobileTeam: 'Móvil 03 (Ruta 9)', status: 'Guardia activa' },
  { id: '10', name: 'Unquillo & Salsipuedes', department: 'Sierras Chicas', dispatchTime: '24 a 48 hs', mobileTeam: 'Móvil 03 (Norte)', status: 'Rutas diarias' },
  { id: '11', name: 'Cosquín & Valle Hermoso', department: 'Valle de Punilla', dispatchTime: '48 hs hábiles', mobileTeam: 'Móvil 04 (Punilla)', status: 'Guardia activa' },
  { id: '12', name: 'Toda la Provincia de Córdoba', department: 'Obras mayores / Consorcios', dispatchTime: 'A coordinar', mobileTeam: 'Equipo Especial', status: 'Alta disponibilidad' }
];

export const TESTIMONIALS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Arq. Lucas Benítez',
    role: 'Administración de Consorcio',
    location: 'Córdoba — Güemes & Nva Córdoba',
    comment: 'Excelente trabajo en el techo del edificio en Güemes. Teníamos goteras históricas que ningún techista solucionaba. Impecable la atención y la garantía.',
    rating: 5,
    date: 'Hace 2 semanas'
  },
  {
    id: 'rev-2',
    name: 'Mariana R.',
    role: 'Propietaria de Vivienda',
    location: 'Mendiolaza — B° Los Cigarrales',
    comment: 'Mandé las fotos un lunes, el martes vinieron a ver la casa en Mendiolaza y el jueves ya estaba presupuestado. Cumplieron los plazos al pie de la letra.',
    rating: 5,
    date: 'Hace 1 mes'
  },
  {
    id: 'rev-3',
    name: 'Ing. Carlos Ferrero',
    role: 'Planta Logística Industrial',
    location: 'Malagueño — Parque Industrial',
    comment: 'Hicieron la impermeabilización de 300 m² de nave industrial en Malagueño. Muy profesionales y con factura y garantía como corresponde.',
    rating: 5,
    date: 'Hace 3 semanas'
  },
  {
    id: 'rev-4',
    name: 'Dra. Silvina Godoy',
    role: 'Propietaria Dúplex',
    location: 'Villa Allende — Golf',
    comment: 'Se nos llovía la losa cada vez que caían tormentas de verano. La solución de membrana geotextil y pintura térmica dejó el techo impecable y además redujo el calor en la planta alta.',
    rating: 5,
    date: 'Hace 1 mes'
  },
  {
    id: 'rev-5',
    name: 'Esteban M. Olmedo',
    role: 'Administrador de Inmuebles',
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
  policyNumber: 'GAR-2025-CBA-9418',
  technicalDirector: 'Ing. M. Santillán (Mat. Profesional CPIA 8421)',
  standards: 'IRAM 1555 / 1570 / 1568',
  watertightTest: 'Aprobada — Inundación controlada 48 hs sin descensos de nivel',
  coveragePeriod: 'Hasta 10 Años Escrita',
  registeredSeal: 'Dirección Técnica AquaTech Soluciones SRL',
  address: 'Av. Rafael Núñez 4200, Córdoba, Argentina'
};
