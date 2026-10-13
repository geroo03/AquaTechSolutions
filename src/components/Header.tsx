import React, { useState, useEffect } from 'react';
import { ASSETS, PHONE_NUMBER, PHONE_DISPLAY } from '../data/mockData';

interface HeaderProps {
  onOpenQuote: () => void;
  onOpenDiagnostic: () => void;
  onOpenWarranty: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuote, onOpenDiagnostic, onOpenWarranty }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['inicio', 'servicios', 'trabajos', 'garantia', 'zonas', 'preguntas', 'contacto'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section === 'inicio' ? 'root' : section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Inicio', href: '#', id: 'inicio' },
    { label: 'Servicios', href: '#servicios', id: 'servicios' },
    { label: 'Trabajos', href: '#trabajos', id: 'trabajos' },
    { label: 'Garantía', href: '#garantia', id: 'garantia' },
    { label: 'Zonas', href: '#zonas', id: 'zonas' },
    { label: 'Preguntas', href: '#preguntas', id: 'preguntas' },
    { label: 'Contacto', href: '#contacto', id: 'contacto' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,0,0,0.06)]' 
          : 'bg-white/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <a href="#" className="flex items-center gap-3 shrink-0 focus-visible:outline-none">
          <img 
            alt="Logo AquaTech" 
            className="h-8 w-auto object-contain" 
            src={ASSETS.logo}
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-['Montserrat',sans-serif] text-xl font-bold text-[#00263f] leading-none tracking-tight">
              AquaTech
            </span>
            <span className="font-['Inter',sans-serif] text-[11px] font-bold text-[#006399] uppercase tracking-wider">
              Impermeabilizaciones
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`py-2 px-3 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0b3c5d] text-[#ffffff] shadow-sm'
                    : 'text-[#42474e] hover:text-[#00263f] hover:bg-[#eceef0]/60'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cotizador Button */}
          <button
            onClick={onOpenQuote}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#00263f] bg-[#cde5ff] hover:bg-[#95ccff] rounded-lg transition-colors shadow-sm"
            title="Calcular presupuesto online aproximado"
          >
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            <span>Cotizador</span>
          </button>

          {/* WhatsApp Primary Button */}
          <a
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white text-xs sm:text-sm font-semibold py-2.5 px-3.5 sm:px-4 rounded-lg shadow-[0_4px_12px_rgba(37,211,102,0.25)] transition-all shrink-0 hover:shadow-[0_6px_16px_rgba(37,211,102,0.35)]"
            href={`https://wa.me/${PHONE_NUMBER}?text=Hola%20AquaTech,%20quiero%20pedir%20un%20presupuesto%20para%20impermeabilizaci%C3%B3n`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[18px] text-white">chat</span>
            <span className="hidden sm:inline">Pedí presupuesto</span>
            <span className="sm:hidden">Consultar</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 rounded-lg bg-[#eceef0] text-[#00263f] flex items-center justify-center transition-colors hover:bg-[#e0e3e5]"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-[20px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#c2c7ce]/30 bg-white shadow-xl px-6 py-5 transition-all">
          <div className="flex flex-col gap-2 mb-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 text-sm font-semibold rounded-lg ${
                  activeSection === link.id
                    ? 'bg-[#0b3c5d] text-white'
                    : 'text-[#42474e] hover:bg-[#eceef0]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#eceef0]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#cde5ff] text-[#00263f] font-semibold text-xs rounded-lg"
            >
              <span className="material-symbols-outlined text-[16px]">calculate</span>
              <span>Cotizador Online</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDiagnostic();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#eceef0] text-[#00263f] font-semibold text-xs rounded-lg"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>Enviar Fotos</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
