import React from 'react';
import { Zap } from 'lucide-react';
import { WORK_PROCESS } from '../data/mockData';
import { WhatsAppIcon } from './Brand';
import { Reveal, SectionHeader, waLink } from './ui';

interface ProcessSectionProps {
  onOpenDiagnostic: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onOpenDiagnostic }) => {
  return (
    <section className="py-24 lg:py-32 bg-paper" id="proceso">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-16">
          <SectionHeader
            eyebrow="Cómo trabajamos"
            title="Cuatro pasos, sin vueltas"
            description="Un proceso claro, desde el primer mensaje hasta el trabajo terminado."
            center
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WORK_PROCESS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.step} delay={i * 0.08} className="h-full">
                <div className="relative h-full flex flex-col p-7 rounded-3xl bg-white ring-1 ring-line">
                  <div className="flex items-center justify-between mb-8">
                    <div className="relative w-12 h-12 rounded-2xl bg-ink text-white flex items-center justify-center">
                      <Icon size={21} strokeWidth={1.7} />
                    </div>
                    <span className="font-headline text-4xl font-bold text-line select-none">0{step.step}</span>
                  </div>
                  <h3 className="font-headline text-lg font-bold text-ink leading-snug mb-3">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                  <div className="mt-auto pt-6 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-graphite">{step.tag}</span>
                    {step.step === '1' && (
                      <button
                        onClick={onOpenDiagnostic}
                        className="text-[12px] font-semibold text-ink underline underline-offset-4 decoration-silver hover:decoration-ink transition-colors"
                      >
                        Empezar
                      </button>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-ink text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center shrink-0">
                <Zap size={21} strokeWidth={1.7} />
              </div>
              <div>
                <div className="font-headline text-lg font-bold">¿Tenés una gotera ahora mismo?</div>
                <div className="text-sm text-white/60 mt-0.5">Mandanos fotos por WhatsApp y te decimos cómo seguir.</div>
              </div>
            </div>
            <a
              href={waLink('URGENTE: tengo una gotera activa en este momento, necesito asistencia')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white text-ink text-sm font-semibold hover:bg-white/90 transition-colors shrink-0"
            >
              <WhatsAppIcon size={17} /> Escribinos ahora
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
