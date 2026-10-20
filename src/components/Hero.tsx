import React from 'react';
import { ArrowDown, ArrowRight, Building2, Calculator, Award, ClipboardCheck, ShieldCheck } from 'lucide-react';
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
          fetchPriority="low"
          decoding="async"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-10 bg-white/60" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75">
              Córdoba · Desde {FOUNDED_YEAR}
            </span>
          </div>

          <h1 className="font-headline text-[clamp(1.75rem,7.6vw,4.25rem)] lg:text-[clamp(2.4rem,3.6vw,3.35rem)] leading-[1.05] font-bold tracking-tight">
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

        {/* Destacados: la promo de mano de obra y el plan para inmobiliarias, visibles al entrar */}
        <div className="lg:col-span-5 grid gap-4">
          {promoActive && (
            <a
              href="#promo"
              className="promo-shine promo-breathe group block p-6 sm:p-7 rounded-3xl bg-white text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.7)]"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink text-white text-[11px] font-bold uppercase tracking-[0.14em]">
                    <span className="relative flex w-1.5 h-1.5">
                      <span className="absolute inset-0 rounded-full bg-white/70 animate-ping motion-reduce:animate-none" />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                    Promo
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{PROMO.badge}</span>
                </div>
                <div className="mt-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-graphite">{PROMO.priceLabel}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-headline text-5xl font-bold leading-none">{PROMO.items[0].price}</span>
                  <span className="text-sm font-semibold text-muted">{PROMO.items[0].unit}</span>
                </div>
                <p className="mt-3 text-[14px] text-graphite leading-snug">
                  Membranas asfálticas con aluminio o geotextil y membrana líquida. Materiales no incluidos.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Ver la promo <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          )}

          <a
            href="#inmobiliarias"
            className="group block p-6 sm:p-7 rounded-3xl bg-white/[0.06] ring-1 ring-white/20 backdrop-blur-md hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start gap-4">
              <span className="w-11 h-11 shrink-0 rounded-2xl bg-white text-ink flex items-center justify-center">
                <Building2 size={20} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Inmobiliarias</div>
                <div className="mt-1 font-headline text-lg font-bold leading-snug">Plan de Mantenimiento con abono mensual</div>
                <p className="mt-2 text-[14px] text-white/65 leading-snug">
                  Una visita por mes, reparaciones menores e informe con fotos para cada propietario.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">
                  Conocer el plan <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </a>
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
