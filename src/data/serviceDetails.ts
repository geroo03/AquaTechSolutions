export interface ServiceDetail {
  id: string;
  number: string;
  heading: string;
  intro: string;
  action: string;
  message: string;
  questions: { title: string; text: string }[];
  approach: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
}

const commonFaqs = [
  { question: '¿El presupuesto tiene costo?', answer: 'El presupuesto es sin cargo. Para empezar, mandanos fotos, tu barrio o localidad y los metros cuadrados aproximados. La visita técnica puede tener un costo de viáticos según la distancia.' },
  { question: '¿En qué zonas trabajan?', answer: 'Trabajamos en toda la provincia de Córdoba y en las provincias limítrofes. Contanos dónde está el inmueble para coordinar. En barrios privados trabajamos de lunes a viernes.' },
];

export const SERVICE_DETAILS: ServiceDetail[] = [
  {
    id: 'techos', number: '01', heading: 'Impermeabilización de techos en Córdoba.',
    intro: 'Impermeabilizamos techos en Córdoba con membranas asfálticas con aluminio o geotextil y terminación con pintura poliuretánica. La elección del sistema empieza por revisar tu superficie.',
    action: 'Consultar por mi techo',
    message: 'Hola AquaTech, quiero un presupuesto de impermeabilización de techo. Les mando fotos, mi barrio y los m² aproximados.',
    questions: [
      { title: 'Goteras cuando llueve', text: 'Contanos en qué ambiente aparecen y mandanos fotos del interior y del techo, si podés hacerlo de forma segura.' },
      { title: 'Una membrana que necesita atención', text: 'Mostranos el estado de la capa existente. Ese dato ayuda a preparar la evaluación del trabajo.' },
      { title: 'Un techo para impermeabilizar', text: 'Indicá la superficie aproximada y la ubicación. Con esa información podemos avanzar con tu consulta.' },
    ],
    approach: [
      { title: 'Membrana con geotextil', text: 'Una de las soluciones que aplicamos en techos. La garantía confirmada para este sistema es de 10 años.' },
      { title: 'Membrana con aluminio', text: 'Otra alternativa de impermeabilización, con garantía de 5 años. El sistema se define según el trabajo.' },
      { title: 'Terminación y garantía', text: 'También trabajamos con pintura poliuretánica. En el presupuesto detallamos el sistema y su garantía por escrito.' },
    ],
    faqs: [
      { question: '¿Qué membrana conviene para mi techo?', answer: 'Trabajamos con membrana asfáltica con aluminio y con geotextil. Para recomendar una necesitamos conocer el techo y revisar el estado de la superficie; no elegimos solo por una foto o por el precio por metro cuadrado.' },
      { question: '¿La garantía es la misma para todos los trabajos?', answer: 'No. La garantía depende del sistema: 10 años para membrana con geotextil y 5 años para membrana con aluminio. Se entrega por escrito, en papel y en formato digital.' },
      ...commonFaqs,
    ],
  },
  {
    id: 'cimientos', number: '02', heading: 'Humedad de cimientos en Córdoba.',
    intro: 'Tratamos la humedad de cimientos que aparece en muros y zócalos. Contanos qué estás viendo y dónde ocurre para evaluar el trabajo y recomendar el sistema adecuado.',
    action: 'Consultar por humedad',
    message: 'Hola AquaTech, quiero consultar por humedad en cimientos, muros o zócalos. Les mando fotos y la ubicación del inmueble.',
    questions: [
      { title: 'Marcas cerca del piso', text: 'Mandanos una foto general de la pared y otra de cerca. Indicá si pasa en un ambiente o en varios.' },
      { title: 'Humedad que vuelve a aparecer', text: 'Contanos desde cuándo ocurre y si ya se hizo algún tratamiento. Esa información sirve para evaluar el caso.' },
      { title: 'Una consulta antes de renovar', text: 'Si estás por hacer un trabajo en el inmueble, podés consultar por el tratamiento de la humedad antes de avanzar.' },
    ],
    approach: [
      { title: 'Conocer el problema', text: 'Nos compartís fotos y una descripción de lo que está pasando. Coordinamos la revisión cuando hace falta.' },
      { title: 'Definir el tratamiento', text: 'La propuesta se prepara para tu caso. La superficie y el estado del inmueble se revisan antes de recomendar un sistema.' },
      { title: 'Presupuesto y garantía', text: 'Recibís el detalle del trabajo y la garantía según el sistema elegido, entregada por escrito.' },
    ],
    faqs: [
      { question: '¿Pueden definir el tratamiento solo con una foto?', answer: 'Las fotos permiten iniciar la consulta. Para definir el trabajo podemos necesitar una visita técnica y revisar el inmueble.' },
      { question: '¿Qué garantía tiene el tratamiento de cimientos?', answer: 'La garantía depende del sistema recomendado. No aplicamos automáticamente la garantía de una membrana de techo a un tratamiento de cimientos: el alcance se detalla en el presupuesto.' },
      ...commonFaqs,
    ],
  },
  {
    id: 'terrazas', number: '03', heading: 'Impermeabilización de terrazas y balcones.',
    intro: 'Impermeabilizamos terrazas y balcones expuestos a la lluvia en Córdoba. Revisamos el estado de la superficie y preparamos una propuesta para el trabajo que necesitás.',
    action: 'Consultar por mi terraza',
    message: 'Hola AquaTech, quiero un presupuesto para impermeabilizar una terraza o balcón. Les mando fotos, mi barrio y la superficie aproximada.',
    questions: [
      { title: 'Filtraciones desde la terraza', text: 'Mostranos la superficie y el ambiente donde aparece el problema. Contanos cuándo notás la filtración.' },
      { title: 'Una impermeabilización existente', text: 'Indicá qué hay colocado y cómo se encuentra. Si tenés fotos de trabajos anteriores, también ayudan a la consulta.' },
      { title: 'Terrazas, balcones y consorcios', text: 'Podés consultar por una vivienda o un edificio. Sumá ubicación y metros cuadrados aproximados al mensaje.' },
    ],
    approach: [
      { title: 'Revisión de la superficie', text: 'Conocemos la terraza o balcón y su estado actual antes de definir la propuesta.' },
      { title: 'Sistema de impermeabilización', text: 'La elección se detalla en el presupuesto. Trabajamos con distintos sistemas de membrana y terminaciones.' },
      { title: 'Trabajo y respaldo por escrito', text: 'Coordinamos la ejecución y entregamos la garantía correspondiente al sistema aplicado.' },
    ],
    faqs: [
      { question: '¿También trabajan en balcones?', answer: 'Sí. Terrazas y balcones forman parte de nuestros servicios. Mandanos fotos y contanos qué tipo de superficie necesitás evaluar.' },
      { question: '¿La garantía de una terraza siempre es de 10 años?', answer: 'La garantía se define por el sistema aplicado, no solo por tratarse de una terraza. El presupuesto indica cuál corresponde al trabajo.' },
      ...commonFaqs,
    ],
  },
];
