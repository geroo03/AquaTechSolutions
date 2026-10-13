import React, { useState } from 'react';
import { TESTIMONIALS, PHONE_NUMBER } from '../data/mockData';

export const TestimonialsSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? TESTIMONIALS : TESTIMONIALS.slice(0, 3);

  return (
    <section className="w-full py-20 lg:py-24 bg-[#f2f4f6]" id="opiniones">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#cde5ff] text-[#001d32] text-xs font-bold uppercase tracking-wider mb-3">
            Experiencias Reales
          </div>
          <h2 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl lg:text-4xl text-[#00263f] font-bold">
            Lo que dicen quienes ya nos confiaron su techo
          </h2>
          <p className="text-base sm:text-lg text-[#42474e] mt-2">
            Opiniones reales de administradores, propietarios y arquitectos en Córdoba.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {displayedReviews.map((review) => (
            <div 
              key={review.id}
              className="p-8 rounded-2xl bg-white border border-[#e2e8f0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-0.5 text-[#F59E0B]">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-[#72777e]">{review.date}</span>
                </div>

                <p className="text-sm sm:text-base text-[#42474e] leading-relaxed mb-6 italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#f2f4f6]">
                <div className="font-['Montserrat',sans-serif] text-sm sm:text-base font-bold text-[#00263f]">
                  {review.name}
                </div>
                <div className="text-xs text-[#72777e] mt-0.5">
                  {review.role} — {review.location}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Button & Show More */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <a 
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-[#f7f9fb] text-[#00263f] font-semibold text-xs sm:text-sm border border-[#e2e8f0] shadow-sm transition-all" 
            href={`https://wa.me/${PHONE_NUMBER}?text=Hola%20AquaTech,%20quiero%20conocer%20m%C3%A1s%20referencias%20de%20obras`}
            rel="noopener noreferrer" 
            target="_blank"
          >
            <span className="material-symbols-outlined text-[#F59E0B] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star_rate
            </span>
            <span>Ver 84+ opiniones en Google Reviews (4.9 ★)</span>
          </a>

          {TESTIMONIALS.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-bold text-[#006399] hover:text-[#00263f] px-4 py-2 transition-colors"
            >
              {showAll ? 'Mostrar menos opiniones' : `Ver más testimonios (+${TESTIMONIALS.length - 3})`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
