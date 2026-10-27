/**
 * Datos y cálculos del panel de presupuestos. Se guardan en la nube con la cuenta de Martín (cloud.ts):
 * la dirección y el CUIT no están en el código del sitio.
 */
import { EMAIL, PHONE_DISPLAY } from '../data/mockData';

/** Unidad libre: las de UNITS son sugerencias (en materiales se puede escribir cualquiera) */
export type Unit = string;
/** Sección del presupuesto: mano de obra o materiales */
export type Kind = 'mano' | 'material';
export type Status = 'borrador' | 'enviado' | 'aceptado' | 'rechazado';

export interface Line {
  id: string;
  description: string;
  detail: string;
  qty: string;
  unit: Unit;
  price: string;
  kind?: Kind; // los presupuestos anteriores no lo tienen: son mano de obra
}

export interface Budget {
  id: string;
  number: number;
  date: string; // AAAA-MM-DD
  client: { name: string; phone: string; address: string };
  lines: Line[];
  discount: string; // porcentaje
  work: string; // detalle del trabajo
  materialsIncluded?: boolean; // ya no se usa: se deduce de la sección Materiales
  materialsUnpriced?: boolean; // versión anterior: todos los materiales sin precio (hoy es por línea)
  warranty: string;
  validityDays: string;
  notes: string;
  status: Status;
  updatedAt: number;
}

export interface Issuer {
  address: string;
  cuit: string;
  phone: string;
  email: string;
  web: string;
}

export const UNITS: Record<Kind, Unit[]> = {
  mano: ['m²', 'ml', 'u', 'global'],
  material: ['u', 'rollos', 'baldes', 'latas', 'litros', 'kg', 'bolsas', 'm²', 'ml', 'global'],
};

/** Un material de la lista propia de Martín (se edita desde el panel y se guarda en su cuenta) */
export interface CatalogItem {
  id: string;
  description: string;
  unit: Unit;
  price: string;
}
export const KIND_LABEL: Record<Kind, string> = { mano: 'Mano de obra', material: 'Materiales' };
export const kindOf = (line: Line): Kind => line.kind ?? 'mano';
export const STATUSES: Status[] = ['borrador', 'enviado', 'aceptado', 'rechazado'];
export const STATUS_LABEL: Record<Status, string> = { borrador: 'Borrador', enviado: 'Enviado', aceptado: 'Aceptado', rechazado: 'Rechazado' };

/** Garantías por sistema confirmadas por Martín (ver WARRANTIES en mockData.ts) */
export const WARRANTY_OPTIONS = ['10 años', '5 años', '2 años', '15 años', '20 años', '25 años', 'Sin garantía'];

/** Trabajos y materiales frecuentes. Solo el precio de la promo está confirmado; el resto lo completa Martín. */
export const PRESETS: Record<Kind, { description: string; unit: Unit; price: string }[]> = { mano: [
  { description: 'Impermeabilización (mano de obra)', unit: 'm²', price: '10000' },
  { description: 'Membrana asfáltica con geotextil', unit: 'm²', price: '' },
  { description: 'Membrana asfáltica con aluminio', unit: 'm²', price: '' },
  { description: 'Pintura poliuretánica', unit: 'm²', price: '' },
  { description: 'Reparación de filtración', unit: 'global', price: '' },
  { description: 'Tratamiento de humedad de cimientos', unit: 'ml', price: '' },
  { description: 'Impermeabilización de tanque / pileta', unit: 'u', price: '' },
  { description: 'Pintura exterior', unit: 'm²', price: '' },
], material: [
  { description: 'Membrana asfáltica con geotextil 4 mm', unit: 'rollos', price: '' },
  { description: 'Membrana asfáltica con aluminio', unit: 'rollos', price: '' },
  { description: 'Pintura poliuretánica', unit: 'baldes', price: '' },
  { description: 'Imprimación asfáltica', unit: 'litros', price: '' },
  { description: 'Venda / malla de refuerzo', unit: 'rollos', price: '' },
  { description: 'Membrana líquida', unit: 'baldes', price: '' },
  { description: 'Sellador', unit: 'u', price: '' },
] };

export const DEFAULT_ISSUER: Issuer = { address: '', cuit: '', phone: PHONE_DISPLAY, email: EMAIL, web: 'aquatechsolutions.com.ar' };

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/** Lista inicial de materiales, sin precios: Martín la edita a su gusto */
export const defaultCatalog = (): CatalogItem[] => PRESETS.material.map(p => ({ id: uid(), ...p }));
export const newCatalogItem = (): CatalogItem => ({ id: uid(), description: '', unit: 'u', price: '' });

