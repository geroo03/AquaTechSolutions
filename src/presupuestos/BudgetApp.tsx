import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Building2, CircleUser, Cloud, CloudOff, Copy, Download, Eye, FileText, FolderOpen, History, LoaderCircle, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { LogoMark, WhatsAppIcon } from '../components/Brand';
import { Modal } from '../components/ui';
import {
  KIND_LABEL, PRESETS, STATUSES, STATUS_LABEL, UNITS, WARRANTY_OPTIONS, kindOf,
  exportBackup, fileName, formatDate, formatMoney, formatNumber, importBackup, lineTotal, unitSingular,
  newBudget, newLine, nextNumber, totals, waNumber,
  type Budget, type Issuer, type Kind, type Line, type Status, type Unit,
} from './model';
import { buildPdf, loadPdfKit, type PdfKit } from './pdf';
import { changePassword, deleteBudgetRemote, saveBudgetsRemote, saveIssuerRemote, signOut } from './cloud';

const field = 'mt-1.5 w-full rounded-2xl bg-paper ring-1 ring-line px-4 py-3 text-[15px] text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-ink';
const card = 'rounded-3xl bg-white ring-1 ring-line p-5 sm:p-7';
const labelText = 'text-sm font-medium text-ink';
const btnDark = 'inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white font-semibold hover:bg-graphite transition-colors disabled:opacity-50';
const btnLight = 'inline-flex items-center justify-center gap-2 rounded-full ring-1 ring-line bg-white text-ink font-semibold hover:bg-mist transition-colors disabled:opacity-50';

const WORK_PLACEHOLDER = 'Ej: Impermeabilizar techo y parapetos con venda y pintura poliuretánica color blanco.';

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

const hasContent = (b: Budget) =>
  Boolean(b.client.name.trim() || b.client.phone.trim() || b.client.address.trim() || b.work.trim() || b.notes.trim() ||
    b.lines.some(l => l.qty.trim() || l.detail.trim()));

type SaveState = 'ok' | 'saving' | 'error';

interface Props {
  email: string;
  initialBudgets: Budget[];
  initialIssuer: Issuer;
}

