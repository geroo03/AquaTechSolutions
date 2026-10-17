import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { WORKS, FOUNDED_YEAR, SQUARE_METERS, INSTAGRAM_URL } from '../data/mockData';
import { InstagramIcon } from './Brand';
import { Reveal, SectionHeader } from './ui';
import { GREENVILLE_PATH } from '../routes';

/**
 * Trabajos realizados: obras reales con link al posteo de Instagram.
 * Cuando lleguen las fotos originales de antes y después, se puede volver a sumar el comparador
 * (está en el historial de git, componente ComparisonSlider).
 */
export const BeforeAfterSection: React.FC = () => {
  const stats = [
    ['Desde', String(FOUNDED_YEAR), 'Impermeabilizando en Córdoba'],
    ['Trabajados', `+${SQUARE_METERS}`, 'De techos, terrazas y superficies'],
    ['Garantía', 'Hasta 10 años', 'Según el sistema'],
  ];

  return (
    <section className="py-24 lg:py-32 bg-white" id="trabajos">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-14">
          <SectionHeader
            eyebrow="Trabajos realizados"
            title="Obras reales, en toda Córdoba"
            description="Algunos de los trabajos que hicimos. En cada uno podés ver las fotos y videos de la obra en nuestro Instagram."
          />
        </div>

        <Reveal>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-3xl overflow-hidden bg-line ring-1 ring-line mb-6">
            {stats.map(([label, value, text]) => (
              <div key={label} className="bg-white p-6 sm:p-7">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</dt>
                <dd className="mt-2 font-headline text-3xl sm:text-[34px] font-bold text-ink leading-none">{value}</dd>
                <dd className="mt-2 text-[13.5px] text-muted">{text}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {WORKS.map((work, i) => (
            <Reveal key={work.id} delay={(i % 3) * 0.06} className="h-full">
              <a
                href={work.id === 'greenville' ? `.${GREENVILLE_PATH}` : work.url}
                target={work.id === 'greenville' ? undefined : '_blank'}
                rel={work.id === 'greenville' ? undefined : 'noopener noreferrer'}
                className="group h-full flex flex-col p-7 rounded-3xl bg-paper ring-1 ring-line hover:ring-ink/25 hover:bg-white hover:shadow-[0_24px_48px_-24px_rgba(11,11,12,0.25)] transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{work.date}</span>
                  <span className="w-9 h-9 rounded-full bg-white ring-1 ring-line text-ink flex items-center justify-center group-hover:bg-ink group-hover:text-white group-hover:ring-ink transition-colors">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
                <h3 className="font-headline text-xl font-bold text-ink leading-snug">{work.place}</h3>
                <p className="mt-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-graphite">{work.type}</p>
                {work.detail && <p className="mt-4 text-[15px] text-muted leading-relaxed">{work.detail}</p>}
                <span className="mt-auto pt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-ink">
                  {work.id === 'greenville' ? <>Conocer la obra <ArrowUpRight size={15} /></> : <><InstagramIcon size={15} /> Ver la obra en Instagram</>}
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex justify-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full ring-1 ring-line text-sm font-semibold text-ink hover:bg-mist transition-colors"
          >
            <InstagramIcon size={17} /> Ver todas las obras en Instagram
          </a>
        </Reveal>
      </div>
    </section>
  );
};
