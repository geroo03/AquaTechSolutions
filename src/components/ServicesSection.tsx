import React, { useState } from 'react';
import { ArrowUpRight, Check, Calculator } from 'lucide-react';
import { SERVICES } from '../data/mockData';
import { ServiceItem } from '../types';
import { WhatsAppIcon } from './Brand';
import { Modal, Reveal, SectionHeader, waLink } from './ui';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section className="py-24 lg:py-32 bg-paper" id="servicios">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <SectionHeader
            eyebrow="Servicios"
            title="Soluciones integrales de impermeabilización"
            description="Diagnóstico preciso y sistemas profesionales para cada tipo de superficie."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.id} delay={(i % 3) * 0.06} className="h-full">
                <article className="group h-full flex flex-col p-7 sm:p-8 rounded-3xl bg-white ring-1 ring-line hover:ring-ink/20 hover:shadow-[0_24px_48px_-24px_rgba(11,11,12,0.25)] transition-all duration-300">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-mist text-ink flex items-center justify-center group-hover:bg-ink group-hover:text-white transition-colors duration-300">
                      <Icon size={22} strokeWidth={1.6} />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      {service.warrantyYears} años de garantía
                    </span>
                  </div>

                  <h3 className="font-headline text-xl font-bold text-ink mb-3">{service.title}</h3>
                  <p className="text-[15px] text-muted leading-relaxed mb-6">{service.shortDesc}</p>

                  <ul className="space-y-2.5 mb-8">
                    {service.features.slice(0, 2).map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-[13.5px] text-graphite leading-snug">
                        <Check size={15} strokeWidth={2.2} className="text-ink shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5 border-t border-line flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedService(service)}
                      className="text-[13px] font-semibold text-muted hover:text-ink transition-colors"
                    >
                      Ver ficha técnica
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
      </div>

      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        maxWidth="max-w-xl"
        label="Ficha técnica del servicio"
      >
        {selectedService && (
          <div className="p-7 sm:p-9">
            <div className="flex items-center gap-4 pb-6 mb-6 border-b border-line pr-10">
              <div className="w-12 h-12 rounded-2xl bg-ink text-white flex items-center justify-center shrink-0">
                <selectedService.icon size={22} strokeWidth={1.6} />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Ficha técnica</div>
                <h3 className="font-headline text-2xl font-bold text-ink">{selectedService.title}</h3>
              </div>
            </div>

            <p className="text-[15px] text-muted leading-relaxed mb-7">{selectedService.shortDesc}</p>

            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink mb-3">Qué incluye</h4>
            <ul className="space-y-3 mb-7">
              {selectedService.features.map((feat) => (
                <li key={feat} className="flex items-start gap-3 text-sm text-graphite leading-snug">
                  <Check size={16} strokeWidth={2.2} className="text-ink shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink mb-3">Materiales</h4>
            <div className="flex flex-wrap gap-2 mb-7">
              {selectedService.materials.map((mat) => (
                <span key={mat} className="text-[13px] font-medium px-3 py-1.5 rounded-full bg-mist text-graphite">
                  {mat}
                </span>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-paper ring-1 ring-line mb-8">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted mb-1">Ideal para</div>
              <div className="text-sm text-ink">{selectedService.recommendedFor}</div>
              <div className="text-sm text-ink mt-2">
                Garantía escrita de <strong>{selectedService.warrantyYears} años</strong>.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={waLink(`Hola AquaTech, quiero un presupuesto de ${selectedService.title.toLowerCase()}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full bg-ink text-white text-sm font-semibold hover:bg-graphite transition-colors"
              >
                <WhatsAppIcon size={17} /> Pedir presupuesto
              </a>
              <button
                type="button"
                onClick={() => {
                  onSelectServiceForQuote(selectedService.title);
                  setSelectedService(null);
                }}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full ring-1 ring-line text-sm font-semibold text-ink hover:bg-mist transition-colors"
              >
                <Calculator size={16} strokeWidth={1.8} /> Calcular m²
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};