export default function BudgetApp({ email, initialBudgets, initialIssuer }: Props) {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [issuer, setIssuer] = useState<Issuer>(initialIssuer);
  const [budget, setBudget] = useState<Budget>(() => newBudget(nextNumber(initialBudgets)));
  const [kit, setKit] = useState<PdfKit | null>(null);
  const [kitError, setKitError] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [issuerOpen, setIssuerOpen] = useState(() => !initialIssuer.address || !initialIssuer.cuit);
  const [notice, setNotice] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('ok');
  const noticeTimer = useRef<number>(undefined);
  // Guardado en la nube con una pequeña espera: no se manda un pedido por cada tecla.
  const pending = useRef(new Map<string, Budget>());
  const pendingIssuer = useRef<Issuer | null>(null);
  const saveTimer = useRef<number>(undefined);

  useEffect(() => {
    loadPdfKit().then(setKit, () => setKitError(true));
  }, []);

  const flushSaves = async () => {
    window.clearTimeout(saveTimer.current);
    const budgetsToSave = [...pending.current.values()];
    const issuerToSave = pendingIssuer.current;
    if (!budgetsToSave.length && !issuerToSave) return;
    pending.current.clear();
    pendingIssuer.current = null;
    setSaveState('saving');
    try {
      await Promise.all([saveBudgetsRemote(budgetsToSave), issuerToSave && saveIssuerRemote(issuerToSave)]);
      setSaveState(pending.current.size || pendingIssuer.current ? 'saving' : 'ok');
    } catch {
      // Se vuelven a encolar (sin pisar cambios más nuevos) y se reintenta.
      budgetsToSave.forEach(b => { if (!pending.current.has(b.id)) pending.current.set(b.id, b); });
      if (issuerToSave && !pendingIssuer.current) pendingIssuer.current = issuerToSave;
      setSaveState('error');
      saveTimer.current = window.setTimeout(flushSaves, 8000);
    }
  };
  const queueSave = (items: Budget[], nextIssuer?: Issuer) => {
    items.forEach(b => pending.current.set(b.id, b));
    if (nextIssuer) pendingIssuer.current = nextIssuer;
    setSaveState(state => (state === 'error' ? 'error' : 'saving'));
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(flushSaves, 700);
  };

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (pending.current.size || pendingIssuer.current) e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);

  const flash = (text: string) => {
    setNotice(text);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 5000);
  };

  /** Guarda en el historial apenas tiene algún dato cargado. */
  const commit = (next: Budget) => {
    const stamped = { ...next, updatedAt: Date.now() };
    setBudget(stamped);
    if (!hasContent(stamped) && !budgets.some(b => b.id === stamped.id)) return;
    const list = budgets.some(b => b.id === stamped.id) ? budgets.map(b => (b.id === stamped.id ? stamped : b)) : [stamped, ...budgets];
    setBudgets(list);
    queueSave([stamped]);
  };
  const set = <K extends keyof Budget>(key: K, value: Budget[K]) => commit({ ...budget, [key]: value });
  const setClient = (key: keyof Budget['client'], value: string) => commit({ ...budget, client: { ...budget.client, [key]: value } });
  const setLine = (id: string, patch: Partial<Line>) => commit({ ...budget, lines: budget.lines.map(l => (l.id === id ? { ...l, ...patch } : l)) });
  const updateIssuer = (key: keyof Issuer, value: string) => {
    const next = { ...issuer, [key]: value };
    setIssuer(next);
    queueSave([], next);
  };

  const sum = useMemo(() => totals(budget), [budget]);
  const missingIssuer = !issuer.address.trim() || !issuer.cuit.trim();

  const makePdf = () => (kit ? buildPdf(kit, budget, issuer) : null);

  const onDownload = () => {
    const blob = makePdf();
    if (blob) download(blob, fileName(budget));
  };
  const onPreview = () => {
    const blob = makePdf();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    if (!window.open(url, '_blank')) download(blob, fileName(budget));
    setTimeout(() => URL.revokeObjectURL(url), 120_000);
  };
  const onSend = async () => {
    const blob = makePdf();
    if (!blob) return;
    const first = budget.client.name.trim().split(/\s+/)[0];
    const text = `Hola${first ? ` ${first}` : ''}, ¿cómo estás? Te paso el presupuesto N° ${formatNumber(budget.number)} de AquaTech Solutions por ${formatMoney(sum.total)}. Cualquier consulta, avisame.`;
    const file = new File([blob], fileName(budget), { type: 'application/pdf' });
    const mobile = window.matchMedia('(pointer: coarse)').matches;
    if (mobile && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text });
        commit({ ...budget, status: budget.status === 'borrador' ? 'enviado' : budget.status });
      } catch { /* compartir cancelado */ }
      return;
    }
    // Compu: se descarga el PDF y se abre el chat con el mensaje; el PDF se adjunta a mano.
    download(blob, fileName(budget));
    const number = waNumber(budget.client.phone);
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    commit({ ...budget, status: budget.status === 'borrador' ? 'enviado' : budget.status });
    flash(number ? 'Se descargó el PDF: adjuntalo en el chat que se abrió.' : 'Se descargó el PDF. El teléfono del cliente no es un celular válido: elegí el contacto en WhatsApp y adjuntalo.');
  };

  const startNew = () => {
    setBudget(newBudget(nextNumber(budgets)));
    setHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const open = (b: Budget) => {
    setBudget(b);
    setHistoryOpen(false);
    window.scrollTo({ top: 0 });
  };
  const duplicate = (b: Budget) => {
    const copy: Budget = { ...structuredClone(b), id: newBudget(0).id, number: nextNumber(budgets), date: newBudget(0).date, status: 'borrador', updatedAt: Date.now() };
    setBudgets([copy, ...budgets]);
    queueSave([copy]);
    open(copy);
    flash(`Copia creada: presupuesto N° ${formatNumber(copy.number)}.`);
  };
  const remove = (b: Budget) => {
    if (!window.confirm(`¿Borrar el presupuesto N° ${formatNumber(b.number)}${b.client.name ? ` de ${b.client.name}` : ''}? No se puede deshacer.`)) return;
    const list = budgets.filter(x => x.id !== b.id);
    setBudgets(list);
    pending.current.delete(b.id);
    if (budget.id === b.id) setBudget(newBudget(nextNumber(list)));
    deleteBudgetRemote(b.id).catch(() => {
      setBudgets(current => (current.some(x => x.id === b.id) ? current : [b, ...current]));
      flash('No se pudo borrar: revisá la conexión e intentá de nuevo.');
    });
  };
  const setStatus = (b: Budget, status: Status) => {
    const changed = { ...b, status, updatedAt: Date.now() };
    setBudgets(budgets.map(x => (x.id === b.id ? changed : x)));
    queueSave([changed]);
    if (budget.id === b.id) setBudget(changed);
  };

  const onExport = () => download(new Blob([exportBackup(budgets, issuer)], { type: 'application/json' }), `presupuestos-aquatech-${newBudget(0).date}.json`);
  const onImport = async (file: File) => {
    try {
      const data = importBackup(await file.text());
      const ids = new Set(data.budgets.map(b => b.id));
      const list = [...data.budgets, ...budgets.filter(b => !ids.has(b.id))].sort((a, b) => b.updatedAt - a.updatedAt);
      setBudgets(list);
      let merged: Issuer | undefined;
      if (data.issuer && (!issuer.address || !issuer.cuit)) {
        merged = { ...issuer, ...data.issuer };
        setIssuer(merged);
      }
      queueSave(data.budgets, merged);
      flash(`Se importaron ${data.budgets.length} presupuestos.`);
    } catch (error) {
      flash(error instanceof Error ? error.message : 'No se pudo leer el archivo.');
    }
  };

  const ready = Boolean(kit);

  return (
    <div className="min-h-screen pb-28 lg:pb-12">
      <header className="sticky top-0 z-40 bg-ink text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <LogoMark size={26} />
            <div className="leading-tight min-w-0">
              <p className="font-headline text-[15px] font-bold tracking-[0.04em]">AQUATECH</p>
              <p className="text-[11px] text-white/70 truncate">Panel de presupuestos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setHistoryOpen(true)} className="inline-flex items-center gap-2 h-10 px-4 rounded-full ring-1 ring-white/25 text-sm font-semibold hover:bg-white/10">
              <History size={16} aria-hidden="true" /> <span className="max-sm:sr-only">Historial</span> <span className="text-white/70">({budgets.length})</span>
            </button>
            <button type="button" onClick={startNew} className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white text-ink text-sm font-semibold hover:bg-mist">
              <Plus size={16} aria-hidden="true" /> <span className="max-sm:sr-only">Nuevo</span>
            </button>
            <button type="button" onClick={() => setAccountOpen(true)} className="w-10 h-10 rounded-full ring-1 ring-white/25 flex items-center justify-center hover:bg-white/10" aria-label="Cuenta">
              <CircleUser size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 grid lg:grid-cols-[1fr_340px] gap-5 lg:gap-8 items-start">
        <h1 className="sr-only">Panel de presupuestos de AquaTech</h1>
        <div className="space-y-5 min-w-0">
          {/* Presupuesto */}
          <section className={card} aria-labelledby="t-presupuesto">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-5">
              <h2 id="t-presupuesto" className="font-headline text-xl font-bold">Presupuesto N° {formatNumber(budget.number)}</h2>
              <SaveBadge state={saveState} saved={budgets.some(b => b.id === budget.id)} onRetry={flushSaves} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <label className={labelText}>Número
                <input type="number" min={1} value={budget.number} onChange={e => set('number', Math.max(1, Math.floor(Number(e.target.value)) || 1))} className={field} />
              </label>
              <label className={labelText}>Fecha
                <input type="date" value={budget.date} onChange={e => set('date', e.target.value)} className={field} />
              </label>
              <label className={`${labelText} col-span-2 sm:col-span-1`}>Estado
                <select value={budget.status} onChange={e => set('status', e.target.value as Status)} className={field}>
                  {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </label>
            </div>
          </section>

          {/* Cliente */}
          <section className={card} aria-labelledby="t-cliente">
            <h2 id="t-cliente" className="font-headline text-xl font-bold mb-5">Cliente</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className={`${labelText} sm:col-span-2`}>Nombre y apellido
                <input value={budget.client.name} onChange={e => setClient('name', e.target.value)} maxLength={120} autoComplete="off" placeholder="Ej: Juan Pérez o Administración Colomer" className={field} />
              </label>
              <label className={labelText}>Teléfono (WhatsApp)
                <input value={budget.client.phone} onChange={e => setClient('phone', e.target.value)} maxLength={30} inputMode="tel" autoComplete="off" placeholder="Ej: 351 612-3456" className={field} />
              </label>
              <label className={labelText}>Dirección o barrio
                <input value={budget.client.address} onChange={e => setClient('address', e.target.value)} maxLength={160} autoComplete="off" placeholder="Ej: Barrio Colón 2" className={field} />
              </label>
            </div>
          </section>

          {(['mano', 'material'] as Kind[]).map(kind => (
            <LinesSection key={kind} kind={kind} lines={budget.lines.filter(l => kindOf(l) === kind)}
              onChange={setLine}
              onAdd={() => commit({ ...budget, lines: [...budget.lines, newLine({ kind, unit: kind === 'mano' ? 'm²' : 'u' })] })}
              onRemove={id => commit({ ...budget, lines: budget.lines.filter(l => l.id !== id) })} />
          ))}

          {/* Detalle y condiciones */}
          <section className={card} aria-labelledby="t-condiciones">
            <h2 id="t-condiciones" className="font-headline text-xl font-bold mb-5">Detalle y condiciones</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className={`${labelText} sm:col-span-2`}>En qué consiste el trabajo
                <textarea value={budget.work} onChange={e => set('work', e.target.value)} rows={3} maxLength={1500} placeholder={WORK_PLACEHOLDER} className={`${field} resize-y`} />
              </label>
              <label className={labelText}>Garantía
                <select value={budget.warranty} onChange={e => set('warranty', e.target.value)} className={field}>
                  {WARRANTY_OPTIONS.map(w => <option key={w}>{w}</option>)}
                </select>
              </label>
              <label className={labelText}>Validez (días)
                <input value={budget.validityDays} onChange={e => set('validityDays', e.target.value)} inputMode="numeric" maxLength={3} className={field} />
              </label>
              <label className={`${labelText} sm:col-span-2`}>Descuento sobre la mano de obra (%) <span className="text-muted font-normal">(opcional)</span>
                <input value={budget.discount} onChange={e => set('discount', e.target.value)} inputMode="decimal" maxLength={5} placeholder="0" className={`${field} sm:max-w-[calc(50%-8px)]`} />
              </label>
              <label className={`${labelText} sm:col-span-2`}>Otras condiciones <span className="text-muted font-normal">(una por renglón, opcional)</span>
                <textarea value={budget.notes} onChange={e => set('notes', e.target.value)} rows={2} maxLength={1500} placeholder="Ej: Se puede pagar en cuotas con Mercado Pago." className={`${field} resize-y`} />
              </label>
            </div>
          </section>
        </div>

        {/* Resumen y acciones */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          <section className="rounded-3xl bg-ink text-white p-6 sm:p-7" aria-labelledby="t-resumen">
            <h2 id="t-resumen" className="text-xs font-semibold tracking-[0.3em] text-white/70">TOTAL</h2>
            <p className="mt-2 font-headline text-4xl font-bold tracking-tight break-words" data-total>{formatMoney(sum.total)}</p>
            {(sum.pct > 0 || sum.materials > 0) && (
              <dl className="mt-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm text-white/70">
                <dt>Mano de obra</dt><dd className="text-right">{formatMoney(sum.labor)}</dd>
                {sum.pct > 0 && <><dt>Descuento ({String(sum.pct).replace('.', ',')}%)</dt><dd className="text-right">- {formatMoney(sum.discount)}</dd></>}
                {sum.materials > 0 && <><dt>Materiales</dt><dd className="text-right">{formatMoney(sum.materials)}</dd></>}
              </dl>
            )}
            <p className="mt-3 text-sm text-white/70">{budget.client.name.trim() || 'Sin cliente'} · {formatDate(budget.date)}</p>
            <div className="mt-6 grid gap-2.5 max-lg:hidden">
              <button type="button" onClick={onSend} disabled={!ready} className="inline-flex items-center justify-center gap-2 h-12 rounded-full bg-white text-ink font-semibold hover:bg-mist disabled:opacity-50">
                <WhatsAppIcon size={18} /> Enviar por WhatsApp
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                <button type="button" onClick={onDownload} disabled={!ready} className="inline-flex items-center justify-center gap-2 h-11 rounded-full ring-1 ring-white/30 text-sm font-semibold hover:bg-white/10 disabled:opacity-50">
                  <Download size={16} aria-hidden="true" /> PDF
                </button>
                <button type="button" onClick={onPreview} disabled={!ready} className="inline-flex items-center justify-center gap-2 h-11 rounded-full ring-1 ring-white/30 text-sm font-semibold hover:bg-white/10 disabled:opacity-50">
                  <Eye size={16} aria-hidden="true" /> Ver
                </button>
              </div>
            </div>
            {kitError && <p className="mt-4 text-sm text-white/80">No se pudo cargar el generador de PDF. Revisá la conexión y recargá la página.</p>}
          </section>

          <section className={card} aria-labelledby="t-negocio">
            <button type="button" onClick={() => setIssuerOpen(!issuerOpen)} aria-expanded={issuerOpen} aria-controls="datos-negocio" className="w-full flex items-center justify-between gap-3 text-left">
              <h2 id="t-negocio" className="flex items-center gap-2.5 font-headline text-lg font-bold"><Building2 size={18} aria-hidden="true" /> Datos del negocio</h2>
              <span className="text-sm text-muted">{issuerOpen ? 'Ocultar' : 'Editar'}</span>
            </button>
            {missingIssuer && <p className="mt-3 text-sm text-graphite">Completá la dirección y el CUIT una vez: salen en el PDF.</p>}
            {issuerOpen && (
              <div id="datos-negocio" className="mt-4 grid gap-3.5">
                <label className={labelText}>Dirección
                  <input value={issuer.address} onChange={e => updateIssuer('address', e.target.value)} maxLength={120} placeholder="Calle y número, ciudad" className={field} />
                </label>
                <label className={labelText}>CUIT
                  <input value={issuer.cuit} onChange={e => updateIssuer('cuit', e.target.value)} maxLength={20} inputMode="numeric" placeholder="20-00000000-0" className={field} />
                </label>
                <label className={labelText}>Teléfono
                  <input value={issuer.phone} onChange={e => updateIssuer('phone', e.target.value)} maxLength={30} className={field} />
                </label>
                <label className={labelText}>Email
                  <input value={issuer.email} onChange={e => updateIssuer('email', e.target.value)} maxLength={80} className={field} />
                </label>
                <label className={labelText}>Web
                  <input value={issuer.web} onChange={e => updateIssuer('web', e.target.value)} maxLength={80} className={field} />
                </label>
                <p className="text-xs text-muted leading-relaxed">Se guardan en tu cuenta y salen en el PDF. No se publican en la web.</p>
              </div>
            )}
          </section>
        </aside>
      </main>

      {/* Barra fija en el celular */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-line px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="max-w-6xl mx-auto flex items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-muted">TOTAL</p>
            <p className="font-headline text-lg font-bold truncate">{formatMoney(sum.total)}</p>
          </div>
          <button type="button" onClick={onPreview} disabled={!ready} className={`${btnLight} w-11 h-11`} aria-label="Ver PDF">
            <Eye size={18} aria-hidden="true" />
          </button>
          <button type="button" onClick={onDownload} disabled={!ready} className={`${btnLight} w-11 h-11`} aria-label="Descargar PDF">
            <Download size={18} aria-hidden="true" />
          </button>
          <button type="button" onClick={onSend} disabled={!ready} className={`${btnDark} h-11 px-4 text-sm`}>
            <WhatsAppIcon size={17} /> Enviar
          </button>
        </div>
      </div>

      {notice && (
        <div role="status" className="fixed z-50 left-1/2 -translate-x-1/2 bottom-24 lg:bottom-8 w-[calc(100%-32px)] max-w-md rounded-2xl bg-ink text-white text-sm px-5 py-4 shadow-2xl animate-pop-in flex items-start gap-3">
          <span className="flex-1">{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Cerrar aviso" className="text-white/70 hover:text-white"><X size={16} /></button>
        </div>
      )}

      <Modal isOpen={accountOpen} onClose={() => setAccountOpen(false)} label="Cuenta" maxWidth="max-w-md">
        <AccountPanel email={email} onSignOut={async () => { await flushSaves(); await signOut(); }} />
      </Modal>

      <Modal isOpen={historyOpen} onClose={() => setHistoryOpen(false)} label="Historial de presupuestos" maxWidth="max-w-3xl">
        <HistoryPanel budgets={budgets} currentId={budget.id} onOpen={open} onDuplicate={duplicate} onRemove={remove} onStatus={setStatus}
          onNew={startNew} onExport={onExport} onImport={onImport} />
      </Modal>
    </div>
  );
}

interface HistoryProps {
  budgets: Budget[];
  currentId: string;
  onOpen: (b: Budget) => void;
  onDuplicate: (b: Budget) => void;
  onRemove: (b: Budget) => void;
  onStatus: (b: Budget, s: Status) => void;
  onNew: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

function HistoryPanel({ budgets, currentId, onOpen, onDuplicate, onRemove, onStatus, onNew, onExport, onImport }: HistoryProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Status | 'todos'>('todos');
  const fileInput = useRef<HTMLInputElement>(null);
  const q = query.trim().toLowerCase();
  const list = budgets
    .filter(b => filter === 'todos' || b.status === filter)
    .filter(b => !q || `${b.client.name} ${b.client.address} ${b.client.phone} ${formatNumber(b.number)}`.toLowerCase().includes(q))
    .sort((a, b) => b.number - a.number);
  const accepted = budgets.filter(b => b.status === 'aceptado').reduce((s, b) => s + totals(b).total, 0);

  return (
    <div className="p-5 sm:p-8">
      <h2 className="font-headline text-2xl font-bold pr-10">Historial</h2>
      <p className="mt-1 text-sm text-muted">
        {budgets.length === 1 ? '1 presupuesto guardado' : `${budgets.length} presupuestos guardados`}
        {accepted > 0 && <> · aceptados por {formatMoney(accepted)}</>}
      </p>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <label className="relative flex-1">
          <span className="sr-only">Buscar</span>
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por cliente, barrio o número" className="w-full rounded-full bg-paper ring-1 ring-line pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ink" />
        </label>
        <label>
          <span className="sr-only">Filtrar por estado</span>
          <select value={filter} onChange={e => setFilter(e.target.value as Status | 'todos')} className="w-full sm:w-auto rounded-full bg-paper ring-1 ring-line px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ink">
            <option value="todos">Todos los estados</option>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </label>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-paper p-8 text-center">
          <FileText size={28} className="mx-auto text-muted" aria-hidden="true" />
          <p className="mt-3 text-sm text-graphite">{budgets.length ? 'No hay presupuestos con ese filtro.' : 'Todavía no hay presupuestos. Se guardan solos apenas cargás un dato.'}</p>
          <button type="button" onClick={onNew} className={`${btnDark} mt-4 h-10 px-5 text-sm`}><Plus size={15} aria-hidden="true" /> Nuevo presupuesto</button>
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {list.map(b => (
            <li key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <button type="button" onClick={() => onOpen(b)} className="flex-1 min-w-0 text-left group">
                <p className="text-xs font-semibold tracking-[0.15em] text-muted">N° {formatNumber(b.number)} · {formatDate(b.date)}{b.id === currentId ? ' · ABIERTO' : ''}</p>
                <p className="mt-0.5 font-semibold text-ink truncate group-hover:underline">{b.client.name || 'Sin cliente'}{b.client.address && <span className="font-normal text-muted"> · {b.client.address}</span>}</p>
                <p className="text-sm text-graphite">{formatMoney(totals(b).total)}</p>
              </button>
              <div className="flex items-center gap-2">
                <label>
                  <span className="sr-only">Estado del presupuesto {formatNumber(b.number)}</span>
                  <select value={b.status} onChange={e => onStatus(b, e.target.value as Status)} className="rounded-full bg-paper ring-1 ring-line px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ink">
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                  </select>
                </label>
                <button type="button" onClick={() => onOpen(b)} className="w-9 h-9 rounded-full bg-mist hover:bg-line flex items-center justify-center" aria-label={`Abrir el presupuesto ${formatNumber(b.number)}`}><FolderOpen size={16} /></button>
                <button type="button" onClick={() => onDuplicate(b)} className="w-9 h-9 rounded-full bg-mist hover:bg-line flex items-center justify-center" aria-label={`Duplicar el presupuesto ${formatNumber(b.number)}`}><Copy size={16} /></button>
                <button type="button" onClick={() => onRemove(b)} className="w-9 h-9 rounded-full bg-mist hover:bg-line flex items-center justify-center" aria-label={`Borrar el presupuesto ${formatNumber(b.number)}`}><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 rounded-2xl bg-paper p-4 sm:p-5">
        <p className="text-sm text-graphite">Los presupuestos se guardan en tu cuenta y los ves desde cualquier dispositivo. Si querés un respaldo aparte, exportá una copia.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={onExport} disabled={!budgets.length} className={`${btnLight} h-10 px-4 text-sm`}><Download size={15} aria-hidden="true" /> Exportar copia</button>
          <button type="button" onClick={() => fileInput.current?.click()} className={`${btnLight} h-10 px-4 text-sm`}><Upload size={15} aria-hidden="true" /> Importar copia</button>
          <input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = ''; }} />
        </div>
      </div>
    </div>
  );
}

function SaveBadge({ state, saved, onRetry }: { state: SaveState; saved: boolean; onRetry: () => void }) {
  if (state === 'error') {
    return (
      <button type="button" onClick={onRetry} className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink underline underline-offset-2">
        <CloudOff size={14} aria-hidden="true" /> Sin conexión: reintentar
      </button>
    );
  }
  if (state === 'saving') return <span className="inline-flex items-center gap-1.5 text-xs text-muted"><LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> Guardando…</span>;
  return <span className="inline-flex items-center gap-1.5 text-xs text-muted"><Cloud size={14} aria-hidden="true" /> {saved ? 'Guardado en la nube' : 'Se guarda al cargar un dato'}</span>;
}

function AccountPanel({ email, onSignOut }: { email: string; onSignOut: () => Promise<void> }) {
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setMessage('Usá al menos 8 caracteres.');
    if (password !== repeat) return setMessage('Las contraseñas no coinciden.');
    setBusy(true);
    const error = await changePassword(password);
    setBusy(false);
    setMessage(error ?? 'Listo: la contraseña nueva ya funciona.');
    if (!error) { setPassword(''); setRepeat(''); }
  };
  return (
    <div className="p-6 sm:p-8">
      <h2 className="font-headline text-2xl font-bold pr-10">Cuenta</h2>
      <p className="mt-1 text-sm text-muted break-all">{email}</p>
      <form onSubmit={submit} className="mt-6 grid gap-3.5">
        <h3 className="font-headline text-base font-bold">Cambiar contraseña</h3>
        <label className={labelText}>Contraseña nueva
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" className={field} />
        </label>
        <label className={labelText}>Repetila
          <input type="password" value={repeat} onChange={e => setRepeat(e.target.value)} autoComplete="new-password" className={field} />
        </label>
        {message && <p role="status" className="text-sm text-graphite">{message}</p>}
        <button type="submit" disabled={busy} className={`${btnDark} h-11 px-5 text-sm`}>Guardar contraseña</button>
      </form>
      <button type="button" onClick={onSignOut} className={`${btnLight} mt-6 w-full h-11 text-sm`}>Cerrar sesión</button>
    </div>
  );
}

interface LinesProps {
  kind: Kind;
  lines: Line[];
  onChange: (id: string, patch: Partial<Line>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

/** Una sección del presupuesto: mano de obra o materiales, con su subtotal. */
function LinesSection({ kind, lines, onChange, onAdd, onRemove }: LinesProps) {
  const labor = kind === 'mano';
  const title = KIND_LABEL[kind];
  const listId = `frecuentes-${kind}`;
  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const item = labor ? 'trabajo' : 'material';
  return (
    <section className={card} aria-labelledby={`t-${kind}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 id={`t-${kind}`} className="font-headline text-xl font-bold">{title}</h2>
        <p className="text-sm text-graphite">Subtotal: <strong className="text-ink" data-subtotal={kind}>{formatMoney(subtotal)}</strong></p>
      </div>
      <p className="mt-1 text-sm text-muted">
        {labor ? 'Cantidad por precio unitario. En "global" va el precio total del trabajo.' : 'Si el cliente compra los materiales, dejá esta sección vacía: el PDF dice que no están incluidos.'}
      </p>
      <datalist id={listId}>
        {PRESETS[kind].map(p => <option key={p.description} value={p.description} />)}
      </datalist>
      {lines.length > 0 && (
        <ol className="mt-5 space-y-4">
          {lines.map((line, i) => (
            <li key={line.id} className="rounded-2xl ring-1 ring-line p-4">
              <div className="flex items-start gap-3">
                <span className="max-sm:hidden mt-[38px] w-6 h-6 shrink-0 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">{i + 1}</span>
                <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-[1fr_96px_112px_132px] gap-3">
                  <label className={`${labelText} col-span-2 sm:col-span-4`}>Descripción
                    <input value={line.description} onChange={e => {
                      const preset = PRESETS[kind].find(p => p.description === e.target.value);
                      onChange(line.id, preset ? { description: preset.description, unit: preset.unit, price: line.price || preset.price } : { description: e.target.value });
                    }} list={listId} maxLength={140} placeholder={labor ? 'Elegí un trabajo frecuente o escribilo' : 'Elegí un material frecuente o escribilo'} className={field} />
                  </label>
                  <label className={`${labelText} col-span-2 sm:col-span-4`}>Detalle <span className="text-muted font-normal">(opcional)</span>
                    <input value={line.detail} onChange={e => onChange(line.id, { detail: e.target.value })} maxLength={240} placeholder={labor ? 'Ej: techo y parapetos, con venda' : 'Ej: rollos de 10 m², color blanco'} className={field} />
                  </label>
                  <label className={labelText}>Cantidad
                    <input value={line.qty} onChange={e => onChange(line.id, { qty: e.target.value })} inputMode="decimal" maxLength={12} placeholder={line.unit === 'global' ? '1' : '0'} className={field} />
                  </label>
                  <label className={labelText}>Unidad
                    <select value={line.unit} onChange={e => onChange(line.id, { unit: e.target.value as Unit })} className={field}>
                      {UNITS[kind].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </label>
                  <label className={`${labelText} col-span-2 sm:col-span-2`}>Precio {line.unit === 'global' ? 'total' : `por ${unitSingular(line.unit)}`}
                    <span className="relative block">
                      <span className="absolute left-4 top-[calc(50%+3px)] -translate-y-1/2 text-muted" aria-hidden="true">$</span>
                      <input value={line.price} onChange={e => onChange(line.id, { price: e.target.value })} inputMode="decimal" maxLength={16} placeholder="0" className={`${field} pl-8`} />
                    </span>
                  </label>
                </div>
              </div>
              <div className="mt-3 sm:pl-9 flex items-center justify-between gap-3">
                <p className="text-sm text-graphite">Subtotal: <strong className="text-ink">{formatMoney(lineTotal(line))}</strong></p>
                <button type="button" onClick={() => onRemove(line.id)} disabled={labor && lines.length === 1}
                  className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink disabled:invisible" aria-label={`Quitar ${item} ${i + 1}`}>
                  <Trash2 size={15} aria-hidden="true" /> Quitar
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
      <button type="button" onClick={onAdd} className={`${btnLight} mt-4 h-11 px-5 text-sm`}>
        <Plus size={16} aria-hidden="true" /> Agregar {item}
      </button>
    </section>
  );
}
