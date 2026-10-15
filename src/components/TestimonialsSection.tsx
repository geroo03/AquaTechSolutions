import React, { useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';
import { Reveal, SectionHeader } from './ui';

export const TestimonialsSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? TESTIMONIALS : TESTIMONIALS.slice(0, 3);

  return (
    <section className="py-24 lg:py-32 bg-paper" id="opiniones">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-14">
          <SectionHeader
            eyebrow="Opiniones"
            title="Lo que dicen quienes ya nos confiaron su techo"
            center
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {displayedReviews.map((review, i) => (
            <Reveal key={review.id} delay={(i % 3) * 0.06} className="h-full">
              <figure className="h-full flex flex-col p-7 sm:p-8 rounded-3xl bg-white ring-1 ring-line">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-0.5" role="img" aria-label={`${review.rating} de 5 estrellas`}>
                    {Array.from({ length: review.rating }).map((_, s) => (
                      <Star key={s} size={16} className="fill-ink text-ink" />
                    ))}
                  </div>
                  <Quote size={22} className="text-silver" />
                </div>
                <blockquote className="text-[15px] text-graphite leading-relaxed mb-8">{review.comment}</blockquote>
                <figcaption className="mt-auto flex items-start gap-3 pt-5 border-t border-line">
                  <span className="w-10 h-10 rounded-full bg-ink text-white flex items-center justify-center font-headline text-sm font-bold shrink-0">
                    {review.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">{review.name}</span>
                    <span className="block text-[12.5px] text-muted">{review.role}</span>
                    <span className="block text-[12.5px] text-muted">{review.location}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          {TESTIMONIALS.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="h-11 px-6 rounded-full ring-1 ring-line bg-white text-[13px] font-semibold text-ink hover:bg-mist transition-colors"
            >
              {showAll ? 'Mostrar menos' : `Ver más opiniones (+${TESTIMONIALS.length - 3})`}
            </button>
          )}
          <p className="text-[12px] text-muted">Testimonios ilustrativos para esta demo.</p>
        </div>
      </div>
    </section>
  );
};
