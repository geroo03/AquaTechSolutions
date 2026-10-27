/**
 * PDF del presupuesto, armado en el navegador con jsPDF (se carga solo en el panel).
 * Diseño monocromo de la marca: cabecera negra con el logo, marca de agua con la "Λ" y el nombre,
 * tabla de trabajos, total, garantía, condiciones y espacio para la firma del cliente.
 */
import type { GState as GStateClass, jsPDF as JsPDF } from 'jspdf';
import { INSTAGRAM_HANDLE } from '../data/mockData';
import {
  KIND_LABEL, addDays, isToQuote, formatDate, formatMoney, formatNumber, formatQty, kindOf, lineTotal, parseNumber, totals, unitSingular,
  type Budget, type Issuer, type Kind,
} from './model';

export interface PdfKit {
  JsPDF: typeof JsPDF;
  GState: typeof GStateClass;
  logo: string | null; // JPEG en data URL
}

/** Carga jsPDF y el logo una sola vez, antes del clic: así el PDF se arma en el mismo gesto (compartir en iPhone lo exige). */
export async function loadPdfKit(): Promise<PdfKit> {
  const [{ jsPDF, GState }, logo] = await Promise.all([import('jspdf'), loadLogo()]);
  return { JsPDF: jsPDF, GState, logo };
}

function loadLogo(): Promise<string | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      // El original pesa ~1 MB: se achica a 480 px para que el PDF sea liviano.
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);
      ctx.fillStyle = '#0b0b0c';
      ctx.fillRect(0, 0, 480, 480);
      ctx.drawImage(img, 0, 0, 480, 480);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = () => resolve(null);
    img.src = new URL('../logo-aquatech.png', window.location.href).href;
  });
}

// Helvetica de jsPDF usa WinAnsi: se reemplaza lo que no puede dibujar (emojis, símbolos raros).
const WIN_ANSI_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
const clean = (text: string) =>
  [...text.normalize('NFC')].map(ch => (ch === '\t' ? ' ' : ch <= 'ÿ' || WIN_ANSI_EXTRA.includes(ch) ? ch : '')).join('');

const INK: [number, number, number] = [11, 11, 12];
const GRAPHITE: [number, number, number] = [58, 58, 63];
const MUTED: [number, number, number] = [110, 110, 117];
const LINE: [number, number, number] = [228, 228, 231];
const PAPER: [number, number, number] = [246, 246, 247];

const W = 210;
const H = 297;
const M = 16; // margen
const BOTTOM = 268; // debajo va el pie

