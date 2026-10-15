/**
 * Promo temporal. Fuente: flyer de Martín "Promo mano de obra" (Desktop/marketing.aquatech/Extras).
 * Se muestra hasta `endsAt` (hora de Córdoba). Pasada esa fecha desaparece sola:
 *  - al compilar no se genera (el workflow recompila todos los días a las 00:05 de Argentina),
 *  - y en el navegador se vuelve a chequear la fecha por si la página quedó abierta o en caché.
 * Para una promo nueva: cambiar los textos y `endsAt`.
 */
export const PROMO = {
  endsAt: '2026-11-01T00:00:00-03:00',
  validUntilLabel: '31 de octubre',
  eyebrow: 'Promo de octubre',
  title: '¿Problemas de humedad o filtraciones?',
  subtitle: 'Tenemos la solución que tu techo necesita.',
  priceLabel: 'Precio de mano de obra',
  badge: 'Solo por este mes',
  items: [
    { name: 'Membrana asfáltica con aluminio flexible', price: '$10.000', unit: 'por m²' },
    { name: 'Membrana asfáltica con geotextil y pintura', price: '$10.000', unit: 'por m²' },
    { name: 'Membrana líquida poliuretánica o acrílica', price: '$10.000', unit: 'por m²' },
  ],
  note: 'Precio de mano de obra. Materiales no incluidos.',
  specialist: 'Martín Emiliano Nieto',
  specialistRole: 'Impermeabilización de techos, terrazas y balcones',
  whatsappText: 'Hola AquaTech, quiero aprovechar la promo de mano de obra a $10.000 el m²',
};

export const isPromoActive = (now: number) => now < Date.parse(PROMO.endsAt);
