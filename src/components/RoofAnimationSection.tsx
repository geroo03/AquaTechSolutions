import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { Reveal, SectionHeader } from './ui';

/**
 * Animación del sistema de impermeabilización, paso a paso. Los 5 pasos son los del reel de Martín
 * "Cómo impermeabilizar tu techo" (Instagram, 23/06/2026). SVG + CSS, sin librerías.
 *
 * Fases: -1 techo viejo · 0..4 pasos · 5 terminado (llueve y no pasa nada).
 */
const STEPS = [
  { title: 'Retiramos el sistema viejo', text: 'Removemos por completo la impermeabilización existente.' },
  { title: 'Limpiamos la superficie', text: 'La dejamos limpia y lista para recibir el sistema nuevo.' },
  { title: 'Pintura asfáltica', text: 'Para garantizar una correcta adherencia.' },
  { title: 'Membrana geotextil', text: 'La colocamos sobre toda la superficie.' },
  { title: 'Pintura acrílica', text: 'Terminamos el sistema con pintura impermeabilizante.' },
];

const PHASE_MS: Record<number, number> = { [-1]: 1600, 0: 3000, 1: 3000, 2: 3000, 3: 3000, 4: 3000, 5: 3400 };
const STEP_MS = 2600; // lo que tarda la herramienta en cruzar el techo

// Techo visto en 3/4: paralelogramo. Las capas se recortan con esta forma y "crecen" de izquierda a derecha.
const ROOF = '150,262 650,262 702,196 202,196';
const X0 = 140;
const FULL = 580;

