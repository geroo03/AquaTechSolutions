import React, { useState } from 'react';
import { SERVICES, PHONE_NUMBER } from '../data/mockData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectServiceForQuote?: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section className="w-full py-20 lg:py-24 bg-[#f7f9fb]" id="servicios">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#cde5ff] text-[#001d32] text-xs font-bold uppercase tracking-wider mb-3">
            Ingeniería de Aislamiento
          </div>
          <h2 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl lg:text-4xl text-[#00263f] mb-4 font-bold">
            Servicios integrales de impermeabilización
          </h2>
          <p className="text-base sm:text-lg text-[#42474e]">
            Diagnóstico exacto de fallas estructurales y aplicación de tecnología hidrófuga de última generación en Córdoba.
          </p>
        </div>

        {/* 6 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div 
              key={service.id} 
              className="group flex flex-col justify-between p-8 rounded-2xl bg-white border border-[#e2e8f0] shadow-[0_2px_8px_rgba(0,38,63,0.04)] hover:shadow-xl hover:border-[#4cb2ff]/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#cde5ff]/60 text-[#006399] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#006399] group-hover:text-white transition-all shadow-sm">
                    <span className="material-symbols-outlined text-[30px]">{service.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-[#006399] bg-[#e0f2fe] px-2.5 py-1 rounded-md">
                    {service.warrantyYears} años garantía
                  </span>
                </div>

                <h3 className="font-['Montserrat',sans-serif] text-xl font-bold text-[#00263f] mb-3">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-[#42474e] mb-6 leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Micro checklist */}
                <ul className="space-y-1.5 mb-6 text-xs text-[#52575e]">
                  {service.features.slice(0, 2).map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#00bb56] shrink-0 mt-0.5">check_circle</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#f2f4f6] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#006399] hover:text-[#00263f] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">info</span>
                  <span>Ver ficha técnica</span>
                </button>

                <a 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006399] hover:text-[#00263f] group-hover:translate-x-0.5 transition-all" 
                  href={`https://wa.me/${PHONE_NUMBER}?text=Hola%20AquaTech,%20quiero%20consultar%20por%20impermeabilizaci%C3%B3n%20de%20${encodeURIComponent(service.title)}`}
                  rel="noopener noreferrer" 
                  target="_blank"
                >
                  <span>Consultar</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Details Technical Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 border border-[#e2e8f0]">
            <div className="flex items-center justify-between pb-4 border-b border-[#eceef0] mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#cde5ff] text-[#006399] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[26px]">{selectedService.icon}</span>
                </div>
                <div>
                  <h3 className="font-['Montserrat',sans-serif] text-xl font-bold text-[#00263f]">
                    {selectedService.title}
                  </h3>
                  <span className="text-xs font-semibold text-[#006399]">
                    Garantía Escrita {selectedService.warrantyYears} Años
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                className="w-8 h-8 rounded-lg bg-[#eceef0] text-[#42474e] hover:bg-[#e0e3e5] flex items-center justify-center transition-colors"
                aria-label="Cerrar modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-sm text-[#42474e] mb-5 leading-relaxed">
              {selectedService.shortDesc}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-bold text-[#00263f] uppercase tracking-wider mb-2">
                  Procedimientos y Especificaciones
                </h4>
                <ul className="space-y-2">
                  {selectedService.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#334155]">
                      <span className="material-symbols-outlined text-[18px] text-[#00bb56] shrink-0 mt-0.5">verified</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#00263f] uppercase tracking-wider mb-2">
                  Materiales Normalizados Utilizados
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedService.materials.map((mat, idx) => (
                    <span key={idx} className="text-xs font-medium px-2.5 py-1 rounded bg-[#f2f4f6] text-[#00263f] border border-[#e2e8f0]">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#e0f2fe]/50 border border-[#bae6fd]">
                <div className="text-xs font-bold text-[#006399] mb-1">Recomendado principalmente para:</div>
                <div className="text-xs text-[#0f172a]">{selectedService.recommendedFor}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#eceef0]">
              <a
                href={`https://wa.me/${PHONE_NUMBER}?text=Hola%20AquaTech,%20quiero%20un%20presupuesto%20para%20${encodeURIComponent(selectedService.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-sm py-3 px-5 rounded-xl transition-all shadow-md"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span>Pedir presupuesto por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (onSelectServiceForQuote) {
                    onSelectServiceForQuote(selectedService.title);
                  }
                  setSelectedService(null);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#00263f] hover:bg-[#0b3c5d] text-white font-semibold text-xs py-3 px-4 rounded-xl transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                <span>Calcular m²</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
