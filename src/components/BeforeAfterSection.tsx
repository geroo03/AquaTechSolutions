import React, { useRef, useState } from 'react';
import { ArrowUpRight, ChevronsLeftRight, Check, ChevronDown } from 'lucide-react';
import { CASE_STUDIES } from '../data/mockData';
import { Reveal, SectionHeader, waLink } from './ui';

interface ComparisonSliderProps {
  beforeImg: string;
  afterImg: string;
  beforeAlt: string;
  afterAlt: string;
}

/** Comparador antes/después. El "antes" se recorta con clip-path, así ninguna foto se deforma. */
const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ beforeImg, afterImg, beforeAlt, afterAlt }) => {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const moveTo = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5));
    if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden select-none cursor-ew-resize touch-pan-y bg-mist"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
      role="slider"
      tabIndex={0}
      aria-label="Comparar antes y después"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
    >
      <img src={afterImg} alt={afterAlt} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />
      <img
        src={beforeImg}
        alt={beforeAlt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />

      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-ink/80 backdrop-blur text-white text-[11px] font-semibold uppercase tracking-[0.18em]">
        Antes
      </span>
      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-ink text-[11px] font-semibold uppercase tracking-[0.18em]">
        Después
      </span>

      <div className="absolute inset-y-0 w-0.5 bg-white pointer-events-none" style={{ left: `calc(${pos}% - 1px)` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-ink shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex items-center justify-center">
          <ChevronsLeftRight size={20} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};

export const BeforeAfterSection: React.FC = () => {
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  return (
    <section className="py-24 lg:py-32 bg-white" id="trabajos">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-14">
          <SectionHeader
            eyebrow="Trabajos realizados"
            title="Resultados que se ven: antes y después"
            description="Deslizá cada imagen para comparar el estado inicial con el trabajo terminado."
          />
        </div>

        <div className="space-y-6">
          {CASE_STUDIES.map((item) => {
            const isOpen = expandedCase === item.id;
            return (
              <Reveal key={item.id}>
                <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-4 sm:p-6 lg:p-8 rounded-[28px] bg-paper ring-1 ring-line">
                  <div className="lg:col-span-7">
                    <ComparisonSlider
                      beforeImg={item.beforeImg}
                      afterImg={item.afterImg}
                      beforeAlt={item.beforeCaption}
                      afterAlt={item.afterCaption}
                    />
                  </div>

                  <div className="lg:col-span-5 flex flex-col px-2 pb-2 lg:px-0 lg:py-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted mb-3">
                      <span className="text-ink whitespace-nowrap">Obra {item.number}</span>
                      <span className="h-px w-6 bg-silver" />
                      <span>{item.location}</span>
                    </div>

                    <h3 className="font-headline text-2xl sm:text-[28px] font-bold text-ink leading-tight mb-4">
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-muted leading-relaxed mb-7">{item.system}</p>

                    <dl className="grid grid-cols-2 gap-px rounded-2xl overflow-hidden bg-line ring-1 ring-line mb-6">
                      {[
                        ['Superficie', item.surface],
                        ['Garantía', item.warranty],
                        ['Tiempo de obra', item.time],
                        ['Resultado', item.status],
                      ].map(([label, value]) => (
                        <div key={label} className="bg-white p-4">
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</dt>
                          <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
                        </div>
                      ))}
                    </dl>

                    {isOpen && (
                      <ul className="space-y-2.5 mb-6 animate-fade-in">
                        {item.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2.5 text-[13.5px] text-graphite leading-snug">
                            <Check size={15} strokeWidth={2.2} className="text-ink shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3">
                      <a
                        href={waLink(`Hola AquaTech, quiero un trabajo similar al de ${item.title}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 h-11 px-5 rounded-full bg-ink text-white text-[13px] font-semibold hover:bg-graphite transition-colors"
                      >
                        Quiero algo así
                        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setExpandedCase(isOpen ? null : item.id)}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink transition-colors"
                        aria-expanded={isOpen}
                      >
                        {isOpen ? 'Ocultar el paso a paso' : 'Ver el paso a paso'}
                        <ChevronDown size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
