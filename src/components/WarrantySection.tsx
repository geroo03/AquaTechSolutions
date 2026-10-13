import React from 'react';
import { Award, ClipboardCheck, Headset, ArrowUpRight } from 'lucide-react';
import { CERTIFICATE_DATA } from '../data/mockData';
import { LogoMark, WhatsAppIcon } from './Brand';
import { IconTile, Reveal, SectionHeader, waLink } from './ui';

interface WarrantySectionProps {
  onOpenWarrantyModal: () => void;
}

const BADGES = [
  { icon: Award, title: 'Hasta 10 años', text: 'De cobertura escrita' },
  { icon: ClipboardCheck, title: 'Primeras marcas', text: 'Sika, Megaflex, Ormiflex' },
  { icon: Headset, title: 'Respaldo post-obra', text: 'Seguimiento directo' },
];

export const WarrantySection: React.FC<WarrantySectionProps> = ({ onOpenWarrantyModal }) => {
  return (
    <section className="relative overflow-hidden py-24 lg:py-32 bg-ink text-white" id="garantia">
      <div className="absolute inset-0 bg-dots pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        <div className="lg:col-span-7">
          <SectionHeader
            tone="light"
            eyebrow="Garantía"
            title="Tranquilidad total, con respaldo por escrito"
            description="No hacemos parches provisorios. Trabajamos con materiales normalizados de primera marca y cada obra terminada se entrega con su certificado de garantía firmado."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">
            {BADGES.map(({ icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.06} className="h-full">
                <div className="h-full p-5 rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
                  <IconTile icon={icon} tone="light" size="sm" />
                  <div className="mt-4 text-sm font-semibold">{title}</div>
                  <div className="text-[13px] text-white/55 mt-0.5">{text}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href={waLink('Hola AquaTech, quiero conocer los términos de la garantía escrita')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 py-3.5 px-7 rounded-full bg-white text-ink text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              <WhatsAppIcon size={17} /> Consultar por la garantía
            </a>
            <button
              type="button"
              onClick={onOpenWarrantyModal}
              className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full ring-1 ring-white/25 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Ver certificado modelo
            </button>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5" delay={0.1}>
          <button
            type="button"
            onClick={onOpenWarrantyModal}
            className="group w-full text-left bg-white text-ink rounded-[28px] p-7 sm:p-9 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-line">
              <div className="flex items-center gap-3">
                <LogoMark size={30} />
                <div>
                  <div className="font-headline text-[15px] font-bold tracking-[0.04em]">AQUATECH</div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Certificado de garantía</div>
                </div>
              </div>
              <ArrowUpRight size={20} className="text-muted group-hover:text-ink transition-colors" />
            </div>

            <dl className="divide-y divide-line text-sm">
              {[
                ['Certificado', CERTIFICATE_DATA.policyNumber],
                ['Normativa', CERTIFICATE_DATA.standards],
                ['Estanqueidad', 'Prueba aprobada'],
                ['Plazo', CERTIFICATE_DATA.coveragePeriod],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-3.5">
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-semibold text-right">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 p-4 rounded-2xl bg-paper text-[13px] text-muted leading-relaxed">
              Documento que se entrega al terminar cada obra. Tocá para ver el modelo completo.
            </p>
          </button>
        </Reveal>
      </div>
    </section>
  );
};
