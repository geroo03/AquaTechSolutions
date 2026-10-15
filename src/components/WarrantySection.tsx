import React from 'react';
import { WARRANTIES, FOUNDED_YEAR } from '../data/mockData';
import { LogoMark, WhatsAppIcon } from './Brand';
import { Reveal, SectionHeader, waLink } from './ui';

export const WarrantySection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-ink text-white" id="garantia">
      <div className="absolute inset-0 bg-dots pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-6">
          <SectionHeader
            tone="light"
            eyebrow="Garantía"
            title="Cada sistema, con su garantía"
            description={`Impermeabilizamos en Córdoba desde ${FOUNDED_YEAR}. Según el sistema que elijas, el trabajo queda cubierto entre 2 y 10 años, y hasta 25 años con tratamientos y productos específicos. La garantía se entrega por escrito, en papel y en formato digital.`}
          />

          <Reveal className="mt-10">
            <a
              href={waLink('Hola AquaTech, quiero consultar qué sistema y qué garantía me conviene')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 py-3.5 px-7 rounded-full bg-white text-ink text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              <WhatsAppIcon size={17} /> Consultar qué me conviene
            </a>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-6" delay={0.1}>
          <div className="bg-white text-ink rounded-[28px] p-7 sm:p-9 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
            <div className="flex items-center gap-3 pb-6 mb-2 border-b border-line">
              <LogoMark size={30} />
              <div>
                <div className="font-headline text-[15px] font-bold tracking-[0.04em]">AQUATECH</div>
                <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Garantía por sistema</div>
              </div>
            </div>

            <dl className="divide-y divide-line">
              {WARRANTIES.map(({ system, years }) => (
                <div key={system} className="flex items-center justify-between gap-6 py-4">
                  <dt className="text-[15px] text-graphite">{system}</dt>
                  <dd className="font-headline text-lg font-bold text-right whitespace-nowrap">{years}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 p-4 rounded-2xl bg-paper text-[13px] text-muted leading-relaxed">
              Tanques, piletas y cimientos: la garantía depende del sistema que se use. Consultanos.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
