import React from 'react';
import { PHONE_NUMBER, PHONE_DISPLAY } from '../data/mockData';

export const CallToAction: React.FC = () => {
  return (
    <section className="w-full py-20 bg-[#4cb2ff] text-[#00263f] relative overflow-hidden" id="contacto">
      {/* Subtle structural pattern */}
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#00263f_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00263f]/10 text-[#00263f] text-xs sm:text-sm font-bold mb-6">
          ⚡ Atención Inmediata en Córdoba
        </div>

        <h2 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#00263f] mb-6 leading-tight">
          ¿Se te llueve el techo? Escribinos hoy, antes de la próxima tormenta
        </h2>

        <p className="text-base sm:text-lg text-[#00263f]/90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Evitá daños mayores en tu cielorraso, muebles e instalaciones eléctricas. El presupuesto es 100% gratuito y sin compromiso.
        </p>

        {/* Giant WhatsApp Button */}
        <div className="flex flex-col items-center gap-3">
          <a 
            className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe57] text-white font-['Montserrat',sans-serif] text-base sm:text-lg md:text-xl font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-2xl shadow-[0_12px_30px_rgba(37,211,102,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]" 
            href={`https://wa.me/${PHONE_NUMBER}?text=Hola%20AquaTech,%20necesito%20presupuesto%20urgente%20para%20mi%20techo`}
            rel="noopener noreferrer" 
            target="_blank"
          >
            <span className="material-symbols-outlined text-[28px] sm:text-[32px] text-white">chat</span>
            <span>Mandá un WhatsApp ahora al {PHONE_DISPLAY}</span>
          </a>

          <div className="flex items-center gap-2 text-[#00263f] text-xs sm:text-sm font-semibold mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366]" />
            <span>Atendemos consultas todos los días de 8 a 20 hs.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
