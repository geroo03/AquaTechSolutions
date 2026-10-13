import React, { useState } from 'react';
import { PHONE_NUMBER, PHONE_DISPLAY } from '../data/mockData';

export const FloatingWhatsApp: React.FC = () => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const quickMessages = [
    { label: '💧 Gotera urgente por lluvia', text: 'URGENCIA: Tengo una gotera activa en este momento, necesito presupuesto urgente.' },
    { label: '📐 Presupuesto para techo/losa', text: 'Hola AquaTech, quiero pedir un presupuesto para impermeabilizar mi losa de techo.' },
    { label: '🏢 Consorcios y Edificios', text: 'Hola AquaTech, consulto desde la administración de un consorcio para relevar una terraza común.' },
    { label: '📸 Mandar fotos para diagnóstico', text: 'Hola AquaTech, les escribo para mandar fotos de mi techo y consultar qué solución recomiendan.' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Quick message selector popover */}
      {popoverOpen && (
        <div className="bg-white rounded-2xl p-4 shadow-2xl border border-[#cbd5e1] max-w-xs w-72 mb-2 animate-fade-in text-[#191c1e]">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#eceef0]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
              <span className="font-['Montserrat',sans-serif] text-xs font-bold text-[#00263f]">
                AquaTech WhatsApp Directo
              </span>
            </div>
            <button
              onClick={() => setPopoverOpen(false)}
              className="text-[#72777e] hover:text-[#00263f] text-sm"
              aria-label="Cerrar opciones rápidas"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-[#42474e] mb-3">
            Elegí cómo querés iniciar la conversación o escribinos libremente:
          </p>

          <div className="space-y-1.5">
            {quickMessages.map((qm, idx) => (
              <a
                key={idx}
                href={`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(qm.text)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setPopoverOpen(false)}
                className="block text-left text-xs p-2 rounded-lg bg-[#f7f9fb] hover:bg-[#e0f2fe] text-[#00263f] font-semibold border border-[#e2e8f0] transition-colors"
              >
                {qm.label}
              </a>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-[#eceef0] text-[10px] text-center text-[#72777e]">
            Atención diaria · Córdoba y Gran Córdoba
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-3 group">
        <div className="hidden sm:flex bg-[#00263f] text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none items-center gap-1.5">
          <span>Escribinos por WhatsApp</span>
          <span className="w-2 h-2 rounded-full bg-[#25D366]" />
        </div>

        <button
          type="button"
          onClick={() => setPopoverOpen(!popoverOpen)}
          aria-label="Opciones de WhatsApp AquaTech"
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white flex items-center justify-center shadow-[0_12px_24px_rgba(37,211,102,0.35)] hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[30px] text-white">chat</span>
        </button>
      </div>
    </div>
  );
};
