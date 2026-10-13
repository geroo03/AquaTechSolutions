import React, { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { FAQS } from '../data/mockData';
import { SectionHeader } from './ui';

const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'costos', label: 'Precios' },
  { id: 'sistemas', label: 'Sistemas' },
  { id: 'garantia', label: 'Garantía' },
  { id: 'consorcios', label: 'Consorcios' },
];

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const q = searchQuery.trim().toLowerCase();
  const filteredFaqs = FAQS.filter(
    (faq) =>
      (activeCategory === 'all' || faq.category === activeCategory) &&
      (faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)),
  );

  return (
    <section className="py-24 lg:py-32 bg-white" id="preguntas">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="mb-12">
          <SectionHeader eyebrow="Preguntas frecuentes" title="Todo lo que necesitás saber" center />
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar: goteras, membrana, garantía, costo…"
              aria-label="Buscar en preguntas frecuentes"
              className="w-full pl-12 pr-12 py-3.5 rounded-full bg-paper ring-1 ring-line focus:ring-2 focus:ring-ink text-sm text-ink placeholder:text-muted outline-none transition-shadow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-mist"
                aria-label="Borrar búsqueda"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`h-9 px-4 rounded-full text-[13px] font-medium transition-colors ${
                  activeCategory === cat.id ? 'bg-ink text-white' : 'bg-mist text-graphite hover:bg-line'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-line border-y border-line">
          {filteredFaqs.length === 0 ? (
            <p className="text-center py-12 text-muted text-sm">
              No encontramos respuestas para “{searchQuery}”. Probá con otra palabra o consultanos por WhatsApp.
            </p>
          ) : (
            filteredFaqs.map((faq) => {
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
            })
          )}
        </div>
      </div>
    </section>
  );
};
