import React, { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';
import { WhatsAppIcon } from './Brand';
import { Modal, Select, waLink } from './ui';

interface QuoteCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

const SURFACES = [
  'Losa de hormigón plana',
  'Terraza transitable',
  'Techo de chapa / galpón',
  'Techo de tejas',
  'Cimientos (humedad ascendente)',
  'Tanque o pileta',
];

// Servicio de la sección "Servicios" → superficie del cotizador
const SURFACE_BY_SERVICE: Record<string, string> = {
  Techos: 'Losa de hormigón plana',
  'Terrazas y balcones': 'Terraza transitable',
  'Humedad de cimientos': 'Cimientos (humedad ascendente)',
  Filtraciones: 'Losa de hormigón plana',
  'Tanques y piletas': 'Tanque o pileta',
  'Mantenimiento preventivo': 'Losa de hormigón plana',
};

const ZONES = [
  'Córdoba Capital',
  'Villa Allende',
  'Mendiolaza',
  'Río Ceballos',
  'Villa Carlos Paz',
  'Malagueño',
  'La Calera',
  'Alta Gracia',
  'Otra localidad de Córdoba',
];

const CONDITIONS = [
  'Gotera activa cuando llueve',
  'Humedad y manchas en cielorraso',
  'Membrana vieja rota o despegada',
  'Mantenimiento preventivo',
  'Obra nueva',
];

const SYSTEMS: Record<string, { system: string; warranty: number; pricePerM2: number }> = {
  'Losa de hormigón plana': { system: 'Membrana asfáltica 4 mm con geotextil + poliuretano', warranty: 10, pricePerM2: 28000 },
  'Terraza transitable': { system: 'Membrana líquida poliuretánica transitable + sellado de juntas', warranty: 7, pricePerM2: 32000 },
  'Techo de chapa / galpón': { system: 'Sellado elastomérico térmico + tornillería con arandela EPDM', warranty: 7, pricePerM2: 22000 },
  'Techo de tejas': { system: 'Recolocación de tejas + mortero hidrófugo + hidrorrepelente', warranty: 5, pricePerM2: 26000 },
  'Cimientos (humedad ascendente)': { system: 'Barrera química por inyección de siloxanos', warranty: 10, pricePerM2: 38000 },
  'Tanque o pileta': { system: 'Mortero polimérico bicomponente apto agua potable', warranty: 7, pricePerM2: 34000 },
};

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-2.5">{children}</span>
);

export const QuoteCalculatorModal: React.FC<QuoteCalculatorModalProps> = ({ isOpen, onClose, initialService }) => {
  const [surfaceType, setSurfaceType] = useState(SURFACES[0]);
  const [area, setArea] = useState(85);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [zone, setZone] = useState(ZONES[0]);
  const [hasOldMembrane, setHasOldMembrane] = useState(true);

  // Al abrir desde una ficha de servicio, arranca con esa superficie elegida
  useEffect(() => {
    if (isOpen) setSurfaceType((initialService && SURFACE_BY_SERVICE[initialService]) || SURFACES[0]);
  }, [isOpen, initialService]);

  const { system, warranty, pricePerM2 } = SYSTEMS[surfaceType];
  const days = Math.max(2, Math.ceil(area / 45) + (hasOldMembrane ? 1 : 0));
  const removal = hasOldMembrane ? 1.12 : 1;
  const minTotal = Math.round((area * pricePerM2 * removal * 0.9) / 1000) * 1000;
  const maxTotal = Math.round((area * pricePerM2 * removal * 1.15) / 1000) * 1000;
  const money = (v: number) => '$' + v.toLocaleString('es-AR');

  const message = `Hola AquaTech! Usé el cotizador de la web:
- Superficie: ${surfaceType} (${area} m²)
- Estado: ${condition}
- Membrana vieja para retirar: ${hasOldMembrane ? 'sí' : 'no'}
- Zona: ${zone}
- Sistema sugerido: ${system}
Quisiera coordinar una visita para confirmar el presupuesto.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} label="Cotizador online">
      <div className="p-7 sm:p-9">
        <div className="flex items-center gap-4 pb-6 mb-7 border-b border-line pr-10">
          <div className="w-12 h-12 rounded-2xl bg-ink text-white flex items-center justify-center shrink-0">
            <Calculator size={22} strokeWidth={1.6} />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold text-ink">Cotizador online</h3>
            <p className="text-[13px] text-muted">Un valor orientativo en segundos, sin compromiso.</p>
          </div>
        </div>

        <div className="space-y-7">
          <div>
            <Label>1 · Tipo de superficie</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SURFACES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSurfaceType(type)}
                  className={`min-h-12 px-3.5 py-2.5 rounded-2xl text-[13px] font-medium text-left leading-snug transition-colors ${
                    surfaceType === type ? 'bg-ink text-white' : 'bg-paper ring-1 ring-line text-graphite hover:bg-mist'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between mb-3">
              <Label>2 · Superficie aproximada</Label>
              <span className="font-headline text-2xl font-bold text-ink leading-none">
                {area} <span className="text-base text-muted font-semibold">m²</span>
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="400"
              step="5"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full cursor-pointer"
              aria-label="Superficie en metros cuadrados"
            />
            <div className="flex justify-between text-[11px] text-muted mt-1.5">
              <span>15 m²</span>
              <span>Casa promedio · 80 m²</span>
              <span>400 m²</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label>
              <Label>3 · Estado actual</Label>
              <Select value={condition} onChange={(e) => setCondition(e.target.value)} options={CONDITIONS} />
            </label>
            <label>
              <Label>4 · Ubicación</Label>
              <Select value={zone} onChange={(e) => setZone(e.target.value)} options={ZONES} />
            </label>
          </div>

          <label className="flex items-center gap-3 p-4 rounded-2xl bg-paper ring-1 ring-line cursor-pointer">
            <input
              type="checkbox"
              checked={hasOldMembrane}
              onChange={(e) => setHasOldMembrane(e.target.checked)}
              className="w-4 h-4 accent-ink"
            />
            <span className="text-[13.5px] text-graphite">Hay una membrana vieja que hay que retirar</span>
          </label>
        </div>

        <div className="mt-8 p-6 rounded-3xl bg-ink text-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-2">Solución recomendada</div>
          <div className="font-headline text-lg font-semibold leading-snug">{system}</div>
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="text-[11px] text-white/50">Rango estimado</div>
            <div className="font-headline text-2xl sm:text-[28px] font-bold mt-1">
              {money(minTotal)} <span className="text-white/35 font-medium">a</span> {money(maxTotal)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <div className="text-[11px] text-white/50">Duración estimada</div>
              <div className="text-sm sm:text-base font-semibold mt-1">{days} jornadas</div>
            </div>
            <div>
              <div className="text-[11px] text-white/50">Garantía escrita</div>
              <div className="text-sm sm:text-base font-semibold mt-1">{warranty} años</div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-[12px] text-muted text-center">
          Valores orientativos con materiales y mano de obra. El precio final se confirma en la visita sin cargo.
        </p>

        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-ink text-white text-sm font-semibold hover:bg-graphite transition-colors"
        >
          <WhatsAppIcon size={18} /> Enviar esta cotización por WhatsApp
        </a>
      </div>
    </Modal>
  );
};
