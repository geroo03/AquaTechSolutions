import React from 'react';
import { Building2, UserRound, House, Check, X, MapPin, CalendarRange, ReceiptText } from 'lucide-react';
import { MAINTENANCE_PLAN as PLAN } from '../data/mantenimiento';
import { WhatsAppIcon } from './Brand';
import { Reveal, SectionHeader, waLink } from './ui';

const BENEFIT_ICONS = { inmobiliaria: Building2, propietario: UserRound, casa: House } as const;
const CONDITION_ICONS = [MapPin, CalendarRange, ReceiptText];

export const MaintenancePlanSection: React.FC = () => (
  <section className="py-24 lg:py-32 bg-white" id="inmobiliarias">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
      <div className="mb-14">
        <SectionHeader eyebrow="Inmobiliarias" title={PLAN.title} description={PLAN.subtitle} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLAN.benefits.map((b, i) => {
          const Icon = BENEFIT_ICONS[b.id as keyof typeof BENEFIT_ICONS];
          return (
            <Reveal key={b.id} delay={i * 0.06} className="h-full">
              <div className="h-full p-7 rounded-3xl bg-paper ring-1 ring-line">
                <div className="w-12 h-12 mb-6 rounded-2xl bg-ink text-white flex items-center justify-center">
                  <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                </div>
                <h3 className="font-headline text-lg font-bold text-ink">{b.title}</h3>
                <p className="mt-2 text-[15px] text-muted leading-relaxed">{b.text}</p>
              </div>
            </Reveal>
          );
        })}
      </div>

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
          <div className="h-full flex flex-col gap-5">
            <div className="p-7 rounded-3xl bg-paper ring-1 ring-line">
              <h3 className="flex items-center gap-2.5 font-headline text-lg font-bold text-ink">
                <X size={18} strokeWidth={2.2} aria-hidden="true" /> No incluye
              </h3>
              <p className="mt-3 text-[15px] text-graphite leading-relaxed">{PLAN.excludes}</p>
              <p className="mt-3 text-[15px] text-graphite leading-relaxed">{PLAN.materialsNote}</p>
            </div>

            <div className="p-7 rounded-3xl bg-paper ring-1 ring-line">
              <h3 className="font-headline text-lg font-bold text-ink">Condiciones</h3>
              <ul className="mt-4 space-y-3">
                {PLAN.conditions.map((c, i) => {
                  const Icon = CONDITION_ICONS[i] ?? Check;
                  return (
                    <li key={c} className="flex items-start gap-3 text-[15px] text-graphite leading-snug">
                      <Icon size={18} strokeWidth={1.8} className="mt-0.5 shrink-0 text-ink" aria-hidden="true" />
                      {c}
                    </li>
                  );
                })}
              </ul>
            </div>

            <a
              href={waLink(PLAN.whatsappText)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-center gap-2.5 py-4 px-7 rounded-full bg-ink text-white text-[15px] font-semibold hover:bg-graphite transition-colors"
            >
              <WhatsAppIcon size={18} /> {PLAN.cta}
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