const Tool: React.FC<{ phase: number }> = ({ phase }) => {
  const common = { fill: 'none', stroke: '#0b0b0c', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  let shape: React.ReactNode = null;
  if (phase === 0)
    // espátula
    shape = (
      <g>
        <path d="M0 -58 L-14 -4" {...common} strokeWidth={5} />
        <path d="M-26 0 L-2 0 L-8 -10 L-22 -10 Z" fill="#6e6e75" stroke="#0b0b0c" strokeWidth={2.5} />
      </g>
    );
  if (phase === 1)
    // escoba
    shape = (
      <g>
        <path d="M6 -70 L-4 -14" {...common} strokeWidth={5} />
        <path d="M-26 0 L18 0 L10 -16 L-18 -16 Z" fill="#c9c9cd" stroke="#0b0b0c" strokeWidth={2.5} />
        {[-20, -12, -4, 4, 12].map((x) => (
          <path key={x} d={`M${x} -2 L${x - 2} 6`} {...common} strokeWidth={2} />
        ))}
      </g>
    );
  if (phase === 2 || phase === 4)
    // rodillo (negro con asfalto, blanco con acrílico)
    shape = (
      <g>
        <path d="M14 -74 L10 -30 L-2 -30" {...common} strokeWidth={4} />
        <rect x="-26" y="-34" width="34" height="22" rx="10" fill={phase === 2 ? '#0b0b0c' : '#ffffff'} stroke="#0b0b0c" strokeWidth={2.5} />
      </g>
    );
  if (phase === 3)
    // rollo de membrana
    shape = (
      <g className="roll-spin">
        <circle cx="0" cy="-18" r="18" fill="#9a9aa0" stroke="#0b0b0c" strokeWidth={2.5} />
        <circle cx="0" cy="-18" r="10" fill="none" stroke="#0b0b0c" strokeWidth={1.5} />
        <circle cx="0" cy="-18" r="3" fill="#0b0b0c" />
      </g>
    );
  if (!shape) return null;
  return (
    <g key={phase} className="tool-move" style={{ animationDuration: `${STEP_MS}ms` }}>
      <g transform="translate(0 232)">{shape}</g>
    </g>
  );
};

export const RoofAnimationSection: React.FC = () => {
  const [phase, setPhase] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Solo anima cuando se ve en pantalla; con "reducir movimiento" muestra el resultado y los pasos por toque
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setReduced(true);
      setPhase(5);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduced) return;
    const t = window.setTimeout(() => setPhase((p) => (p >= 5 ? -1 : p + 1)), PHASE_MS[phase]);
    return () => window.clearTimeout(t);
  }, [phase, visible, reduced]);

  const animate = phase >= 0 && !reduced;
  const tr = (on: boolean) => ({ transition: animate && on ? `width ${STEP_MS}ms linear, opacity 900ms ease` : 'none' });
  const width = (from: number) => (phase >= from ? FULL : 0);

  return (
    <section className="py-24 lg:py-32 bg-paper" id="como-impermeabilizamos">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="mb-12">
          <SectionHeader
            eyebrow="Paso a paso"
            title="Así impermeabilizamos un techo"
            description="Nuestro sistema con membrana geotextil, en cinco pasos."
          />
        </div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          <Reveal className="lg:col-span-7">
            <div className="relative rounded-[28px] bg-white ring-1 ring-line overflow-hidden">
              <svg
                viewBox="90 100 640 380"
                className="block w-full h-auto"
                role="img"
                aria-label="Animación: retiro de la membrana vieja, limpieza, pintura asfáltica, membrana geotextil y pintura acrílica sobre el techo de una casa"
              >
                <defs>
                  <clipPath id="roof-clip">
                    <polygon points={ROOF} />
                  </clipPath>
                  <pattern id="geotextil" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                    <rect width="10" height="10" fill="#8a8a90" />
                    <path d="M0 0 L0 10" stroke="#a7a7ad" strokeWidth="3" />
                  </pattern>
                </defs>

                {/* sol y sierras de fondo */}
                <circle cx="660" cy="150" r="28" fill="#eeeef0" />
                <path d="M0 330 L120 250 L210 300 L330 220 L450 290 L560 230 L690 300 L800 260 L800 520 L0 520 Z" fill="#f6f6f7" />

                {/* casa */}
                <rect x="172" y="276" width="456" height="186" fill="#e4e4e7" />
                <rect x="618" y="276" width="10" height="186" fill="#d4d4d8" />
                {[226, 336, 506].map((x) => (
                  <g key={x}>
                    <rect x={x} y="312" width="62" height="54" rx="3" fill="#ffffff" stroke="#c9c9cd" strokeWidth="2" />
                    <path d={`M${x + 31} 312 V366 M${x} 339 H${x + 62}`} stroke="#c9c9cd" strokeWidth="2" />
                  </g>
                ))}
                <rect x="436" y="372" width="52" height="90" rx="3" fill="#3a3a3f" />
                <circle cx="478" cy="420" r="3" fill="#c9c9cd" />
                <rect x="150" y="262" width="500" height="16" fill="#c9c9cd" />
                <path d="M650 262 L702 196 L702 212 L650 278 Z" fill="#b9b9be" />
                <line x1="40" y1="462" x2="760" y2="462" stroke="#c9c9cd" strokeWidth="3" strokeLinecap="round" />

                {/* superficie del techo */}
                <g clipPath="url(#roof-clip)">
                  <rect x={X0} y="190" width={FULL + 10} height="80" fill="#d4d4d8" />
                  {/* membrana vieja: rota, con fisuras y charcos */}
                  <rect x={X0} y="190" width={FULL + 10} height="80" fill="#6e6e75" />
                  <path d="M220 214 l30 10 l18 -8 l26 14 M360 238 l20 -12 l30 6 l14 -10 M480 218 l26 12 l22 -6 M560 244 l30 -10 l22 8" stroke="#3a3a3f" strokeWidth="3" fill="none" />
                  <ellipse cx="300" cy="244" rx="34" ry="7" fill="#9a9aa0" />
                  <ellipse cx="540" cy="214" rx="26" ry="6" fill="#9a9aa0" />
                  <path d="M420 228 q12 -10 24 0 q-12 8 -24 0" fill="#56565c" />
                  {/* retiro: aparece el hormigón limpio de izquierda a derecha */}
                  <rect x={X0} y="190" height="80" fill="#d4d4d8" style={{ width: width(0), ...tr(phase === 0) }} />
                  {/* restos después del retiro, se van con la limpieza */}
                  <g style={{ opacity: phase === 0 ? 1 : 0, transition: animate ? 'opacity 1.6s ease' : 'none' }}>
                    {[[230, 240], [290, 222], [350, 248], [410, 214], [470, 238], [530, 226], [590, 246], [640, 214]].map(([x, y]) => (
                      <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#6e6e75" />
                    ))}
                  </g>
                  <rect x={X0} y="190" height="80" fill="#1c1c1f" style={{ width: width(2), ...tr(phase === 2) }} />
                  <rect x={X0} y="190" height="80" fill="url(#geotextil)" style={{ width: width(3), ...tr(phase === 3) }} />
                  <rect x={X0} y="190" height="80" fill="#ffffff" style={{ width: width(4), ...tr(phase === 4) }} />
                </g>
                <polygon points={ROOF} fill="none" stroke="#9a9aa0" strokeWidth="2" />

                {/* pedazos que saltan al retirar */}
                {phase === 0 &&
                  [0, 1, 2, 3, 4, 5].map((i) => (
                    <path
                      key={i}
                      className="chip-fly"
                      style={{ animationDelay: `${i * 380}ms`, transform: `translateX(${230 + i * 76}px)` }}
                      d="M0 228 l12 -4 l4 8 l-10 4 Z"
                      fill="#56565c"
                    />
                  ))}
                {/* polvo al barrer */}
                {phase === 1 &&
                  [0, 1, 2, 3, 4, 5].map((i) => (
                    <circle key={i} className="dust-puff" style={{ animationDelay: `${i * 380}ms` }} cx={250 + i * 76} cy="226" r="7" fill="#c9c9cd" />
                  ))}

                <Tool phase={phase} />

                {/* terminado: llueve y el techo queda protegido */}
                {phase === 5 && (
                  <g>
                    {[230, 300, 370, 440, 510, 580, 640].map((x, i) => (
                      <path key={x} className="rain-drop" style={{ animationDelay: `${(i % 4) * 220}ms` }} d={`M${x} 128 l-4 14`} stroke="#6e6e75" strokeWidth="3" strokeLinecap="round" />
                    ))}
                  </g>
                )}
              </svg>

              <div
                className={`absolute left-4 top-4 sm:left-6 sm:top-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[12px] font-semibold transition-all duration-500 ${
                  phase === 5 ? 'bg-ink text-white opacity-100' : 'bg-ink/0 text-ink opacity-0'
                }`}
                aria-hidden={phase !== 5}
              >
                <Check size={14} strokeWidth={2.6} aria-hidden="true" /> Techo protegido
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.08}>
            <ol className="space-y-2">
              {STEPS.map((s, i) => {
                const active = phase === i;
                const done = phase > i;
                return (
                  <li key={s.title}>
                    <button
                      type="button"
                      onClick={() => setPhase(i)}
                      aria-current={active ? 'step' : undefined}
                      className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-colors ${
                        active ? 'bg-ink text-white' : 'hover:bg-white'
                      }`}
                    >
                      <span
                        className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-headline text-sm font-bold transition-colors ${
                          active ? 'bg-white text-ink' : done ? 'bg-ink text-white' : 'bg-white ring-1 ring-line text-graphite'
                        }`}
                      >
                        {done ? <Check size={16} strokeWidth={2.6} aria-hidden="true" /> : i + 1}
                      </span>
                      <span>
                        <span className="block font-headline text-[16px] font-bold leading-snug">{s.title}</span>
                        <span className={`block mt-0.5 text-[14px] leading-snug ${active ? 'text-white/70' : 'text-muted'}`}>{s.text}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