export const newLine = (preset?: Partial<Line>): Line => ({ id: uid(), description: '', detail: '', qty: '', unit: 'm²', price: '', ...preset });

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const newBudget = (number: number): Budget => ({
  id: uid(),
  number,
  date: today(),
  client: { name: '', phone: '', address: '' },
  lines: [newLine({ description: 'Impermeabilización (mano de obra)', unit: 'm²', price: '10000', kind: 'mano' })],
  discount: '',
  work: '',
  warranty: '10 años',
  validityDays: '30',
  notes: '',
  status: 'borrador',
  updatedAt: Date.now(),
});

/** "1.400,50" o "1400.5" → 1400.5 */
export function parseNumber(value: string): number {
  const clean = value.trim().replace(/\s|\$/g, '');
  if (!clean) return 0;
  const normalized = clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : /^\d{1,3}(\.\d{3})+$/.test(clean) ? clean.replace(/\./g, '') : clean;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

/** Material sin precio cargado (o de un presupuesto viejo marcado "sin precios"): va "a cotizar" */
export const isToQuote = (budget: Budget, line: Line) => kindOf(line) === 'material' && (Boolean(budget.materialsUnpriced) || !line.price.trim());

export const lineTotal = (line: Line) => (line.unit === 'global' && !line.qty.trim() ? 1 : parseNumber(line.qty)) * parseNumber(line.price);

/** El descuento se aplica solo a la mano de obra; los materiales van al costo. */
export function totals(budget: Budget) {
  const sumOf = (kind: Kind) => budget.lines.filter(l => kindOf(l) === kind).reduce((sum, line) => sum + lineTotal(line), 0);
  const labor = sumOf('mano');
  const listed = budget.lines.filter(l => kindOf(l) === 'material' && l.description.trim());
  // Material sin precio: se lista con su cantidad pero no suma (los precios varían y se cotizan al comprar)
  const toQuote = listed.filter(l => isToQuote(budget, l)).length;
  const materials = budget.lines.filter(l => kindOf(l) === 'material' && !isToQuote(budget, l)).reduce((sum, line) => sum + lineTotal(line), 0);
  const pct = Math.min(100, Math.max(0, parseNumber(budget.discount)));
  const discount = Math.round(labor * pct) / 100;
  return {
    labor, materials, pct, discount, total: labor - discount + materials,
    unpriced: toQuote > 0, // hay materiales a cotizar
    allUnpriced: toQuote > 0 && toQuote === listed.length, // todos los materiales están a cotizar
  };
}

const money = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });
export const formatMoney = (n: number) => `$${money.format(n)}`;
export const formatQty = (line: Line) => (line.unit === 'global' ? (line.qty.trim() ? `${line.qty} gl.` : 'Global') : `${line.qty || 0} ${line.unit}`);
/** Para el precio unitario: "$4.500 / balde" */
export const unitSingular = (unit: Unit) => {
  const u = unit.trim();
  const known: Record<string, string> = { rollos: 'rollo', baldes: 'balde', latas: 'lata', litros: 'litro', bolsas: 'bolsa', unidades: 'unidad' };
  // "cajas" → "caja", "tachos" → "tacho"; lo demás queda como está
  return known[u.toLowerCase()] ?? (/^[a-záéíóúñ]+[ao]s$/i.test(u) ? u.slice(0, -1) : u);
};
export const formatNumber = (n: number) => String(n).padStart(4, '0');

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

export function addDays(iso: string, days: number) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Celular argentino → número para wa.me (549 + característica + número). Vacío si no se puede. */
export function waNumber(phone: string) {
  let digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('54')) digits = digits.slice(2);
  if (digits.startsWith('9')) digits = digits.slice(1);
  if (digits.startsWith('0')) digits = digits.slice(1);
  digits = digits.replace(/^(\d{2,4})15(\d{6,8})$/, (_, area: string, rest: string) => (area.length + rest.length === 10 ? area + rest : _));
  return digits.length === 10 ? `549${digits}` : '';
}

export const fileName = (budget: Budget) => {
  const name = budget.client.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '');
  return `Presupuesto-AquaTech-${formatNumber(budget.number)}${name ? `-${name}` : ''}.pdf`;
};

/** Próximo número correlativo */
export const nextNumber = (budgets: Budget[]) => Math.max(0, ...budgets.map(b => b.number || 0)) + 1;

/** Copia de seguridad para pasar los presupuestos a otro dispositivo */
export const exportBackup = (budgets: Budget[], issuer: Issuer) => JSON.stringify({ app: 'aquatech-presupuestos', version: 1, budgets, issuer }, null, 2);

export function importBackup(text: string): { budgets: Budget[]; issuer?: Issuer } {
  const data = JSON.parse(text);
  if (data?.app !== 'aquatech-presupuestos' || !Array.isArray(data.budgets)) throw new Error('El archivo no es una copia de presupuestos de AquaTech.');
  return { budgets: data.budgets.filter((b: Budget) => b && b.id && Array.isArray(b.lines)), issuer: data.issuer };
}
