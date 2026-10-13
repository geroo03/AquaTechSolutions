import React, { useState, useEffect } from 'react';
import { Menu, X, Calculator, Camera } from 'lucide-react';
import { Logo, WhatsAppIcon } from './Brand';
import { waLink } from './ui';

interface HeaderProps {
  onOpenQuote: () => void;
  onOpenDiagnostic: () => void;
}

const NAV_LINKS = [
  { label: 'Servicios', id: 'servicios' },
  { label: 'Trabajos', id: 'trabajos' },
  { label: 'Proceso', id: 'proceso' },
  { label: 'Garantía', id: 'garantia' },
  { label: 'Zonas', id: 'zonas' },
  { label: 'Preguntas', id: 'preguntas' },
];

export const Header: React.FC<HeaderProps> = ({ onOpenQuote, onOpenDiagnostic }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Marca en el menú la sección que ocupa el centro de la pantalla
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['inicio', ...NAV_LINKS.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  const solid = isScrolled || mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid ? 'bg-white border-b border-line' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="h-[72px] max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-6">
        <a href="#inicio" aria-label="AquaTech Solutions, inicio" className="shrink-0">
          <Logo tone={solid ? 'dark' : 'light'} />
        </a>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Secciones">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`relative px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                  solid
                    ? isActive ? 'text-ink' : 'text-muted hover:text-ink'
                    : isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-3.5 right-3.5 -bottom-0.5 h-px transition-opacity ${
                    solid ? 'bg-ink' : 'bg-white'
                  } ${isActive ? 'opacity-100' : 'opacity-0'}`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenQuote}
            className={`hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-full text-[13px] font-semibold transition-colors ${
              solid ? 'text-ink hover:bg-mist' : 'text-white hover:bg-white/10'
            }`}
          >
            <Calculator size={16} strokeWidth={1.9} />
            Cotizador
          </button>

          <a
            href={waLink('Hola AquaTech, quiero pedir un presupuesto de impermeabilización')}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 h-10 px-4 sm:px-5 rounded-full text-[13px] font-semibold transition-all ${
              solid ? 'bg-ink text-white hover:bg-graphite' : 'bg-white text-ink hover:bg-white/90'
            }`}
          >
            <WhatsAppIcon size={16} />
            <span className="hidden sm:inline">Pedí presupuesto</span>
            <span className="sm:hidden">Consultar</span>
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              solid ? 'text-ink hover:bg-mist' : 'text-white hover:bg-white/10'
            }`}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-line px-5 sm:px-8 pb-6 pt-3 animate-fade-in">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3.5 text-base font-medium text-ink border-b border-line last:border-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="inline-flex items-center justify-center gap-2 h-11 rounded-full border border-line text-sm font-semibold text-ink"
            >
              <Calculator size={16} /> Cotizador
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDiagnostic();
              }}
              className="inline-flex items-center justify-center gap-2 h-11 rounded-full border border-line text-sm font-semibold text-ink"
            >
              <Camera size={16} /> Enviar fotos
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
