/**
 * Plan de Mantenimiento. Fuente de verdad: contrato versión 1.0 del 21/10/2026.
 * - Se llama "Plan de Mantenimiento": nunca "póliza" ni "seguro" (no es un seguro).
 * - Sin precios en la web: el abono y las urgencias se ajustan cada 3 meses por IPC y se piden por WhatsApp.
 * - No publicar dirección, CUIT, CBU ni el contrato en PDF.
 */
export const MAINTENANCE_PLAN = {
  title: 'Plan de Mantenimiento',
  subtitle:
    'Tu casa revisada todos los meses. Un abono mensual, reparaciones menores incluidas y un informe con fotos después de cada visita.',
  intro:
    'Un abono mensual por vivienda, solo mano de obra y con factura. Lo pueden contratar inmobiliarias, propietarios o inquilinos (con autorización del dueño).',
  highlights: [
    { id: 'anual', title: 'Pagás 10 meses, te llevás 12', text: 'Con el pago anual: 2 meses de regalo y el precio fijo todo el año.' },
    { id: 'descuento', title: '50% en mano de obra de impermeabilización y pintura exterior', text: 'En las viviendas del plan, con el contrato vigente y al día.' },
    { id: 'cupo', title: 'Cupo: 30 casas por mes', text: 'Una visita por día, para dedicarle el tiempo que cada casa necesita.' },
  ],
  includes: [
    'Una visita mensual de revisión preventiva: techos y membranas, canaletas y bajadas, desagües, humedad en paredes y cielorrasos, y pérdidas de agua.',
    'En esa visita, la mano de obra de reparaciones menores: plomería menor (grifos y destapación de bachas) y electricidad básica (cambio de llaves, tomacorrientes, focos y térmicas). Lo que no se termina en la visita se presupuesta aparte.',
    'Un informe con fotos después de cada visita, por WhatsApp o email.',
    '50% de descuento en la mano de obra de impermeabilización y de pintura exterior.',
  ],
  excludes: [
    'Cerraduras, alarmas, cámaras ni seguridad.',
    'Revoque.',
    'Plomería completa (cambio o tendido de cañerías).',
    'Aires acondicionados.',
    'Instalaciones eléctricas completas o nuevas, y tableros.',
    'Nada relacionado con gas: hornos, cocinas, calefones, artefactos e instalaciones de gas los atiende un gasista matriculado.',
    'Edificios ni propiedades fuera de la Circunvalación.',
    'Materiales y repuestos.',
    'Daños por mal uso, terceros o clima extraordinario.',
  ],
  visualNote: 'La revisión es visual, sin romper ni desarmar. No es un seguro: no cubre siniestros, robos, roturas por accidentes ni daños.',
  payment: [
    'Abono mensual por vivienda según las plantas: un valor para casas de 1 planta y otro para casas de 2 plantas. Más de 2 plantas: a convenir.',
    'Se paga por adelantado, del 1 al 10 de cada mes, por transferencia. Con factura.',
    'Ajuste cada 3 meses según el IPC del INDEC.',
    'Materiales y trabajos fuera del abono: siempre con presupuesto previo, válido por 7 días y aprobado por escrito. Sin aprobación no se hace nada.',
    'Visitas extra y urgencias (entrada de agua, caño roto, pérdida importante) se cobran aparte. Apuntamos a atenderlas dentro de las 24 horas, según agenda.',
  ],
  agencies: {
    title: 'Para inmobiliarias',
    points: [
      'Un proveedor fijo para todas las casas que administran.',
      'Informe con fotos para reenviar al propietario.',
      'Un solo contacto.',
      'Contrato con factura.',
    ],
    cta: 'Soy inmobiliaria',
    whatsappText: 'Hola, soy de una inmobiliaria y quiero info del Plan de Mantenimiento',
  },
  smallPrint: [
    'Viviendas dentro de la Circunvalación de Córdoba',
    'Contrato mínimo de 12 meses',
    'Abono solo mano de obra, con factura',
    'No es un seguro',
  ],
  cta: 'Pedí el precio por WhatsApp',
  whatsappText: 'Hola, quiero info del Plan de Mantenimiento',
  areaServed: 'Córdoba Capital, dentro de la Circunvalación',
  faqs: [
    {
      id: 'plan-seguro',
      question: '¿Es un seguro?',
      answer: 'No: es un servicio de mantenimiento preventivo y reparaciones menores. No cubre siniestros, robos, roturas por accidentes ni daños.',
    },
    {
      id: 'plan-incluye',
      question: '¿Qué incluye y qué no?',
      answer:
        'Incluye una visita mensual de revisión (techos y membranas, canaletas y bajadas, desagües, humedad y pérdidas de agua), la mano de obra de plomería menor y electricidad básica en esa visita, un informe con fotos y 50% de descuento en mano de obra de impermeabilización y pintura exterior. No incluye cerraduras ni seguridad, revoque, plomería completa, aires acondicionados, instalaciones eléctricas completas ni tableros, nada de gas, materiales ni repuestos, ni daños por mal uso, terceros o clima extraordinario.',
    },
    {
      id: 'plan-materiales',
      question: '¿Los materiales están incluidos?',
      answer: 'No: se presupuestan aparte y no se compra nada sin tu aprobación. El presupuesto es válido por 7 días y se aprueba por escrito.',
    },
    {
      id: 'plan-plazo',
      question: '¿Cuánto dura el contrato y cómo se da de baja?',
      answer:
        'El contrato es de 12 meses y se renueva solo; cada casa tiene un mínimo de 12 meses desde su alta. La baja se pide con 30 días de aviso: en los meses 1 a 6 desde el alta se pagan 3 abonos; en los meses 7 a 12, 1 abono; después del año, sin cargo. Si la inmobiliaria deja de administrar la casa o el dueño la vende o deja de alquilarla, se puede cambiar por otra sin costo. Clientes particulares: 10 días para arrepentirse sin costo si firmaron fuera de un local.',
    },
    {
      id: 'plan-anual',
      question: '¿Cómo funciona el pago anual?',
      answer: 'Pagás 10 meses y tenés 12 meses de servicio (2 meses de regalo), con el precio fijo todo el año.',
    },
    {
      id: 'plan-pintura',
      question: '¿Cuándo puedo usar el 50% en pintura?',
      answer:
        'El 50% es en la mano de obra de impermeabilización y de pintura exterior de las viviendas del plan (pintura solo en casas, no edificios), mientras el contrato esté vigente y al día. La pintura con descuento se puede pedir una vez cada 12 meses: con pago mensual, después de 9 abonos pagos; con pago anual, desde el inicio. Se agenda con Martín.',
    },
    {
      id: 'plan-gas',
      question: '¿Trabajan con gas?',
      answer: 'No. Todo lo relacionado con gas lo atiende un gasista matriculado.',
    },
    {
      id: 'plan-zona',
      question: '¿En qué zona?',
      answer: 'Solo casas dentro de la Avenida de Circunvalación de Córdoba. El cupo es de 30 casas por mes (una visita por día).',
    },
    {
      id: 'plan-alta',
      question: '¿Qué necesito para empezar?',
      answer:
        'Dirección y cantidad de plantas de la casa, datos del inquilino si está alquilada, copia del DNI del titular (frente y dorso) y certificados de gas y electricidad firmados por matriculados. Después se firma el contrato, se hace el primer pago y la primera visita, donde registramos el estado inicial con fotos (lo que ya está dañado se presupuesta aparte).',
    },
    {
      id: 'plan-factura',
      question: '¿Dan factura?',
      answer: 'Sí.',
    },
  ],
};
