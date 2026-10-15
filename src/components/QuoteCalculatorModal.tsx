import React, { useEffect, useState } from 'react';
import { Calculator } from 'lucide-react';
import { SERVICES, SECONDARY_SERVICE } from '../data/mockData';
import { WhatsAppIcon } from './Brand';
import { Modal, Select, waLink } from './ui';

interface QuoteCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

// Sin precios: no hay valores confirmados. El cotizador arma la consulta y el presupuesto llega por WhatsApp.
const JOB_TYPES = [...SERVICES.map((s) => s.title), SECONDARY_SERVICE.title];

const CONDITIONS = [
  'Gotera activa cuando llueve',
  'Humedad o manchas',
  'Membrana vieja rota o despegada',
  'Mantenimiento preventivo',
  'Obra nueva',
];

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-2.5">{children}</span>
);

export const QuoteCalculatorModal: React.FC<QuoteCalculatorModalProps> = ({ isOpen, onClose, initialService }) => {
  const [jobType, setJobType] = useState(JOB_TYPES[0]);
  const [area, setArea] = useState(80);
  const [condition, setCondition] = useState(CONDITIONS[0]);
  const [place, setPlace] = useState('');
  const [hasOldLayer, setHasOldLayer] = useState(false);

  // Al abrir desde una tarjeta de servicio, arranca con ese trabajo elegido
  useEffect(() => {
    if (isOpen) setJobType(initialService && JOB_TYPES.includes(initialService) ? initialService : JOB_TYPES[0]);
  }, [isOpen, initialService]);

  const message = `Hola AquaTech, quiero un presupuesto:
- Trabajo: ${jobType}
- Superficie aproximada: ${area} m²
- Estado: ${condition}
- Hay una membrana o capa vieja: ${hasOldLayer ? 'sí' : 'no'}
- Barrio o localidad: ${place.trim() || 'a confirmar'}
Ahora les mando fotos.`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} label="Cotizador">
      <div className="p-7 sm:p-9">
        <div className="flex items-center gap-4 pb-6 mb-7 border-b border-line pr-10">
          <div className="w-12 h-12 rounded-2xl bg-ink text-white flex items-center justify-center shrink-0">
            <Calculator size={22} strokeWidth={1.6} />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold text-ink">Pedí tu presupuesto</h3>
            <p className="text-[13px] text-muted">Completá estos datos y seguimos por WhatsApp.</p>
          </div>
        </div>

        <div className="space-y-7">
          <div>
            <Label>1 · Tipo de trabajo</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {JOB_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setJobType(type)}
                  className={`min-h-12 px-3.5 py-2.5 rounded-2xl text-[13px] font-medium text-left leading-snug transition-colors ${
                    jobType === type ? 'bg-ink text-white' : 'bg-paper ring-1 ring-line text-graphite hover:bg-mist'
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
              min="5"
              max="500"
              step="5"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full cursor-pointer"
              aria-label="Superficie en metros cuadrados"
            />
            <div className="flex justify-between text-[11px] text-muted mt-1.5">
              <span>5 m²</span>
              <span>500 m² o más</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label>
              <Label>3 · Estado actual</Label>
              <Select value={condition} onChange={(e) => setCondition(e.target.value)} options={CONDITIONS} />
            </label>
            <label>
              <Label>4 · Barrio o localidad</Label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Ej: Cerro, Jesús María"
                className="w-full h-12 px-4 rounded-2xl bg-paper ring-1 ring-line text-sm text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-ink"
              />
            </label>
          </div>

          <label className="flex items-center gap-3 p-4 rounded-2xl bg-paper ring-1 ring-line cursor-pointer">
            <input
              type="checkbox"
              checked={hasOldLayer}
              onChange={(e) => setHasOldLayer(e.target.checked)}
              className="w-4 h-4 accent-ink"
            />
            <span className="text-[13.5px] text-graphite">Hay una membrana o capa vieja colocada</span>
          </label>
        </div>

        <div className="mt-8 p-6 rounded-3xl bg-ink text-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-3">Tu consulta</div>
          <p className="text-[14px] leading-relaxed text-white/85 whitespace-pre-line">{message}</p>
        </div>
        <p className="mt-3 text-[12px] text-muted text-center">
          El presupuesto es sin cargo. Al abrirse WhatsApp, adjuntá 2 o 3 fotos del problema.
        </p>

        <a
          href={waLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-ink text-white text-sm font-semibold hover:bg-graphite transition-colors"
        >
          <WhatsAppIcon size={18} /> Enviar consulta por WhatsApp
        </a>
      </div>
    </Modal>
  );
};
