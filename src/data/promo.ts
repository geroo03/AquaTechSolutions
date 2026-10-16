/**
 * Promo temporal. Fuente: flyer de Martín "Promo mano de obra" (Desktop/marketing.aquatech/Extras).
 * Si `endsAt` tiene fecha (hora de Córdoba), pasada esa fecha desaparece sola:
 *  - al compilar no se genera (el workflow recompila todos los días a las 00:05 de Argentina),
 *  - y en el navegador se vuelve a chequear la fecha por si la página quedó abierta o en caché.
 * Con `endsAt: null` queda sin vencimiento. Para una promo nueva: cambiar los textos y `endsAt`.
 *
 * 16/10/2026: Martín decidió dejar la promo como estrategia de marketing hasta definir los precios
 * definitivos, así que no vence el 31/10. Sin fecha de fin, no decir "solo por este mes".
 */
export const PROMO = {
  endsAt: null as string | null,
  /** Texto de vigencia; vacío mientras no haya fecha de fin */
  validUntilLabel: '',
  eyebrow: 'Promo vigente',
  title: '¿Problemas de humedad o filtraciones?',
  subtitle: 'Tenemos la solución que tu techo necesita.',
  priceLabel: 'Precio de mano de obra',
  badge: 'Por tiempo limitado',
  items: [
    { name: 'Membrana asfáltica con aluminio flexible', price: '$10.000', unit: 'por m²' },
    { name: 'Membrana asfáltica con geotextil y pintura', price: '$10.000', unit: 'por m²' },
    { name: 'Membrana líquida poliuretánica o acrílica', price: '$10.000', unit: 'por m²' },
  ],
  note: 'Precio de mano de obra. Materiales no incluidos.',
  specialist: 'Martín Emiliano Nieto',
  specialistRole: 'Impermeabilización de techos, terrazas y balcones',
  whatsappText: 'Hola AquaTech, quiero aprovechar la promo de mano de obra a $10.000 el m²',
  /** Tarjetas de "Servicios" que se destacan mientras la promo está activa (ids de SERVICES) */
  serviceIds: ['techos', 'terrazas'],
};

export const isPromoActive = (now: number) => PROMO.endsAt === null || now < Date.parse(PROMO.endsAt);
