import React, { useState } from 'react';
import { FAQS } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesQuery = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section className="w-full py-20 lg:py-24 bg-white" id="preguntas">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#cde5ff] text-[#001d32] text-xs font-bold uppercase tracking-wider mb-3">
            Dudas Comunes
          </div>
          <h2 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl lg:text-4xl text-[#00263f] font-bold">
            Preguntas Frecuentes
          </h2>
          <p className="text-base sm:text-lg text-[#42474e] mt-2">
            Todo lo que necesitás saber antes de contratar el servicio.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#72777e] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por goteras, membrana, garantía, costo..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#cbd5e1] focus:border-[#4cb2ff] focus:ring-2 focus:ring-[#4cb2ff]/20 text-xs sm:text-sm text-[#0f172a] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#72777e] hover:text-[#00263f]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {[
              { id: 'all', label: 'Todas las dudas' },
              { id: 'costos', label: 'Precios & Cotización' },
              { id: 'sistemas', label: 'Sistemas & Materiales' },
              { id: 'garantia', label: 'Garantía Escrita' },
              { id: 'consorcios', label: 'Edificios & Consorcios' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#00263f] text-white shadow-xs'
                    : 'bg-[#f2f4f6] text-[#42474e] hover:bg-[#e2e8f0]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-[#72777e] text-sm">
              No encontramos respuestas para "{searchQuery}". Intentá con otra palabra o consultanos directamente por WhatsApp.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="rounded-xl bg-[#f7f9fb] border border-[#e2e8f0] overflow-hidden transition-all duration-200"
                >
                  <button 
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus-visible:bg-[#eceef0]" 
                    type="button"
                  >
                    <span className="font-['Montserrat',sans-serif] text-sm sm:text-base text-[#00263f] font-semibold pr-4">
                      {faq.question}
                    </span>
                    <span 
                      className={`material-symbols-outlined text-[#006399] transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-[#42474e] text-xs sm:text-sm leading-relaxed border-t border-[#eceef0]/60 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
