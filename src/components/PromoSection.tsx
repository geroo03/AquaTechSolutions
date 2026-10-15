import React, { useEffect, useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { PROMO, isPromoActive } from '../data/promo';
import { WhatsAppIcon } from './Brand';
import { Eyebrow, Reveal, waLink } from './ui';

/**
 * Si la promo sigue vigente. Arranca con la fecha de compilación (igual en el pre-render y al hidratar,
 * así no hay diferencias) y después se corrige con la fecha real del navegador.
 */
export function usePromoActive() {
  const [active, setActive] = useState(() => isPromoActive(__BUILD_TIME__));
  useEffect(() => {
    if (!isPromoActive(Date.now())) setActive(false);
  }, []);
  return active;
}

export const PromoSection: React.FC = () => {
  const active = usePromoActive();
  if (!active) return null;

  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-silver-disc" id="promo" aria-label={PROMO.eyebrow}>
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal className="max-w-3xl">
          <Eyebrow>{PROMO.eyebrow}</Eyebrow>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-[48px] font-bold text-ink leading-[1.08]">
            {PROMO.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-graphite">{PROMO.subtitle}</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <Reveal className="lg:col-span-7">
            <div className="flex flex-wrap items-stretch gap-2 mb-4">
              <span className="px-4 py-2.5 rounded-full bg-ink text-white text-[12px] font-semibold uppercase tracking-[0.16em]">
                {PROMO.priceLabel}
              </span>
              <span className="px-4 py-2.5 rounded-full bg-white ring-1 ring-ink text-ink text-[12px] font-semibold uppercase tracking-[0.16em]">
                {PROMO.badge}
              </span>
            </div>

            <ul className="space-y-3">
              {PROMO.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between gap-6 p-5 sm:p-6 rounded-3xl bg-ink text-white shadow-[0_20px_40px_-24px_rgba(11,11,12,0.6)]"
                >
                  <span className="text-[15px] sm:text-base font-semibold leading-snug">{item.name}</span>
                  <span className="text-right shrink-0">
                    <span className="block font-headline text-3xl sm:text-4xl font-bold leading-none">{item.price}</span>
                    <span className="block mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                      {item.unit}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[13px] text-graphite">
              *{PROMO.note} Válido hasta el {PROMO.validUntilLabel}.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.1}>
            <div className="p-7 sm:p-9 rounded-[28px] bg-white ring-1 ring-line text-center">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">Tu especialista</div>
              <div className="mt-3 font-headline text-3xl font-bold text-ink leading-tight">{PROMO.specialist}</div>
              <div className="mx-auto mt-4 h-px w-16 bg-ink" />
              <p className="mt-4 text-[15px] text-graphite">{PROMO.specialistRole}</p>
              <a
                href={waLink(PROMO.whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-7 w-full inline-flex items-center justify-center gap-2.5 py-3.5 rounded-full bg-ink text-white text-sm font-semibold hover:bg-graphite transition-colors"
              >
                <WhatsAppIcon size={18} /> Quiero la promo
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <div className="mt-5 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
                <MapPin size={14} strokeWidth={1.8} /> Córdoba, Argentina
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
