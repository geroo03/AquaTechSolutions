/**
 * Plan de Mantenimiento para inmobiliarias. Textos dados por Sebastián (20/10/2026).
 * Sin precio en la web: el abono se ajusta cada 3 meses por IPC y se pide por WhatsApp.
 * No llamarlo "póliza" ni "seguro".
 */
export const MAINTENANCE_PLAN = {
  title: 'Plan de Mantenimiento para inmobiliarias',
  subtitle:
    'Un proveedor fijo para las casas que administran. Una visita por mes, reparaciones menores y un informe con fotos para cada propietario.',
  benefits: [
    {
      id: 'inmobiliaria',
      title: 'Para la inmobiliaria',
      text: 'Un contacto fijo para todas sus casas, sin buscar a quién llamar cada vez.',
    },
    {
      id: 'propietario',
      title: 'Para el propietario',
      text: 'Un informe con fotos cada mes que muestra que su casa está cuidada.',
    },
    {
      id: 'casa',
      title: 'Para la casa',
      text: 'Humedad y pérdidas detectadas antes de que sean un arreglo caro.',
    },
  ],
  includes: [
    'Visita mensual de revisión: techos, canaletas, desagües, humedad y pérdidas de agua.',
    'Plomería menor: grifos y destapación de bachas.',
    'Electricidad básica: llaves, tomacorrientes, focos y térmicas.',
    'Hornos, cocinas y calefones, en lo que no toca la instalación de gas.',
    'Informe con fotos después de cada visita.',
    'Descuento en pintura exterior de casas.',
  ],
  excludes:
    'Cerraduras y seguridad, revoque, plomería completa, aires acondicionados, instalaciones eléctricas completas ni trabajos sobre la instalación de gas.',
  materialsNote: 'Los materiales se cobran aparte, siempre con presupuesto aprobado.',
  conditions: [
    'Viviendas dentro de la Circunvalación de Córdoba.',
    'Contrato mínimo de 12 meses, con factura.',
    'Abono mensual por vivienda, solo mano de obra.',
  ],
  cta: 'Pedir el plan por WhatsApp',
  whatsappText: 'Hola, soy de una inmobiliaria y quiero info del Plan de Mantenimiento',
  areaServed: 'Córdoba Capital (dentro de la Circunvalación)',
};
