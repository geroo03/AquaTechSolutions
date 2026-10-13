import React from 'react';
import { ASSETS, PHONE_NUMBER } from '../data/mockData';

interface HeroProps {
  onOpenQuote: () => void;
  onOpenDiagnostic: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote, onOpenDiagnostic }) => {
  return (
    <section className="relative -mt-20 w-full overflow-hidden bg-[#00263f] text-white">
      {/* Background with technical layered gradient */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center mix-blend-overlay opacity-30 transform scale-105 transition-transform duration-1000 ease-out" 
          style={{ backgroundImage: `url('${ASSETS.heroBg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#00263f]/95 via-[#0b3c5d]/90 to-[#00263f]" />
        {/* Subtle architectural blueprint grid texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-36 pb-20 lg:pt-44 lg:pb-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#006399]/30 border border-[#4cb2ff]/20 backdrop-blur-md text-[#cde5ff] shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4cb2ff] animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">
              📍 Especialistas Técnicos en Córdoba y Gran Córdoba
            </span>
          </div>

          {/* H1 Headline */}
          <h1 className="font-['Montserrat',sans-serif] text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-white tracking-tight font-extrabold mb-6 leading-[1.15]">
            Impermeabilizaciones <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#95ccff] via-[#4cb2ff] to-[#cde5ff]">
              que perduran
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-[#cee5ff] mb-10 max-w-2xl leading-relaxed">
            Techos, terrazas y humedad en Córdoba. Soluciones definitivas con garantía escrita en cada trabajo y materiales de primera línea.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-14">
            <a 
              className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-sm sm:text-base px-6 sm:px-7 py-4 rounded-xl shadow-[0_10px_25px_rgba(37,211,102,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center" 
              href={`https://wa.me/${PHONE_NUMBER}?text=Hola%20AquaTech,%20quiero%20mandar%20fotos%20de%20mi%20techo%20para%20un%20diagn%C3%B3stico`}
              rel="noopener noreferrer" 
              target="_blank"
            >
              <span className="material-symbols-outlined text-[24px] text-white">chat</span>
              <span>Mandá fotos de tu techo por WhatsApp</span>
            </a>

            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={onOpenQuote}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-semibold text-xs sm:text-sm text-[#cde5ff] bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-sm transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                <span>Cotizar online</span>
              </button>

              <a 
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-semibold text-xs sm:text-sm text-[#cde5ff] bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-sm transition-all" 
                href="#trabajos"
              >
                <span>Ver trabajos</span>
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </a>
            </div>
          </div>

          {/* 3 Micro-Benefits Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0b3c5d]/50 border border-white/5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-[#006399]/30 flex items-center justify-center shrink-0 text-[#4cb2ff]">
                <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Presupuesto sin cargo</div>
                <div className="text-xs text-[#7fa7cd]">Respuesta en el día con asesoramiento</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0b3c5d]/50 border border-white/5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-[#006399]/30 flex items-center justify-center shrink-0 text-[#4cb2ff]">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Garantía escrita</div>
                <div className="text-xs text-[#7fa7cd]">Certificado técnico hasta por 10 años</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#0b3c5d]/50 border border-white/5 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-lg bg-[#006399]/30 flex items-center justify-center shrink-0 text-[#4cb2ff]">
                <span className="material-symbols-outlined text-[22px]">map</span>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Toda la provincia</div>
                <div className="text-xs text-[#7fa7cd]">Capital, Sierras Chicas y Punilla</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
