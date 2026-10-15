import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { FAQS } from '../data/mockData';
import { SectionHeader } from './ui';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  return (
    <section className="py-24 lg:py-32 bg-paper" id="preguntas">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="mb-12">
          <SectionHeader eyebrow="Preguntas frecuentes" title="Todo lo que necesitás saber" center />
        </div>

        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id}>
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full py-6 flex items-center justify-between gap-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-headline text-base sm:text-lg font-semibold text-ink">{faq.question}</span>
                  <span
                    className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen ? 'bg-ink text-white rotate-45' : 'bg-mist text-ink'
                    }`}
                  >
                    <Plus size={16} />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-12 text-[15px] text-muted leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
