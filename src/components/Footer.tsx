import React from 'react';
import { ASSETS, PHONE_NUMBER, PHONE_DISPLAY, EMAIL_CONTACT } from '../data/mockData';

interface FooterProps {
  onOpenWarrantyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenWarrantyModal }) => {
  return (
    <footer className="w-full bg-[#e6e8ea] pt-16 pb-12 text-[#191c1e]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                alt="Logo AquaTech" 
                className="h-8 w-auto object-contain" 
                src={ASSETS.logo}
                referrerPolicy="no-referrer"
              />
              <span className="font-['Montserrat',sans-serif] text-xl font-bold text-[#00263f]">
                AquaTech
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#42474e] leading-relaxed">
              Empresa líder especializada en impermeabilización de techos, terrazas, losas y muros en Córdoba. Soluciones técnicas definitivas con garantía certificada por escrito.
            </p>
            <div className="flex items-center gap-2 text-[#0284C7] bg-[#E0F2FE] px-3 py-1.5 rounded-lg w-fit text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span>Presupuestos técnicos en 24h</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-4">
            <h4 className="font-['Montserrat',sans-serif] text-base font-bold text-[#00263f]">
              Contacto Directo
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#42474e]">
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#006399] text-[20px]">call</span>
                <a className="hover:text-[#00263f] transition-colors" href={`https://wa.me/${PHONE_NUMBER}`}>
                  WhatsApp: {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#006399] text-[20px]">mail</span>
                <a className="hover:text-[#00263f] transition-colors" href={`mailto:${EMAIL_CONTACT}`}>
                  {EMAIL_CONTACT}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#006399] text-[20px]">share</span>
                <span>Instagram: @aqua.tech.solutions</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#006399] text-[20px]">thumb_up</span>
                <span>Facebook: AquaTech Córdoba</span>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-4">
            <h4 className="font-['Montserrat',sans-serif] text-base font-bold text-[#00263f]">
              Cobertura Provincial
            </h4>
            <p className="text-xs sm:text-sm text-[#42474e]">
              Servicio técnico integral en Córdoba Capital y Gran Córdoba:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Córdoba Capital',
                'Villa Allende',
                'Mendiolaza',
                'Río Ceballos',
                'Villa Carlos Paz',
                'Malagueño',
                'Toda la Provincia',
              ].map((loc, i) => (
                <span 
                  key={i} 
                  className="bg-white px-2.5 py-1 rounded text-[11px] font-semibold text-[#42474e] shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h4 className="font-['Montserrat',sans-serif] text-base font-bold text-[#00263f]">
              Atención Técnica
            </h4>
            <div className="bg-white p-4 rounded-xl shadow-[0_1px_6px_rgba(0,0,0,0.03)] space-y-2 border border-[#e2e8f0]">
              <div className="flex items-center gap-2 text-[#00263f] text-xs sm:text-sm font-semibold">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                <span>Horarios de Atención</span>
              </div>
              <p className="text-xs text-[#42474e]">Lunes a Sábados: 8:00 a 19:00 hs</p>
              <p className="text-[11px] text-[#72777e]">Guardias y relevamientos de urgencia programados</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-[#c2c7ce]/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#42474e]">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} AquaTech Impermeabilizaciones. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenWarrantyModal} 
              className="hover:text-[#00263f] underline transition-colors"
            >
              Términos de Garantía
            </button>
            <span aria-hidden="true">·</span>
            <span>Normas IRAM 1555 / 1570</span>
            <span aria-hidden="true">·</span>
            <span>Córdoba, Argentina</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
