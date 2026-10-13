import React from 'react';
import { PHONE_NUMBER } from '../data/mockData';

interface WarrantySectionProps {
  onOpenWarrantyModal: () => void;
}

export const WarrantySection: React.FC<WarrantySectionProps> = ({ onOpenWarrantyModal }) => {
  return (
    <section className="w-full py-20 lg:py-24 bg-[#00263f] text-white relative overflow-hidden" id="garantia">
      {/* Decorative background glow */}
      <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-[#006399]/20 blur-3xl pointer-events-none" />
      <div className="absolute -left-32 -top-32 w-96 h-96 rounded-full bg-[#4cb2ff]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#006399]/30 text-[#cde5ff] text-xs font-bold uppercase tracking-wider mb-4 border border-[#4cb2ff]/20">
              Respaldo Certificado
            </div>
            <h2 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl lg:text-4xl text-white font-bold mb-6">
              Tranquilidad total: respaldo técnico con garantía por escrito
            </h2>
            <p className="text-base sm:text-lg text-[#cee5ff] mb-8 leading-relaxed">
              No hacemos parches provisorios. En AquaTech trabajamos exclusivamente con materiales normalizados de primera marca (Sika, Megaflex, Ormiflex) aplicados bajo normas IRAM. Cada obra finalizada cuenta con una póliza de garantía extendida firmada.
            </p>

            {/* 3 Badges/Sellos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="p-4 rounded-xl bg-[#0b3c5d]/70 border border-white/10 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[#4cb2ff] text-[28px] mb-2">workspace_premium</span>
                <div className="text-sm font-bold text-white">Hasta 10 años</div>
                <div className="text-xs text-[#7fa7cd]">De cobertura formal</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0b3c5d]/70 border border-white/10 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[#4cb2ff] text-[28px] mb-2">fact_check</span>
                <div className="text-sm font-bold text-white">100% Normalizados</div>
                <div className="text-xs text-[#7fa7cd]">Sika, Megaflex, Ormiflex</div>
              </div>
              <div className="p-4 rounded-xl bg-[#0b3c5d]/70 border border-white/10 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[#4cb2ff] text-[28px] mb-2">support_agent</span>
                <div className="text-sm font-bold text-white">Respaldo Post-Obra</div>
                <div className="text-xs text-[#7fa7cd]">Seguimiento técnico directo</div>
              </div>
            </div>

            {/* WhatsApp & Inspect Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a 
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-sm sm:text-base px-8 py-4 rounded-xl shadow-[0_8px_20px_rgba(37,211,102,0.3)] transition-all transform hover:-translate-y-0.5" 
                href={`https://wa.me/${PHONE_NUMBER}?text=Hola%20AquaTech,%20quiero%20asesoramiento%20y%20conocer%20los%20t%C3%A9rminos%20de%20la%20garant%C3%ADa%20escrita`}
                rel="noopener noreferrer" 
                target="_blank"
              >
                <span className="material-symbols-outlined text-[24px] text-white">chat</span>
                <span>Pedí asesoramiento y garantía</span>
              </a>

              <button
                type="button"
                onClick={onOpenWarrantyModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-sm text-[#cde5ff] bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Inspeccionar Póliza Modelo</span>
              </button>
            </div>
          </div>

          {/* Graphic Certificate Preview Card */}
          <div className="lg:col-span-5">
            <div 
              onClick={onOpenWarrantyModal}
              className="bg-white text-[#191c1e] rounded-2xl p-6 sm:p-8 shadow-2xl relative border border-[#e2e8f0] cursor-pointer group hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#eceef0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#00263f] text-white flex items-center justify-center font-bold">
                    AQ
                  </div>
                  <div>
                    <div className="font-['Montserrat',sans-serif] text-lg font-bold text-[#00263f]">AquaTech</div>
                    <div className="text-xs font-bold text-[#006399]">Certificado de Cobertura</div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#0284c7] text-[36px] group-hover:rotate-12 transition-transform">
                  shield_lock
                </span>
              </div>

              <div className="space-y-3 mb-6 divide-y divide-[#eceef0] text-xs sm:text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-[#72777e]">Póliza Técnica:</span>
                  <span className="font-bold text-[#00263f]">GAR-2025-CBA</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#72777e]">Normas Aplicadas:</span>
                  <span className="font-semibold text-[#00263f]">IRAM 1555 / 1570</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#72777e]">Prueba de Estanqueidad:</span>
                  <span className="font-bold text-[#00bb56]">Aprobada 48 hs</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#72777e]">Plazo de Garantía:</span>
                  <span className="font-bold text-[#006399]">Hasta 10 Años Escrita</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f2f4f6] flex items-center gap-3 text-xs text-[#42474e]">
                <span className="material-symbols-outlined text-[#006399] text-[24px] shrink-0">verified_user</span>
                <p>
                  Documento contractual vinculante entregado al finalizar cada obra. Tocá para ver la póliza completa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
