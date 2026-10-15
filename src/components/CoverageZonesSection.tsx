import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { ZONES } from '../data/mockData';
import { ZoneItem } from '../types';
import { LogoMark, WhatsAppIcon } from './Brand';
import { Reveal, SectionHeader, waLink } from './ui';

/** Mapa esquemático de cobertura: anillos de distancia desde Córdoba Capital y un punto por localidad */
const CoverageMap: React.FC<{ selected: ZoneItem; onSelect: (z: ZoneItem) => void }> = ({ selected, onSelect }) => {
  const capital = ZONES[0];
  const mapped = ZONES.filter((z) => z.x !== undefined && z.y !== undefined);
  return (
    <div className="relative aspect-square w-full rounded-[28px] bg-ink overflow-hidden">
      <div className="absolute inset-0 bg-dots" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {[14, 28, 42].map((r) => (
          <circle key={r} cx={capital.x} cy={capital.y} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.25" strokeDasharray="0.8 1.2" />
        ))}
        {mapped.slice(1).map((z) => (
          <line
            key={z.id}
            x1={capital.x}
            y1={capital.y}
            x2={z.x}
            y2={z.y}
            stroke={z.id === selected.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.1)'}
            strokeWidth={z.id === selected.id ? 0.35 : 0.2}
          />
        ))}
      </svg>

      {mapped.map((z) => {
        const active = z.id === selected.id;
        const isCapital = z.id === capital.id;
        return (
          <button
            key={z.id}
            onClick={() => onSelect(z)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${z.x}%`, top: `${z.y}%` }}
            aria-label={z.name}
          >
            {isCapital ? (
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                  active ? 'bg-white text-ink scale-110' : 'bg-white/90 text-ink'
                }`}
              >
                <LogoMark size={18} />
              </span>
            ) : (
              <span
                className={`block rounded-full transition-all ${
                  active ? 'w-3.5 h-3.5 bg-white ring-4 ring-white/20' : 'w-2.5 h-2.5 bg-white/50 group-hover:bg-white'
                }`}
              />
            )}
            <span
              className={`absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-1.5 py-0.5 rounded bg-ink whitespace-nowrap text-[10.5px] font-semibold tracking-wide transition-colors ${
                active ? 'text-white' : 'text-white/55 group-hover:text-white/80'
              }`}
            >
              {z.name}
            </span>
          </button>
        );
      })}

      <div className="absolute left-5 top-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
        Provincia de Córdoba
      </div>
    </div>
  );
};

export const CoverageZonesSection: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<ZoneItem>(ZONES[0]);

  return (
    <section className="py-24 lg:py-32 bg-white" id="zonas">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <SectionHeader
            eyebrow="Zonas de cobertura"
            title="Toda Córdoba y provincias limítrofes"
            description="Trabajamos en toda la provincia de Córdoba y en las provincias que limitan con ella. En el mapa, algunos lugares donde ya hicimos obras."
          />

          <Reveal className="mt-8 flex flex-wrap gap-2">
            {ZONES.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`h-9 px-4 rounded-full text-[13px] font-medium transition-all ${
                    isSelected ? 'bg-ink text-white' : 'bg-mist text-graphite hover:bg-line'
                  }`}
                >
                  {zone.name}
                </button>
              );
            })}
          </Reveal>

          <Reveal className="mt-6">
            <div className="p-6 rounded-3xl bg-paper ring-1 ring-line">
              <div className="flex items-center gap-3 mb-5">
                <MapPin size={20} strokeWidth={1.7} className="text-ink" />
                <div>
                  <div className="font-headline text-lg font-bold text-ink leading-tight">{selectedZone.name}</div>
                  <div className="text-[13px] text-muted">{selectedZone.detail}</div>
                </div>
              </div>
              <a
                href={waLink(`Hola AquaTech, quiero consultar por un trabajo en ${selectedZone.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-ink text-white text-sm font-semibold hover:bg-graphite transition-colors"
              >
                <WhatsAppIcon size={17} /> Consultar por {selectedZone.name}
              </a>
            </div>
          </Reveal>

          <p className="mt-5 text-[13px] text-muted">
            La visita para medir puede tener un costo de viáticos según la distancia.
          </p>
        </div>

        <Reveal delay={0.1}>
          <CoverageMap selected={selectedZone} onSelect={setSelectedZone} />
        </Reveal>
      </div>
    </section>
  );
};
