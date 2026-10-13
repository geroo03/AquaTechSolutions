import React, { useState } from 'react';
import { CASE_STUDIES, PHONE_NUMBER } from '../data/mockData';
import { CaseStudy } from '../types';

interface ComparisonSliderProps {
  beforeImg: string;
  afterImg: string;
  beforeAlt: string;
  afterAlt: string;
}

const ImageComparisonSlider: React.FC<ComparisonSliderProps> = ({ beforeImg, afterImg, beforeAlt, afterAlt }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPos(percent);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging && e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  return (
    <div 
      className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden select-none cursor-ew-resize border border-[#e2e8f0] shadow-inner"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Full width background) */}
      <img
        src={afterImg}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-3 right-3 bg-[#0284c7] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md z-10">
        DESPUÉS: Sellado 100% Estanco
      </div>

      {/* Before Image (Clipped by slider position) */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeImg}
          alt={beforeAlt}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none max-w-none"
          style={{ width: '100%', minWidth: '100%', height: '100%' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-[#ba1a1a] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-md z-10 whitespace-nowrap">
          ANTES: Filtración activa
        </div>
      </div>

      {/* Divider Bar */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20 pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#00263f] text-white flex items-center justify-center shadow-lg border-2 border-white">
          <span className="material-symbols-outlined text-[16px]">code</span>
        </div>
      </div>

      {/* Instruction indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full pointer-events-none">
        ↔ Arrastrá para comparar
      </div>
    </div>
  );
};

export const BeforeAfterSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'interactive'>('side-by-side');
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const toggleDetails = (caseId: string) => {
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  return (
    <section className="w-full py-20 lg:py-24 bg-[#f2f4f6]" id="trabajos">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#cde5ff] text-[#001d32] text-xs font-bold uppercase tracking-wider mb-3">
              Obras Realizadas en Córdoba
            </div>
            <h2 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl lg:text-4xl text-[#00263f] font-bold">
              Resultados comprobables: Antes y Después
            </h2>
            <p className="text-base sm:text-lg text-[#42474e] mt-2 max-w-xl">
              Mirá la transformación real de estructuras con filtraciones severas a sellados de alta performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* View Mode Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-white border border-[#e2e8f0] shadow-sm text-xs font-semibold">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'side-by-side'
                    ? 'bg-[#00263f] text-white shadow-xs'
                    : 'text-[#42474e] hover:text-[#00263f]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">view_column</span>
                <span>Lado a lado</span>
              </button>
              <button
                onClick={() => setViewMode('interactive')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'interactive'
                    ? 'bg-[#00263f] text-white shadow-xs'
                    : 'text-[#42474e] hover:text-[#00263f]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">compare</span>
                <span>Deslizador interactivo</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-[#e2e8f0] text-xs text-[#00263f] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006399]" />
              <span>100% fotos de obras propias</span>
            </div>
          </div>
        </div>

        {/* Case Studies Stack */}
        <div className="space-y-10 sm:space-y-12">
          {CASE_STUDIES.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl p-6 lg:p-8 border border-[#e2e8f0] shadow-[0_2px_12px_rgba(0,38,63,0.04)]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Images Column */}
                <div className="lg:col-span-7">
                  {viewMode === 'side-by-side' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Before Box */}
                      <div className="relative rounded-xl overflow-hidden group shadow-sm border border-[#e2e8f0]">
                        <img 
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" 
                          src={item.beforeImg} 
                          alt={item.beforeCaption}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-[#ba1a1a] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow">
                          {item.id === 'caso-1' && 'ANTES: Filtraciones activas'}
                          {item.id === 'caso-2' && 'ANTES: Desprendimiento y goteras'}
                          {item.id === 'caso-3' && 'ANTES: Goteras en cumbreras'}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs opacity-90">
                          {item.beforeCaption}
                        </div>
                      </div>

                      {/* After Box */}
                      <div className="relative rounded-xl overflow-hidden group shadow-sm border border-[#e2e8f0]">
                        <img 
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" 
                          src={item.afterImg} 
                          alt={item.afterCaption}
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-[#0284c7] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow">
                          {item.id === 'caso-1' && 'DESPUÉS: Geotextil + Poliuretano'}
                          {item.id === 'caso-2' && 'DESPUÉS: Poliuretánica transitable'}
                          {item.id === 'caso-3' && 'DESPUÉS: Sellado polimérico'}
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs opacity-90">
                          {item.afterCaption}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ImageComparisonSlider
                      beforeImg={item.beforeImg}
                      afterImg={item.afterImg}
                      beforeAlt={item.beforeCaption}
                      afterAlt={item.afterCaption}
                    />
                  )}
                </div>

                {/* Specs Column */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs uppercase text-[#006399] font-bold tracking-wider">
                        Caso de Estudio {item.number}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c2c7ce]" />
                      <span className="text-xs text-[#72777e] font-medium">{item.location}</span>
                    </div>

                    <h3 className="font-['Montserrat',sans-serif] text-xl sm:text-2xl font-bold text-[#00263f] mb-3">
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#42474e] mb-6 leading-relaxed">
                      <strong className="text-[#00263f]">Sistema:</strong> {item.system}
                    </p>

                    {/* Technical Specs 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#f7f9fb] border border-[#eceef0] mb-6">
                      <div>
                        <div className="text-[11px] font-bold text-[#72777e] uppercase tracking-wider">Superficie</div>
                        <div className="text-sm sm:text-base font-bold text-[#00263f]">{item.surface}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-[#72777e] uppercase tracking-wider">Garantía Otorgada</div>
                        <div className="text-sm sm:text-base font-bold text-[#006399]">{item.warranty}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-[#72777e] uppercase tracking-wider">Tiempo de Obra</div>
                        <div className="text-xs sm:text-sm font-semibold text-[#191c1e]">{item.time}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-[#72777e] uppercase tracking-wider">Estado Actual</div>
                        <div className="text-xs sm:text-sm font-bold text-[#00bb56]">{item.status}</div>
                      </div>
                    </div>

                    {/* Expandable Technical Protocol */}
                    {expandedCase === item.id && (
                      <div className="p-4 rounded-xl bg-[#e0f2fe]/40 border border-[#bae6fd] mb-6 animate-fade-in">
                        <div className="text-xs font-bold text-[#006399] uppercase tracking-wider mb-2">
                          Protocolo de Aplicación Ejecutado
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#334155]">
                          {item.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="material-symbols-outlined text-[15px] text-[#006399] shrink-0 mt-0.5">check</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <a 
                      className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#006399] hover:text-[#00263f] transition-colors font-bold group" 
                      href={`https://wa.me/${PHONE_NUMBER}?text=Hola%20AquaTech,%20quiero%20un%20presupuesto%20similar%20al%20de%20${encodeURIComponent(item.title)}`}
                      rel="noopener noreferrer" 
                      target="_blank"
                    >
                      <span>Pedir solución similar para mi techo</span>
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => toggleDetails(item.id)}
                      className="text-xs text-[#72777e] hover:text-[#00263f] underline transition-colors"
                    >
                      {expandedCase === item.id ? 'Ocultar protocolo' : 'Ver protocolo aplicado'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
