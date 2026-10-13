import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Calculator, ClipboardCheck, ShieldCheck, MapPin } from 'lucide-react';
import { ASSETS } from '../data/mockData';
import { LogoMark, WhatsAppIcon } from './Brand';
import { waLink } from './ui';

interface HeroProps {
  onOpenQuote: () => void;
}

const BENEFITS = [
  { icon: ClipboardCheck, title: 'Presupuesto sin cargo', text: 'Respuesta en el día' },
  { icon: ShieldCheck, title: 'Garantía escrita', text: 'En cada trabajo terminado' },
  { icon: MapPin, title: 'Toda la provincia', text: 'Capital, Sierras Chicas y Punilla' },
];

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-ink text-white">
      {/* Foto de obra en blanco y negro, con degradé para que el texto siempre se lea */}
      <div className="absolute inset-0 -z-10">
        <img src={ASSETS.heroBg} alt="" className="w-full h-full object-cover grayscale opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      </div>

      {/* Isotipo gigante como marca de agua */}
      <LogoMark
        size={620}
        className="absolute -right-24 top-1/2 -translate-y-1/2 -z-10 text-white/[0.035] hidden md:block"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-36 pb-16 sm:pt-44 lg:pt-48 lg:pb-24">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-7">
            <span className="h-px w-10 bg-white/60" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-white/75">
              Córdoba · Argentina
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
            Techos, terrazas, humedad, tanques y piletas. Soluciones definitivas con materiales de primera línea y
            garantía escrita en cada trabajo.
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
        </motion.div>

        <motion.div
          className="mt-16 lg:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden bg-white/10 ring-1 ring-white/10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-4 p-5 sm:p-6 bg-ink/70 backdrop-blur-md">
              <Icon size={22} strokeWidth={1.6} className="text-white/80 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-[13px] text-white/55 mt-0.5">{text}</div>
              </div>
            </div>
          ))}
        </motion.div>

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
