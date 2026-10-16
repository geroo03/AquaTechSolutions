import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { ZONES, PRIVATE_NEIGHBORHOODS_NOTE } from '../data/mockData';
import { ZoneItem } from '../types';
import { MAP_HEIGHT, MAP_PINS, MAP_WIDTH, PROVINCES } from '../data/mapShapes';
import { WhatsAppIcon } from './Brand';
import { Reveal, SectionHeader, waLink } from './ui';

/** Ajustes a mano de las etiquetas que quedan sobre un borde (unidades del mapa) */
const LABEL_TWEAKS: Record<string, { dx?: number; dy?: number; size?: number }> = {
  'San Luis': { dx: -12, size: 22 },
  'Santa Fe': { dx: 22 },
  Catamarca: { dx: -8, size: 24 },
};

/** Mapa real de cobertura: Córdoba, provincias limítrofes y los lugares con obras */
const CoverageMap: React.FC<{ selected: ZoneItem; onSelect: (z: ZoneItem) => void }> = ({ selected, onSelect }) => {
  const capital = MAP_PINS.capital;
  const pins: { zone: ZoneItem; x: number; y: number }[] = [
    { zone: ZONES.find((z) => z.id === 'jesus-maria')!, ...MAP_PINS['jesus-maria'] },
    // Los countries de zona sur quedan pegados a la capital a esta escala: un punto apenas al sur
    { zone: ZONES.find((z) => z.id === 'zona-sur')!, x: capital.x + 8, y: capital.y + 38 },
  ];
  const capitalZone = ZONES.find((z) => z.id === 'capital')!;
  const cordoba = PROVINCES.find((p) => p.kind === 'main')!;
  const showNeighbors = selected.map === 'neighbors';
  const showProvince = selected.map === 'province';

  const fillFor = (kind: string) => {
    if (kind === 'main') return showProvince ? '#ffffff' : 'rgba(255,255,255,0.92)';
    if (kind === 'neighbor') return showNeighbors ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.13)';
    return 'rgba(255,255,255,0.03)';
  };
  const strokeFor = (kind: string) =>
    kind === 'context' ? 'rgba(255,255,255,0.12)' : kind === 'neighbor' ? 'rgba(255,255,255,0.45)' : '#ffffff';

  const pinButton = (zone: ZoneItem) => ({
    role: 'button',
    tabIndex: 0,
    'aria-label': zone.name,
    'aria-pressed': selected.id === zone.id,
    onClick: () => onSelect(zone),
    onKeyDown: (e: React.KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(zone)),
    className: 'cursor-pointer outline-none',
  });

  return (
    <div className="relative w-full rounded-[28px] bg-ink overflow-hidden ring-1 ring-ink">
      <div className="absolute inset-0 bg-dots" />
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="relative block w-full h-auto"
        role="img"
        aria-label="Mapa de cobertura: provincia de Córdoba y provincias limítrofes"
      >
        <g strokeLinejoin="round">
          {PROVINCES.map((p) => (
            <path
              key={p.name}
              d={p.d}
              fill={fillFor(p.kind)}
              stroke={strokeFor(p.kind)}
              strokeWidth={p.kind === 'main' ? 3 : 1.6}
              className="transition-[fill] duration-300"
            />
          ))}
        </g>

        {PROVINCES.filter((p) => p.kind === 'neighbor').map((p) => (
          <text
            key={p.name}
            x={p.labelX + (LABEL_TWEAKS[p.name]?.dx ?? 0)}
            y={p.labelY + (LABEL_TWEAKS[p.name]?.dy ?? 0)}
            textAnchor="middle"
            fontSize={LABEL_TWEAKS[p.name]?.size ?? 27}
            fontWeight="600"
            letterSpacing="1.5"
            fill={showNeighbors ? '#ffffff' : 'rgba(255,255,255,0.75)'}
            className="uppercase select-none pointer-events-none transition-[fill] duration-300"
          >
            {p.name}
          </text>
        ))}
        <text
          x={cordoba.labelX + 38}
          y={cordoba.labelY + 70}
          textAnchor="middle"
          fontSize="34"
          fontWeight="700"
          letterSpacing="2"
          fill="#0b0b0c"
          className="uppercase select-none pointer-events-none"
        >
          Córdoba
        </text>

        {pins.map(({ zone, x, y }) => {
          const active = selected.id === zone.id;
          return (
            <g key={zone.id} {...pinButton(zone)}>
              <circle cx={x} cy={y} r={active ? 20 : 0} fill="rgba(11,11,12,0.18)" className="transition-all duration-300" />
              <circle cx={x} cy={y} r={active ? 10 : 8} fill="#0b0b0c" stroke="#ffffff" strokeWidth="3" />
            </g>
          );
        })}
        <g {...pinButton(capitalZone)}>
          <circle cx={capital.x} cy={capital.y} r={selected.id === 'capital' ? 34 : 0} fill="rgba(11,11,12,0.16)" className="transition-all duration-300" />
          <circle cx={capital.x} cy={capital.y} r="21" fill="#0b0b0c" stroke="#ffffff" strokeWidth="3" />
          <path
            transform={`translate(${capital.x - 11} ${capital.y - 11}) scale(0.55)`}
            d="M20 4 L37 36 H28.6 L20 19.6 L11.4 36 H3 Z"
            fill="#ffffff"
          />
        </g>
      </svg>

      <div className="absolute left-4 top-4 sm:left-5 sm:top-5 px-3 py-1.5 rounded-full bg-ink/80 backdrop-blur text-[11px] font-semibold text-white">
        {selected.name}
      </div>
      <ul className="absolute left-4 bottom-4 sm:left-5 sm:bottom-5 flex flex-col gap-1.5 px-3 py-2.5 rounded-2xl bg-ink/80 backdrop-blur text-[11px] text-white/80">
        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-white" /> Provincia de Córdoba</li>
        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-white/25 ring-1 ring-white/50" /> Provincias limítrofes</li>
        <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-ink ring-2 ring-white" /> Obras realizadas</li>
      </ul>
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
            description="Trabajamos en toda la provincia de Córdoba y en las siete provincias que limitan con ella. En el mapa, algunos lugares donde ya hicimos obras."
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
            {PRIVATE_NEIGHBORHOODS_NOTE} La visita para medir puede tener un costo de viáticos según la distancia.
          </p>
        </div>

        <Reveal delay={0.1}>
          <CoverageMap selected={selectedZone} onSelect={setSelectedZone} />
        </Reveal>
      </div>
    </section>
  );
};
