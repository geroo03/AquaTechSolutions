import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { PHONE_NUMBER } from '../data/mockData';

/** Link de WhatsApp con mensaje precargado */
export const waLink = (text: string) => `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;

/** Etiqueta superior de sección, con la línea fina del logo */
export const Eyebrow: React.FC<{ children: React.ReactNode; tone?: 'dark' | 'light'; center?: boolean }> = ({
  children,
  tone = 'dark',
  center = false,
}) => (
  <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
    <span className={`h-px w-8 ${tone === 'dark' ? 'bg-ink' : 'bg-white/60'}`} />
    <span
      className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${
        tone === 'dark' ? 'text-graphite' : 'text-white/75'
      }`}
    >
      {children}
    </span>
    {center && <span className={`h-px w-8 ${tone === 'dark' ? 'bg-ink' : 'bg-white/60'}`} />}
  </div>
);

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  center?: boolean;
  tone?: 'dark' | 'light';
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, description, center, tone = 'dark' }) => (
  <Reveal className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
    <Eyebrow tone={tone} center={center}>{eyebrow}</Eyebrow>
    <h2
      className={`font-headline text-3xl sm:text-4xl lg:text-[44px] font-bold leading-[1.1] ${
        tone === 'dark' ? 'text-ink' : 'text-white'
      }`}
    >
      {title}
    </h2>
    {description && (
      <p className={`mt-4 text-base sm:text-lg leading-relaxed ${tone === 'dark' ? 'text-muted' : 'text-white/70'}`}>
        {description}
      </p>
    )}
  </Reveal>
);

/**
 * Aparición suave al entrar en pantalla. Solo se oculta si hay JavaScript
 * (clase `js` en <html>, ver index.html), así el HTML pre-renderizado se lee igual sin JS.
 */
export const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  label: string;
}

/** Contenedor de modal: cierra con Esc o tocando afuera, y bloquea el scroll de fondo */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, maxWidth = 'max-w-2xl', label }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6 bg-ink/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      data-origen={label}
    >
      <div
        className={`relative w-full ${maxWidth} max-h-[92vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-pop-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-mist text-graphite hover:bg-line hover:text-ink flex items-center justify-center transition-colors"
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
};

/** Ícono dentro de un cuadrado con borde, usado en tarjetas */
export const IconTile: React.FC<{ icon: React.ElementType; tone?: 'dark' | 'light'; size?: 'sm' | 'md' }> = ({
  icon: Icon,
  tone = 'dark',
  size = 'md',
}) => (
  <div
    className={`${size === 'md' ? 'w-12 h-12' : 'w-10 h-10'} shrink-0 rounded-xl flex items-center justify-center ${
      tone === 'dark' ? 'bg-ink text-white' : 'bg-white/10 text-white ring-1 ring-white/15'
    }`}
  >
    <Icon size={size === 'md' ? 22 : 19} strokeWidth={1.75} />
  </div>
);

/** Select con la misma estética que los campos de texto */
export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }> = ({
  options,
  className = '',
  ...props
}) => (
  <span className={`relative block ${className}`}>
    <select
      {...props}
      className="w-full h-12 pl-4 pr-10 rounded-2xl bg-paper ring-1 ring-line text-sm text-ink outline-none focus:ring-2 focus:ring-ink appearance-none cursor-pointer"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
  </span>
);
