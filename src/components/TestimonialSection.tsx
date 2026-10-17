import React from 'react';
import { ArrowUpRight, Quote } from 'lucide-react';
import { GOOGLE_REVIEW_URL, TESTIMONIAL } from '../data/mockData';
import { Eyebrow, Reveal } from './ui';

/** Una sola reseña real (autorizada). Cuando haya reseñas de Google, sumarlas acá. */
export const TestimonialSection: React.FC = () => (
  <section className="py-24 lg:py-28 bg-paper" id="opiniones">
    <Reveal className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
      <Eyebrow center>Opiniones</Eyebrow>
      <figure className="mt-6">
        <Quote size={40} strokeWidth={1.4} className="mx-auto text-silver" aria-hidden="true" />
        <blockquote className="mt-6 font-headline text-2xl sm:text-3xl lg:text-[38px] font-semibold text-ink leading-snug">
          “{TESTIMONIAL.quote}”
        </blockquote>
        <figcaption className="mt-8 flex flex-col items-center gap-1">
          <span className="text-base font-semibold text-ink">{TESTIMONIAL.author}</span>
          <span className="text-[13px] text-muted">{TESTIMONIAL.source}</span>
        </figcaption>
      </figure>
      <div className="mt-10 pt-8 border-t border-line">
        <p className="text-sm text-muted">¿Hicimos un trabajo para vos? Contanos cómo fue.</p>
        <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-full ring-1 ring-line bg-white text-sm font-semibold hover:bg-mist transition-colors">Dejar una reseña en Google <ArrowUpRight size={16} /></a>
      </div>
    </Reveal>
  </section>
);
