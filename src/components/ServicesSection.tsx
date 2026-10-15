import React from 'react';
import { ArrowUpRight, PaintRoller } from 'lucide-react';
import { SERVICES, SECONDARY_SERVICE } from '../data/mockData';
import { Reveal, SectionHeader, waLink } from './ui';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  return (
    <section className="py-24 lg:py-32 bg-paper" id="servicios">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-14">
          <SectionHeader
            eyebrow="Servicios"
            title="Soluciones integrales de impermeabilización"
            description="Impermeabilización y control de humedad para cada tipo de superficie."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.id} delay={(i % 3) * 0.06} className="h-full">
                <article className="group h-full flex flex-col p-7 sm:p-8 rounded-3xl bg-white ring-1 ring-line hover:ring-ink/20 hover:shadow-[0_24px_48px_-24px_rgba(11,11,12,0.25)] transition-all duration-300">
                  <div className="w-12 h-12 mb-8 rounded-2xl bg-mist text-ink flex items-center justify-center group-hover:bg-ink group-hover:text-white transition-colors duration-300">
                    <Icon size={22} strokeWidth={1.6} />
                  </div>

                  <h3 className="font-headline text-xl font-bold text-ink mb-3">{service.title}</h3>
                  <p className="text-[15px] text-muted leading-relaxed mb-6">{service.shortDesc}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite mb-8">
                    {service.warranty}
                  </p>

                  <div className="mt-auto pt-5 border-t border-line flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onSelectServiceForQuote(service.title)}
                      className="text-[13px] font-semibold text-muted hover:text-ink transition-colors"
                    >
                      Cotizar
                    </button>
                    <a
                      href={waLink(`Hola AquaTech, quiero consultar por ${service.title.toLowerCase()}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink"
                    >
                      Consultar
                      <ArrowUpRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:px-8 rounded-3xl bg-white ring-1 ring-line">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-mist text-ink flex items-center justify-center shrink-0">
                <PaintRoller size={20} strokeWidth={1.6} />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">También hacemos</div>
                <div className="font-headline text-lg font-bold text-ink">{SECONDARY_SERVICE.title}</div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-graphite">
                {SECONDARY_SERVICE.warranty}
              </span>
              <a
                href={waLink('Hola AquaTech, quiero consultar por pintura')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink"
              >
                Consultar <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
