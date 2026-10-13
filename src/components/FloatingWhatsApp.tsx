import React, { useEffect, useRef, useState } from 'react';
import { CloudRain, Ruler, Building2, Camera, X, ArrowUpRight } from 'lucide-react';
import { WhatsAppIcon } from './Brand';
import { waLink } from './ui';

const QUICK_MESSAGES = [
  { icon: CloudRain, label: 'Gotera urgente', text: 'URGENTE: tengo una gotera activa en este momento, necesito presupuesto.' },
  { icon: Ruler, label: 'Presupuesto de techo o losa', text: 'Hola AquaTech, quiero un presupuesto para impermeabilizar mi techo.' },
  { icon: Building2, label: 'Consorcios y edificios', text: 'Hola AquaTech, escribo desde la administración de un consorcio para relevar una terraza común.' },
  { icon: Camera, label: 'Mandar fotos para diagnóstico', text: 'Hola AquaTech, quiero mandarles fotos de mi techo para que me digan qué solución recomiendan.' },
];

export const FloatingWhatsApp: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cierra el panel al tocar afuera o con Esc
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(320px,calc(100vw-40px))] bg-white rounded-3xl shadow-[0_30px_60px_-20px_rgba(11,11,12,0.45)] ring-1 ring-line overflow-hidden animate-pop-in">
          <div className="flex items-center justify-between px-5 py-4 bg-ink text-white">
            <div className="flex items-center gap-2.5">
              <WhatsAppIcon size={18} />
              <span className="text-sm font-semibold">Escribinos por WhatsApp</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Cerrar" className="text-white/60 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="p-3">
            <p className="px-2 pt-1 pb-3 text-[12.5px] text-muted">Elegí un tema para empezar la conversación:</p>
            {QUICK_MESSAGES.map(({ icon: Icon, label, text }) => (
              <a
                key={label}
                href={waLink(text)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-paper transition-colors"
              >
                <span className="w-9 h-9 rounded-xl bg-mist text-ink flex items-center justify-center shrink-0 group-hover:bg-ink group-hover:text-white transition-colors">
                  <Icon size={17} strokeWidth={1.8} />
                </span>
                <span className="flex-1 text-[13.5px] font-medium text-ink">{label}</span>
                <ArrowUpRight size={15} className="text-muted group-hover:text-ink" />
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Abrir opciones de WhatsApp"
        aria-expanded={open}
        className="w-14 h-14 rounded-full bg-ink text-white flex items-center justify-center ring-4 ring-white shadow-[0_16px_32px_-10px_rgba(11,11,12,0.6)] hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <X size={24} /> : <WhatsAppIcon size={26} />}
      </button>
    </div>
  );
};
