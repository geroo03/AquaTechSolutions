import React from 'react';
import { CERTIFICATE_DATA, PHONE_NUMBER } from '../data/mockData';

interface WarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WarrantyModal: React.FC<WarrantyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#cbd5e1] p-6 sm:p-10 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-lg bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] flex items-center justify-center transition-colors"
          aria-label="Cerrar modal"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        {/* Certificate Header */}
        <div className="border-b-2 border-[#00263f] pb-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#00263f] text-white flex items-center justify-center font-['Montserrat',sans-serif] font-extrabold text-xl">
                AQ
              </div>
              <div>
                <h3 className="font-['Montserrat',sans-serif] text-2xl font-extrabold text-[#00263f] tracking-tight">
                  AquaTech
                </h3>
                <span className="text-xs font-bold text-[#006399] uppercase tracking-wider">
                  División de Garantías & Certificaciones Técnicas
                </span>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-[11px] font-mono text-[#64748b] block">CÓDIGO DE VALIDACIÓN:</span>
              <span className="text-sm font-mono font-bold text-[#00263f]">{CERTIFICATE_DATA.policyNumber}</span>
            </div>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 rounded bg-[#e0f2fe] text-[#0369a1] text-xs font-bold uppercase tracking-widest mb-2">
            Documento Oficial Contractual
          </div>
          <h4 className="font-['Montserrat',sans-serif] text-xl sm:text-2xl font-bold text-[#0f172a]">
            Certificado de Garantía de Impermeabilización
          </h4>
          <p className="text-xs text-[#64748b] mt-1">
            Emitido en conformidad con los protocolos de la Cámara Argentina de la Construcción y Normas IRAM.
          </p>
        </div>

        {/* Certificate Specs Grid */}
        <div className="space-y-4 mb-8 bg-[#f8fafc] p-5 rounded-xl border border-[#e2e8f0]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#64748b] block">Dirección Técnica:</span>
              <span className="font-bold text-[#0f172a]">{CERTIFICATE_DATA.technicalDirector}</span>
            </div>
            <div>
              <span className="text-[#64748b] block">Normativa de Fabricación y Colocación:</span>
              <span className="font-bold text-[#0f172a]">{CERTIFICATE_DATA.standards}</span>
            </div>
            <div>
              <span className="text-[#64748b] block">Protocolo de Ensayo Hidráulico:</span>
              <span className="font-bold text-[#00bb56]">{CERTIFICATE_DATA.watertightTest}</span>
            </div>
            <div>
              <span className="text-[#64748b] block">Plazo de Cobertura Legal:</span>
              <span className="font-bold text-[#006399]">{CERTIFICATE_DATA.coveragePeriod}</span>
            </div>
          </div>

          <div className="border-t border-[#e2e8f0] pt-3 text-[11px] text-[#475569] leading-relaxed">
            <strong>Alcance de la Póliza:</strong> Esta garantía cubre fallas por desprendimiento, defectos de adhesión, rotura de membrana por amplitud térmica o filtraciones en juntas selladas. En caso de siniestro dentro del plazo otorgado, el personal técnico de AquaTech intervendrá dentro de las 24 a 48 hs hábiles sin ningún costo para el comitente.
          </div>
        </div>

        {/* Seal and Signatures representation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#006399] flex items-center justify-center p-1 text-center">
              <span className="text-[9px] font-bold text-[#006399] uppercase leading-tight">
                AquaTech Oficial Córdoba
              </span>
            </div>
            <div className="text-xs text-[#64748b]">
              <div>Firma y Sello Profesional Registrado</div>
              <div className="font-semibold text-[#0f172a]">Colegio Profesional de la Ingeniería de Cba.</div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#cbd5e1] hover:bg-[#f1f5f9] text-xs font-semibold text-[#334155] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Imprimir</span>
            </button>

            <a
              href={`https://wa.me/${PHONE_NUMBER}?text=Hola%20AquaTech,%20quiero%20validar%20mi%20p%C3%B3liza%20o%20consultar%20por%20la%20garant%C3%ADa%20escrita`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe57] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Consultar Términos</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
