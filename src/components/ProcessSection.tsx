import React from 'react';
import { WORK_PROCESS, PHONE_NUMBER } from '../data/mockData';

interface ProcessSectionProps {
  onOpenDiagnostic: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onOpenDiagnostic }) => {
  return (
    <section className="w-full py-20 lg:py-24 bg-white" id="proceso">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#cde5ff] text-[#001d32] text-xs font-bold uppercase tracking-wider mb-3">
            Metodología Transparente
          </div>
          <h2 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl lg:text-4xl text-[#00263f] font-bold">
            ¿Cómo trabajamos?
          </h2>
          <p className="text-base sm:text-lg text-[#42474e] mt-2">
            Sin vueltas ni demoras. Un proceso claro desde el primer contacto hasta la entrega del certificado de garantía.
          </p>
        </div>

        {/* 4 Steps in Line */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORK_PROCESS.map((step) => (
            <div 
              key={step.step}
              className="relative p-6 rounded-2xl bg-[#f7f9fb] border border-[#e2e8f0] shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#4cb2ff]/40 transition-all duration-300"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00263f] text-white flex items-center justify-center font-['Montserrat',sans-serif] text-xl font-bold mb-6 shadow-sm">
                  {step.step}
                </div>
                <h3 className="font-['Montserrat',sans-serif] text-lg font-bold text-[#00263f] mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#42474e] leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#eceef0] text-[#006399] text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">{step.icon}</span>
                  <span>{step.tag}</span>
                </span>
                {step.step === '1' && (
                  <button 
                    onClick={onOpenDiagnostic}
                    className="text-[11px] underline text-[#00263f] hover:text-[#006399]"
                  >
                    Cargar fotos
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Diagnostic Quick Bar */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0b3c5d] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#4cb2ff]">
              <span className="material-symbols-outlined text-[28px]">speed</span>
            </div>
            <div>
              <div className="font-['Montserrat',sans-serif] text-base font-bold text-white">
                ¿Tenés una urgencia con goteras en este momento?
              </div>
              <div className="text-xs sm:text-sm text-[#cde5ff]">
                Atendemos emergencias por filtraciones activas en Córdoba con respuesta prioritaria.
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/${PHONE_NUMBER}?text=URGENCIA:%20Tengo%20una%20gotera%20activa%20en%20este%20momento,%20necesito%20asistencia`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl whitespace-nowrap shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>Atención Inmediata</span>
          </a>
        </div>
      </div>
    </section>
  );
};