export function buildPdf(kit: PdfKit, budget: Budget, issuer: Issuer): Blob {
  const doc = new kit.JsPDF({ unit: 'mm', format: 'a4', compress: true });
  const number = formatNumber(budget.number);
  const sum = totals(budget);
  doc.setProperties({ title: `Presupuesto ${number} - AquaTech Solutions`, author: 'AquaTech Solutions', creator: 'AquaTech Solutions' });

  const color = (c: [number, number, number]) => doc.setTextColor(c[0], c[1], c[2]);
  const font = (size: number, style: 'normal' | 'bold' = 'normal', c = INK) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    color(c);
  };
  // Texto con letras espaciadas: jsPDF no suma el espaciado al alinear a la derecha, así que se calcula acá.
  const spaced = (text: string, x: number, y: number, space: number, align: 'left' | 'right' = 'left') => {
    const width = doc.getTextWidth(text) + space * (text.length - 1);
    doc.setCharSpace(space);
    doc.text(text, align === 'right' ? x - width : x, y);
    doc.setCharSpace(0);
  };
  const label = (text: string, x: number, y: number, c = MUTED, align: 'left' | 'right' = 'left') => {
    font(7.5, 'bold', c);
    spaced(text, x, y, 0.6, align);
  };
  const wrap = (text: string, width: number) => doc.splitTextToSize(clean(text), width) as string[];

  // ── Marca de agua (debajo de todo) ──
  const watermark = () => {
    doc.saveGraphicsState();
    doc.setGState(new kit.GState({ opacity: 0.035 }));
    doc.setFillColor(...INK);
    // La "Λ" del logo, grande y centrada (mismo trazo que LogoMark en Brand.tsx)
    const s = 4.2;
    const ox = W / 2 - 20 * s;
    const oy = 150 - 20 * s;
    const pts: [number, number][] = [[20, 4], [37, 36], [28.6, 36], [20, 19.6], [11.4, 36], [3, 36]].map(([x, y]) => [ox + x * s, oy + y * s]);
    doc.lines(pts.slice(1).map(([x, y], i) => [x - pts[i][0], y - pts[i][1]]), pts[0][0], pts[0][1], [1, 1], 'F', true);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(46);
    doc.setTextColor(...INK);
    doc.setCharSpace(3);
    doc.text('AQUATECH', W / 2, oy + 36 * s + 20, { align: 'center' });
    doc.setCharSpace(0);
    // Trama diagonal con el nombre: dificulta recortar o adulterar el documento
    doc.setGState(new kit.GState({ opacity: 0.03 }));
    doc.setFontSize(9);
    doc.setCharSpace(1.2);
    for (let row = 0, y = 20; y < H + 20; row++, y += 34) {
      for (let x = (row % 2) * -38 - 10; x < W; x += 76) doc.text('AQUATECH SOLUTIONS', x, y, { angle: 30 });
    }
    doc.setCharSpace(0);
    doc.restoreGraphicsState();
  };

  const newPage = () => {
    doc.addPage();
    watermark();
    font(8, 'bold', MUTED);
    doc.text(`PRESUPUESTO N° ${number} (continuación)`, M, 14);
    doc.setDrawColor(...LINE);
    doc.line(M, 17, W - M, 17);
    return 25;
  };
  let y = 0;
  const ensure = (height: number) => {
    if (y + height > BOTTOM) y = newPage();
  };

  // ── Página 1: cabecera ──
  watermark();
  doc.setFillColor(...INK);
  doc.rect(0, 0, W, 50, 'F');
  if (kit.logo) doc.addImage(kit.logo, 'JPEG', 12, 5, 40, 40);
  else {
    font(20, 'bold', [255, 255, 255]);
    doc.text('AQUATECH', M, 26);
  }
  font(9, 'bold', [201, 201, 205]);
  spaced('IMPERMEABILIZACIONES QUE PERDURAN', 56, 41, 0.8);
  font(24, 'bold', [255, 255, 255]);
  spaced('PRESUPUESTO', W - M, 20, 1, 'right');
  font(10.5, 'bold', [255, 255, 255]);
  doc.text(`N° ${number}`, W - M, 28, { align: 'right' });
  font(9, 'normal', [201, 201, 205]);
  doc.text(`Fecha: ${formatDate(budget.date)}`, W - M, 34.5, { align: 'right' });
  const days = Math.round(parseNumber(budget.validityDays));
  if (days > 0) doc.text(`Válido hasta: ${formatDate(addDays(budget.date, days))}`, W - M, 40, { align: 'right' });

  // ── Emisor y cliente ──
  y = 60;
  const colW = (W - 2 * M - 6) / 2;
  const fromLines = [
    issuer.address && clean(issuer.address),
    issuer.cuit && `CUIT ${clean(issuer.cuit)}`,
    issuer.phone && `Tel. / WhatsApp ${clean(issuer.phone)}`,
    issuer.email && clean(issuer.email),
    issuer.web && clean(issuer.web),
  ].filter(Boolean) as string[];
  font(9.5);
  const toLines = [
    ...(budget.client.phone ? [`Tel. ${clean(budget.client.phone)}`] : []),
    ...(budget.client.address ? wrap(budget.client.address, colW - 10) : []),
  ];
  const nameLines = wrap(budget.client.name || 'Cliente', colW - 10);
  const boxH = Math.max(14 + fromLines.length * 4.6, 14 + nameLines.length * 5 + toLines.length * 4.6) + 3;
  doc.setFillColor(...PAPER);
  doc.roundedRect(M, y, colW, boxH, 3, 3, 'F');
  doc.roundedRect(M + colW + 6, y, colW, boxH, 3, 3, 'F');
  label('EMITE', M + 5, y + 7);
  label('PARA', M + colW + 11, y + 7);
  font(10.5, 'bold');
  doc.text('AquaTech Solutions', M + 5, y + 13);
  font(9, 'normal', GRAPHITE);
  fromLines.forEach((t, i) => doc.text(t, M + 5, y + 18.6 + i * 4.6));
  font(10.5, 'bold');
  doc.text(nameLines, M + colW + 11, y + 13, { lineHeightFactor: 1.35 });
  font(9, 'normal', GRAPHITE);
  const toY = y + 13 + nameLines.length * 5 + 0.6;
  toLines.forEach((t, i) => doc.text(t, M + colW + 11, toY + i * 4.6));
  y += boxH + 9;

  // ── Tablas: mano de obra y materiales, cada una con su subtotal ──
  const cx = { desc: M + 4, qty: 128, price: 160, sub: W - M - 4 };
  const descW = 98;
  // Materiales sin precio: solo descripción y cantidad (se cotizan al comprar)
  const tableHeader = (priced = true) => {
    doc.setFillColor(...INK);
    doc.roundedRect(M, y, W - 2 * M, 9, 1.5, 1.5, 'F');
    label('DESCRIPCIÓN', cx.desc, y + 5.9, [255, 255, 255]);
    if (priced) {
      label('CANT.', cx.qty, y + 5.9, [255, 255, 255], 'right');
      label('PRECIO UNIT.', cx.price, y + 5.9, [255, 255, 255], 'right');
      label('SUBTOTAL', cx.sub, y + 5.9, [255, 255, 255], 'right');
    } else label('CANTIDAD', cx.sub, y + 5.9, [255, 255, 255], 'right');
    y += 9;
  };
  const filled = budget.lines.filter(l => l.description.trim() || parseNumber(l.price) || parseNumber(l.qty));
  for (const kind of ['mano', 'material'] as Kind[]) {
    const lines = filled.filter(l => kindOf(l) === kind);
    if (!lines.length) continue;
    const priced = !(kind === 'material' && sum.allUnpriced);
    ensure(30);
    font(10, 'bold');
    spaced(KIND_LABEL[kind].toUpperCase(), M, y + 4, 0.5);
    y += 7;
    tableHeader(priced);
    for (const line of lines) {
      font(10, 'bold');
      const desc = wrap(line.description || (kind === 'mano' ? 'Trabajo' : 'Material'), descW);
      font(8.5);
      const detail = line.detail.trim() ? wrap(line.detail, descW) : [];
      const rowH = 6 + desc.length * 4.6 + detail.length * 3.9 + 1;
      if (y + rowH > BOTTOM) {
        y = newPage();
        tableHeader(priced);
      }
      const top = y + 6.2;
      font(10, 'bold');
      doc.text(desc, cx.desc, top, { lineHeightFactor: 1.3 });
      if (detail.length) {
        font(8.5, 'normal', MUTED);
        doc.text(detail, cx.desc, top + desc.length * 4.6, { lineHeightFactor: 1.3 });
      }
      font(9.5, 'normal', GRAPHITE);
      if (priced && isToQuote(budget, line)) {
        doc.text(clean(formatQty(line)), cx.qty, top, { align: 'right' });
        font(9.5, 'normal', MUTED);
        doc.text('A cotizar', cx.price, top, { align: 'right' });
        doc.text('-', cx.sub, top, { align: 'right' });
      } else if (priced) {
        doc.text(clean(formatQty(line)), cx.qty, top, { align: 'right' });
        doc.text(formatMoney(parseNumber(line.price)) + (line.unit === 'global' ? '' : ` / ${unitSingular(line.unit)}`), cx.price, top, { align: 'right' });
        font(10, 'bold');
        doc.text(formatMoney(lineTotal(line)), cx.sub, top, { align: 'right' });
      } else doc.text(clean(formatQty(line)), cx.sub, top, { align: 'right' });
      y += rowH;
      doc.setDrawColor(...LINE);
      doc.setLineWidth(0.3);
      doc.line(M, y, W - M, y);
    }
    ensure(9);
    if (priced) {
      font(9.5, 'normal', GRAPHITE);
      doc.text(`Subtotal ${KIND_LABEL[kind].toLowerCase()}`, cx.price - 30, y + 6, { align: 'right' });
      font(10.5, 'bold');
      doc.text(formatMoney(kind === 'mano' ? sum.labor : sum.materials), cx.sub, y + 6, { align: 'right' });
      if (kind === 'material' && sum.unpriced) {
        font(9, 'normal', MUTED);
        doc.text('Los materiales "a cotizar" se cotizan al momento de la compra, porque sus precios varían.', cx.sub, y + 12, { align: 'right' });
        y += 6;
      }
    } else {
      font(9, 'normal', MUTED);
      doc.text('Precios a cotizar al momento de la compra, porque varían según el proveedor.', cx.sub, y + 6, { align: 'right' });
    }
    y += 14;
  }
  y += 1;

  // ── Garantía (izquierda) y total (derecha) ──
  const breakdown: [string, string][] = sum.pct || sum.materials || sum.unpriced ? [
    ['Mano de obra', formatMoney(sum.labor)],
    ...(sum.pct ? [[`Descuento mano de obra (${String(sum.pct).replace('.', ',')}%)`, `- ${formatMoney(sum.discount)}`] as [string, string]] : []),
    ...(sum.materials ? [['Materiales', formatMoney(sum.materials)] as [string, string]] : []),
    ...(sum.unpriced ? [[sum.materials ? 'Otros materiales' : 'Materiales', 'A cotizar'] as [string, string]] : []),
  ] : [];
  const totalsH = 18 + breakdown.length * 6;
  ensure(Math.max(totalsH, 28) + 4);
  const tx = 116;
  let ty = y;
  font(9.5, 'normal', GRAPHITE);
  for (const [name, value] of breakdown) {
    doc.text(name, tx, ty + 5);
    doc.text(value, W - M - 4, ty + 5, { align: 'right' });
    ty += 6;
  }
  if (breakdown.length) ty += 3;
  doc.setFillColor(...INK);
  doc.roundedRect(tx - 4, ty, W - M - tx + 4, 15, 3, 3, 'F');
  label(sum.allUnpriced ? 'TOTAL MANO DE OBRA' : 'TOTAL', tx + 1, ty + 9.3, [255, 255, 255]);
  font(16, 'bold', [255, 255, 255]);
  doc.text(formatMoney(sum.total), W - M - 4, ty + 10, { align: 'right' });

  if (budget.warranty && budget.warranty !== 'Sin garantía') {
    doc.setDrawColor(...INK);
    doc.setLineWidth(0.6);
    doc.roundedRect(M, y, 88, 28, 3, 3, 'S');
    // Escudo simple con tilde
    const sx = M + 7;
    const sy = y + 7;
    doc.setFillColor(...INK);
    doc.lines([[12, 0], [0, 7], [-6, 7], [-6, -7]], sx, sy, [1, 1], 'F', true);
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.9);
    doc.lines([[2.4, 2.4], [4.6, -5]], sx + 3, sy + 6, [1, 1], 'S', false);
    label('TRABAJO CON GARANTÍA', M + 24, y + 9);
    font(17, 'bold');
    doc.text(clean(budget.warranty.toUpperCase()), M + 24, y + 17.5);
    font(8.5, 'normal', MUTED);
    doc.text('Por escrito, en papel y en formato digital.', M + 24, y + 23);
  }
  y += Math.max(totalsH, 28) + 10;

  // ── Detalle del trabajo y condiciones ──
  const section = (title: string, body: string[], bullets: boolean) => {
    font(9.5);
    const blocks = body.map(t => wrap(t, W - 2 * M - (bullets ? 5 : 0)));
    ensure(10 + Math.min(blocks[0]?.length ?? 0, 3) * 4.4);
    label(title, M, y);
    y += 6;
    for (const block of blocks) {
      for (const [i, text] of block.entries()) {
        ensure(4.6);
        font(9.5, 'normal', GRAPHITE);
        if (bullets && i === 0) {
          doc.setFillColor(...INK);
          doc.circle(M + 1, y - 1.2, 0.7, 'F');
        }
        doc.text(text, M + (bullets ? 5 : 0), y);
        y += 4.6;
      }
      y += bullets ? 0.8 : 1.5;
    }
    y += 5;
  };
  if (budget.work.trim()) section('DETALLE DEL TRABAJO', budget.work.split(/\n+/).filter(t => t.trim()), false);
  const conditions = [
    sum.allUnpriced
      ? 'Los materiales detallados no están incluidos en el total: se cotizan al momento de la compra, porque sus precios varían.'
      : sum.unpriced
      ? 'Los materiales "a cotizar" no están incluidos en el total: se cotizan al momento de la compra, porque sus precios varían.'
      : sum.materials ? 'Los materiales detallados están incluidos en el total.' : 'El presupuesto no incluye materiales: se cotizan aparte.',
    days > 0 ? `Presupuesto válido por ${days} días, hasta el ${formatDate(addDays(budget.date, days))}.` : '',
    budget.warranty && budget.warranty !== 'Sin garantía' ? `Garantía de ${budget.warranty} por escrito, según el sistema aplicado.` : '',
    ...budget.notes.split(/\n+/),
  ].filter(t => t.trim());
  section('CONDICIONES', conditions, true);

  // ── Aceptación del cliente ──
  // Entra en la página si la línea queda por encima del pie (línea en 280)
  if (y + 12 > 273) y = newPage() + 10;
  else y += 12;
  doc.setDrawColor(...GRAPHITE);
  doc.setLineWidth(0.3);
  doc.line(M, y, M + 78, y);
  doc.line(W - M - 60, y, W - M, y);
  font(8, 'normal', MUTED);
  doc.text('Firma y aclaración del cliente', M, y + 4.5);
  doc.text('Fecha de aceptación', W - M - 60, y + 4.5);

  // ── Pie en todas las páginas ──
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.3);
    doc.line(M, 280, W - M, 280);
    font(7.5, 'bold', INK);
    doc.text('AquaTech Solutions · Impermeabilizaciones que perduran', M, 285);
    font(7.5, 'normal', MUTED);
    doc.text(clean([issuer.web, issuer.phone && `WhatsApp ${issuer.phone}`, INSTAGRAM_HANDLE].filter(Boolean).join(' · ')), M, 289.5);
    doc.text(`Presupuesto N° ${number} · Página ${p} de ${pages}`, W - M, 285, { align: 'right' });
  }

  return doc.output('blob');
}
