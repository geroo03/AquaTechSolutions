import React, { useState } from 'react';
import { ZONES, ASSETS, PHONE_NUMBER } from '../data/mockData';
import { ZoneItem } from '../types';

export const CoverageZonesSection: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<ZoneItem>(ZONES[0]);

  return (
    <section className="w-full py-20 lg:py-24 bg-white" id="zonas">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Zones List & Details */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#cde5ff] text-[#001d32] text-xs font-bold uppercase tracking-wider mb-3">
              Presencia Regional
            </div>
            <h2 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl lg:text-4xl text-[#00263f] font-bold mb-4">
              Cobertura en toda la provincia de Córdoba
            </h2>
            <p className="text-base sm:text-lg text-[#42474e] mb-6 leading-relaxed">
              Atendemos urgencias y proyectos en Córdoba Capital y Gran Córdoba con equipos móviles propios y logística inmediata.
            </p>

            {/* Interactive zone badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {ZONES.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#00263f] text-white shadow-sm ring-2 ring-[#4cb2ff]'
                        : 'bg-[#eceef0] text-[#00263f] hover:bg-[#e0e3e5]'
                    }`}
                  >
                    {zone.name}
                  </button>
                );
              })}
            </div>

            {/* Selected Zone Live Dispatch Panel */}
            <div className="p-5 rounded-2xl bg-[#f7f9fb] border border-[#e2e8f0] shadow-sm mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006399] text-[20px]">near_me</span>
                  <span className="font-['Montserrat',sans-serif] font-bold text-[#00263f] text-base">
                    {selectedZone.name}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#00bb56] bg-[#dcfce7] px-2.5 py-0.5 rounded-full">
                  {selectedZone.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-[#42474e] mb-4">
                <div>
                  <span className="text-[#72777e] block">Departamento/Área:</span>
                  <span className="font-semibold text-[#191c1e]">{selectedZone.department}</span>
                </div>
                <div>
                  <span className="text-[#72777e] block">Respuesta para Inspección:</span>
                  <span className="font-bold text-[#006399]">{selectedZone.dispatchTime}</span>
                </div>
                <div>
                  <span className="text-[#72777e] block">Unidad Móvil Asignada:</span>
                  <span className="font-semibold text-[#191c1e]">{selectedZone.mobileTeam}</span>
                </div>
                <div>
                  <span className="text-[#72777e] block">Costo de Visita Técnica:</span>
                  <span className="font-bold text-[#00bb56]">Sin Cargo</span>
                </div>
              </div>

              <a
                href={`https://wa.me/${PHONE_NUMBER}?text=Hola%20AquaTech,%20quiero%20coordinar%20una%20visita%20técnica%20en%20${encodeURIComponent(selectedZone.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#006399] hover:bg-[#00263f] text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">event_available</span>
                <span>Coordinar visita en {selectedZone.name}</span>
              </a>
            </div>

            {/* Assistance fallback alert */}
            <div className="p-4 rounded-xl bg-[#f2f4f6] flex items-start gap-3.5 border border-[#e2e8f0]">
              <span className="material-symbols-outlined text-[#006399] text-[22px] shrink-0 mt-0.5">help</span>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#00263f]">¿Tu zona no figura en la lista?</p>
                <p className="text-xs text-[#52575e] mt-0.5">
                  Escribinos igualmente, coordinamos visitas técnicas en cualquier punto de la provincia de Córdoba para proyectos residenciales y consorcios.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Stylized Map Card */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-xl bg-[#eceef0] relative border border-[#e2e8f0]">
              <div 
                className="w-full h-96 sm:h-[420px] bg-cover bg-center transition-transform duration-700 hover:scale-105" 
                style={{ backgroundImage: `url('${ASSETS.mapCordoba}')` }}
              >
                {/* Visual pin markers on map */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#00263f] text-white px-3 py-1.5 rounded-full shadow-lg border border-white/20 animate-bounce">
                  <span className="material-symbols-outlined text-[16px] text-[#4cb2ff]">pin_drop</span>
                  <span className="text-xs font-bold">Base Operativa Cba Capital</span>
                </div>
              </div>

              {/* Float dispatch badge */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-[#e2e8f0] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#cde5ff] flex items-center justify-center text-[#006399]">
                    <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-[#00263f]">Móviles Técnicos AquaTech</div>
                    <div className="text-[11px] sm:text-xs text-[#42474e]">Relevamiento en menos de 24/48 hs</div>
                  </div>
                </div>

                <a 
                  className="font-bold text-xs text-white bg-[#00263f] hover:bg-[#0b3c5d] px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shadow-sm" 
                  href={`https://wa.me/${PHONE_NUMBER}?text=Hola%20AquaTech,%20quiero%20coordinar%20una%20visita%20en%20mi%20zona`}
                  rel="noopener noreferrer" 
                  target="_blank"
                >
                  Coordinar
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
