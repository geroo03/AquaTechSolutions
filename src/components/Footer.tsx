import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { PHONE_DISPLAY, INSTAGRAM_URL, INSTAGRAM_HANDLE, OPENING_HOURS, SERVICES } from '../data/mockData';
import { Logo, WhatsAppIcon, InstagramIcon } from './Brand';
import { waLink } from './ui';

interface FooterProps {
  onOpenWarrantyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenWarrantyModal }) => {
  return (
    <footer className="bg-ink text-white pt-20 pb-28 sm:pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 text-sm text-white/55 leading-relaxed max-w-xs">
              Soluciones integrales en impermeabilización y control de humedad en Córdoba. Calidad garantizada.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href={waLink('Hola AquaTech')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full ring-1 ring-white/15 flex items-center justify-center text-white/80 hover:bg-white hover:text-ink transition-colors"
              >
                <WhatsAppIcon size={17} />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full ring-1 ring-white/15 flex items-center justify-center text-white/80 hover:bg-white hover:text-ink transition-colors"
              >
                <InstagramIcon size={17} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45 mb-5">Servicios</h4>
            <ul className="space-y-3 text-sm text-white/75">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a href="#servicios" className="hover:text-white transition-colors">{s.title}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45 mb-5">Empresa</h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li><a href="#trabajos" className="hover:text-white transition-colors">Trabajos</a></li>
              <li><a href="#proceso" className="hover:text-white transition-colors">Cómo trabajamos</a></li>
              <li><a href="#zonas" className="hover:text-white transition-colors">Zonas</a></li>
              <li><a href="#preguntas" className="hover:text-white transition-colors">Preguntas</a></li>
              <li>
                <button onClick={onOpenWarrantyModal} className="hover:text-white transition-colors">
                  Garantía
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45 mb-5">Contacto</h4>
            <ul className="space-y-4 text-sm text-white/75">
              <li>
                <a
                  href={waLink('Hola AquaTech')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-white transition-colors"
                >
                  <WhatsAppIcon size={16} className="shrink-0" /> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-white transition-colors"
                >
                  <InstagramIcon size={16} className="shrink-0" /> {INSTAGRAM_HANDLE}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} strokeWidth={1.8} className="shrink-0" /> Córdoba, Argentina
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} strokeWidth={1.8} className="shrink-0" /> {OPENING_HOURS}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-white/40">
          <p>© {new Date().getFullYear()} AquaTech Solutions. Todos los derechos reservados.</p>
          <p className="tracking-[0.2em] uppercase text-[11px]">Impermeabilizaciones que perduran</p>
        </div>
      </div>
    </footer>
  );
};
