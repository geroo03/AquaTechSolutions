import React from 'react';
import { WORK_PHOTOS } from '../data/mockData';
import { Reveal, SectionHeader } from './ui';

/** Fotos reales de obra. Mobile: una abajo de la otra; escritorio: una grande y dos al costado. */
export const WorkGallerySection: React.FC = () => {
  const [main, vertical, side] = WORK_PHOTOS;
  const photo = (p: (typeof WORK_PHOTOS)[number], className: string) => (
    <img
      src={p.src}
      alt={p.alt}
      width={p.width}
      height={p.height}
      loading="lazy"
      decoding="async"
      className={`w-full rounded-3xl object-cover bg-mist ${className}`}
    />
  );

  return (
    <section className="py-24 lg:py-32 bg-white" id="en-obra">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-12">
          <SectionHeader
            eyebrow="En obra"
            title="Así trabajamos en cada techo"
            description="Fotos reales de obras de AquaTech."
          />
        </div>

        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8">{photo(main, 'aspect-[4/3] h-full')}</div>
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {photo(vertical, 'aspect-[3/4] lg:aspect-auto lg:h-full object-[35%_center]')}
              {photo(side, 'aspect-[4/3]')}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
