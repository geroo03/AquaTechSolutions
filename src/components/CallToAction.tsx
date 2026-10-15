import React from 'react';
import { Mail } from 'lucide-react';
import { PHONE_DISPLAY, EMAIL } from '../data/mockData';
import { LogoMark, WhatsAppIcon } from './Brand';
import { Eyebrow, Reveal, waLink } from './ui';

export const CallToAction: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-silver-disc" id="contacto">
      <LogoMark
        size={520}
        className="absolute -left-28 -bottom-40 text-ink/[0.04] pointer-events-none hidden md:block"
      />

      <Reveal className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <Eyebrow center>Contacto</Eyebrow>
        <h2 className="font-headline text-3xl sm:text-5xl lg:text-[56px] font-bold text-ink leading-[1.08]">
          ¿Se te llueve el techo?
          <br />
          Escribinos antes de la próxima tormenta.
        </h2>
        <p className="mt-6 text-base sm:text-lg text-graphite max-w-2xl mx-auto leading-relaxed">
          Evitá daños en cielorrasos, muebles e instalación eléctrica. Mandanos fotos del problema y te asesoramos.
        </p>

        <a
          href={waLink('Hola AquaTech, necesito un presupuesto para mi techo')}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 mx-auto w-fit flex items-center justify-center gap-3 h-16 px-8 sm:px-10 rounded-full bg-ink text-white font-headline text-base sm:text-lg font-semibold shadow-[0_20px_40px_-16px_rgba(11,11,12,0.55)] hover:bg-graphite hover:-translate-y-0.5 transition-all"
        >
          <WhatsAppIcon size={22} />
          WhatsApp {PHONE_DISPLAY}
        </a>

        <a
          href={`mailto:${EMAIL}`}
          className="mt-6 flex w-fit mx-auto items-center justify-center gap-2 text-[13px] font-medium text-graphite hover:text-ink transition-colors"
        >
          <Mail size={15} strokeWidth={1.8} />
          {EMAIL}
        </a>
      </Reveal>
    </section>
  );
};
