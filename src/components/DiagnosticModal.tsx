import React, { useState } from 'react';
import { Camera, ImagePlus } from 'lucide-react';
import { WhatsAppIcon } from './Brand';
import { Modal, Select, waLink } from './ui';
import { track } from '../analytics';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROBLEMS = [
  'Gotera activa cuando llueve fuerte',
  'Manchas de humedad en cielorraso o paredes',
  'Membrana vieja levantada o con bolsas de agua',
  'Fisuras en losa o juntas de dilatación',
  'Humedad en zócalos y cimientos (salitre)',
  'Pérdida de agua en pileta o tanque',
];

const PROPERTIES = ['Casa', 'Dúplex o PH', 'Edificio / consorcio', 'Galpón / industria', 'Comercio / oficina'];

const fieldClass =
  'w-full h-12 px-4 rounded-2xl bg-paper ring-1 ring-line text-sm text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-ink';

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-2.5">{children}</span>
);

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose }) => {
  const [problem, setProblem] = useState(PROBLEMS[0]);
  const [property, setProperty] = useState(PROPERTIES[0]);
  const [place, setPlace] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola AquaTech! Quiero un diagnóstico por fotos:
- Problema: ${problem}
- Inmueble: ${property}
- Barrio o localidad: ${place || 'a confirmar'}
Ahora les mando las fotos.`;
    track('WhatsApp', { origen: 'Diagnóstico por fotos' });
    window.open(waLink(msg), '_blank', 'noopener');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg" label="Diagnóstico por fotos">
      <div className="p-7 sm:p-9">
        <div className="flex items-center gap-4 pb-6 mb-7 border-b border-line pr-10">
          <div className="w-12 h-12 rounded-2xl bg-ink text-white flex items-center justify-center shrink-0">
            <Camera size={22} strokeWidth={1.6} />
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold text-ink">Diagnóstico por fotos</h3>
            <p className="text-[13px] text-muted">Contanos el problema y te decimos qué conviene.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>¿Qué problema tenés?</Label>
            <div className="grid gap-2">
              {PROBLEMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProblem(p)}
                  className={`px-4 py-3 rounded-2xl text-[13.5px] text-left transition-colors ${
                    problem === p ? 'bg-ink text-white' : 'bg-paper ring-1 ring-line text-graphite hover:bg-mist'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label>
              <Label>Inmueble</Label>
              <Select value={property} onChange={(e) => setProperty(e.target.value)} options={PROPERTIES} />
            </label>
            <label>
              <Label>Barrio o localidad</Label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="Ej: Cerro, Villa Allende"
                className={fieldClass}
              />
            </label>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-paper ring-1 ring-line">
            <ImagePlus size={20} strokeWidth={1.7} className="text-ink shrink-0 mt-0.5" />
            <p className="text-[13px] text-graphite leading-relaxed">
              Al abrirse WhatsApp, adjuntá <strong className="text-ink">2 o 3 fotos</strong> del problema: una general y
              otras de cerca. Con eso te damos un primer diagnóstico.
            </p>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-ink text-white text-sm font-semibold hover:bg-graphite transition-colors"
          >
            <WhatsAppIcon size={18} /> Continuar en WhatsApp
          </button>
        </form>
      </div>
    </Modal>
  );
};
