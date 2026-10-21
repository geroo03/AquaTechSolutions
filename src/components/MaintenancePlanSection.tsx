import React, { useState } from 'react';
import { Building2, CalendarCheck, Check, Gift, Percent, Plus, Users, X } from 'lucide-react';
import { MAINTENANCE_PLAN as PLAN } from '../data/mantenimiento';
import { WhatsAppIcon } from './Brand';
import { Reveal, SectionHeader, waLink } from './ui';

const HIGHLIGHT_ICONS = { anual: Gift, descuento: Percent, cupo: Users } as const;

/** Plan de Mantenimiento: textos del contrato 1.0 (src/data/mantenimiento.ts). Sin precios. */
export const MaintenancePlanSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="py-24 lg:py-32 bg-white" id="plan-mantenimiento">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-14">
          <SectionHeader eyebrow="Abono mensual" title={PLAN.title} description={PLAN.subtitle} />
          <Reveal>
            <p className="mt-4 max-w-2xl text-[15px] text-graphite leading-relaxed">{PLAN.intro}</p>
          </Reveal>
        </div>

        {/* destacados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLAN.highlights.map((h, i) => {
            const Icon = HIGHLIGHT_ICONS[h.id as keyof typeof HIGHLIGHT_ICONS];
            return (
              <Reveal key={h.id} delay={i * 0.06} className="h-full">
                <div className="h-full p-7 rounded-3xl bg-paper ring-1 ring-line">
                  <div className="w-12 h-12 mb-6 rounded-2xl bg-ink text-white flex items-center justify-center">
                    <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                  </div>
                  <h3 className="font-headline text-lg font-bold text-ink leading-snug">{h.title}</h3>
                  <p className="mt-2 text-[15px] text-muted leading-relaxed">{h.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* incluye / no incluye */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <Reveal className="lg:col-span-7">
            <div className="h-full p-7 sm:p-9 rounded-3xl bg-ink text-white">
              <h3 className="font-headline text-xl font-bold">Qué incluye, por vivienda y por mes</h3>
              <ul className="mt-6 space-y-4">
                {PLAN.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-white/90">
                    <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-white text-ink flex items-center justify-center">
                      <Check size={13} strokeWidth={2.6} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.08}>
            <div className="h-full p-7 rounded-3xl bg-paper ring-1 ring-line">
              <h3 className="flex items-center gap-2.5 font-headline text-lg font-bold text-ink">
                <X size={18} strokeWidth={2.2} aria-hidden="true" /> No incluye
              </h3>
              <ul className="mt-4 space-y-2">
                {PLAN.excludes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14.5px] text-graphite leading-snug">
                    <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-graphite" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 pt-4 border-t border-line text-[13.5px] text-muted leading-relaxed">{PLAN.visualNote}</p>
            </div>
          </Reveal>
        </div>

        {/* pago e inmobiliarias */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          <Reveal className="lg:col-span-7">
            <div className="h-full p-7 sm:p-9 rounded-3xl bg-paper ring-1 ring-line">
              <h3 className="flex items-center gap-2.5 font-headline text-lg font-bold text-ink">
                <CalendarCheck size={19} strokeWidth={1.8} aria-hidden="true" /> Cómo se paga
              </h3>
              <ul className="mt-4 space-y-3">
                {PLAN.payment.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-graphite leading-snug">
                    <Check size={16} strokeWidth={2.2} className="mt-0.5 shrink-0 text-ink" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[13.5px] text-muted">
                El precio del abono no se publica porque se ajusta cada 3 meses: pedilo por WhatsApp.
              </p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.08}>
            <div className="h-full flex flex-col p-7 rounded-3xl bg-white ring-1 ring-ink/20">
              <h3 className="flex items-center gap-2.5 font-headline text-lg font-bold text-ink">
                <Building2 size={19} strokeWidth={1.8} aria-hidden="true" /> {PLAN.agencies.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {PLAN.agencies.points.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-graphite leading-snug">
                    <Check size={16} strokeWidth={2.2} className="mt-0.5 shrink-0 text-ink" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={waLink(PLAN.agencies.whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                data-origen="Plan de Mantenimiento: inmobiliarias"
                className="mt-6 lg:mt-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full ring-1 ring-ink text-ink text-sm font-semibold hover:bg-mist transition-colors"
              >
                <WhatsAppIcon size={17} /> {PLAN.agencies.cta}
              </a>
            </div>
          </Reveal>
        </div>

        {/* letra chica + botón principal */}
        <Reveal className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-muted" aria-label="Condiciones">
            {PLAN.smallPrint.map((t, i) => (
              <li key={t} className="flex items-center gap-4">
                {i > 0 && <span aria-hidden="true">·</span>}
                {t}
              </li>
            ))}
          </ul>
          <a
            href={waLink(PLAN.whatsappText)}
            target="_blank"
            rel="noopener noreferrer"
            data-origen="Plan de Mantenimiento"
            className="shrink-0 inline-flex items-center justify-center gap-2.5 py-4 px-7 rounded-full bg-ink text-white text-[15px] font-semibold hover:bg-graphite transition-colors"
          >
            <WhatsAppIcon size={18} /> {PLAN.cta}
          </a>
        </Reveal>

        {/* preguntas del plan */}
        <Reveal className="mt-16">
          <h3 className="font-headline text-2xl font-bold text-ink mb-6">Preguntas sobre el plan</h3>
          <div className="divide-y divide-line border-y border-line">
            {PLAN.faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id}>
                  <h4>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className="w-full py-5 flex items-center justify-between gap-6 text-left"
                      aria-expanded={isOpen}
                      aria-controls={`${faq.id}-respuesta`}
                    >
                      <span className="font-headline text-base font-semibold text-ink">{faq.question}</span>
                      <span
                        className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen ? 'bg-ink text-white rotate-45' : 'bg-mist text-ink'
                        }`}
                      >
                        <Plus size={16} aria-hidden="true" />
                      </span>
                    </button>
                  </h4>
                  <div
                    id={`${faq.id}-respuesta`}
                    className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 pr-12 text-[15px] text-muted leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
