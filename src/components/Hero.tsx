import React from 'react';
import { ArrowDown, Calculator, Award, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { ASSETS, FOUNDED_YEAR } from '../data/mockData';
import { PROMO } from '../data/promo';
import { LogoMark, WhatsAppIcon } from './Brand';
import { usePromoActive } from './PromoSection';
import { waLink } from './ui';

interface HeroProps {
  onOpenQuote: () => void;
}

const BENEFITS = [
  { icon: Award, title: `Desde ${FOUNDED_YEAR}`, text: 'Impermeabilizando en Córdoba' },
  { icon: ClipboardCheck, title: 'Presupuesto sin cargo', text: 'En menos de 24 h' },
  { icon: ShieldCheck, title: 'Garantía por escrito', text: 'Hasta 10 años según el sistema' },
];

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const promoActive = usePromoActive();
  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-ink text-white">
      {/* Foto de obra en blanco y negro, con degradé para que el texto siempre se lea */}
      <div className="absolute inset-0 -z-10">
        <img
          src={ASSETS.heroBg}
          srcSet={`${ASSETS.heroBgSmall} 960w, ${ASSETS.heroBg} 1600w`}
          sizes="100vw"
          alt=""
          width={1600}
          height={1200}
          fetchPriority="high"
          className="w-full h-full object-cover grayscale opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      </div>

      {/* Isotipo gigante como marca de agua */}
      <LogoMark
        size={620}
        className="absolute -right-24 top-1/2 -translate-y-1/2 -z-10 text-white/[0.035] hidden md:block"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-36 pb-16 sm:pt-44 lg:pt-48 lg:pb-24">
        <div className="max-w-3xl">
          {promoActive && (
            <a
              href="#promo"
              className="group inline-flex items-center gap-2.5 mb-8 pl-1.5 pr-4 py-1.5 rounded-2xl sm:rounded-full bg-white/10 ring-1 ring-white/20 text-[13px] text-white hover:bg-white/15 transition-colors"
            >
              <span className="px-2.5 py-1 rounded-full bg-white text-ink text-[11px] font-bold uppercase tracking-[0.12em]">
                Promo
              </span>
              Mano de obra a {PROMO.items[0].price} el m²{PROMO.validUntilLabel && ` hasta el ${PROMO.validUntilLabel}`}
              <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
            </a>
          )}
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-10 bg-white/60" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75">
              Córdoba · Desde {FOUNDED_YEAR}
            </span>
          </div>

          <h1 className="font-headline text-[clamp(1.75rem,7.6vw,4.75rem)] leading-[1.05] font-bold tracking-tight">
            Impermeabilizaciones
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#d9d9dd] to-[#9a9aa0]">
              que perduran.
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
            Techos, terrazas, humedad, filtraciones, tanques y piletas. Soluciones integrales en impermeabilización y
            control de humedad, con garantía según el sistema.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href={waLink('Hola AquaTech, quiero mandar fotos de mi techo para un diagnóstico')}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 h-14 px-7 rounded-full bg-white text-ink text-[15px] font-semibold hover:bg-white/90 transition-all"
            >
              <WhatsAppIcon size={19} />
              Mandá fotos de tu techo
            </a>
            <button
              onClick={onOpenQuote}
              className="inline-flex items-center justify-center gap-2.5 h-14 px-7 rounded-full border border-white/25 text-white text-[15px] font-semibold hover:bg-white/10 transition-all"
            >
              <Calculator size={18} strokeWidth={1.8} />
              Cotizar online
            </button>
          </div>
        </div>

        <div className="mt-16 lg:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden bg-white/10 ring-1 ring-white/10">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4 p-5 sm:p-6 bg-ink/70 backdrop-blur-md">
              <Icon size={22} strokeWidth={1.6} className="text-white/80 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-[13px] text-white/55 mt-0.5">{text}</div>
              </div>
            </div>
          ))}
        </div>

        <a
          href="#servicios"
          className="mt-10 hidden lg:inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-white/50 hover:text-white transition-colors"
        >
          <ArrowDown size={14} /> Conocé nuestros servicios
        </a>
      </div>
    </section>
  );
};
