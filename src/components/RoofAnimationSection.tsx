import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { Reveal, SectionHeader } from './ui';

/**
 * Animación tipo video explicativo del sistema de impermeabilización.
 * Los 5 pasos son los del reel de Martín "Cómo impermeabilizar tu techo" (Instagram, 23/06/2026).
 * SVG + CSS, sin librerías. Casa isométrica, cámara que se acerca al techo, operario y lluvia final.
 *
 * Fases: -1 problema (techo roto, humedad en la pared) · 0..4 pasos · 5 resultado (llueve y no pasa nada).
 */
const STEPS = [
  { title: 'Retiramos el sistema viejo', text: 'Removemos por completo la impermeabilización existente.' },
  { title: 'Limpiamos la superficie', text: 'La dejamos limpia y lista para recibir el sistema nuevo.' },
  { title: 'Pintura asfáltica', text: 'Para garantizar una correcta adherencia.' },
  { title: 'Membrana geotextil', text: 'La colocamos sobre toda la superficie.' },
  { title: 'Pintura acrílica', text: 'Terminamos el sistema con pintura impermeabilizante.' },
];

const PHASE_MS: Record<number, number> = { [-1]: 2800, 0: 3300, 1: 3300, 2: 3300, 3: 3300, 4: 3300, 5: 4600 };
const DELAY = 400; // anticipación: el operario se acomoda antes de empezar
const MOVE = 2600; // lo que tarda en cruzar el techo
const EASE = 'cubic-bezier(0.45, 0.05, 0.55, 0.95)';

// Geometría isométrica. Techo en coordenadas (u, v): U × V, esquina superior en A.
const U = 300;
const V = 220;
const H = 150;
const K = 0.866;
const A = { x: 400, y: 150 };
const p = (u: number, v: number, z = 0) => ({ x: A.x + K * (u - v), y: A.y + 0.5 * (u + v) + z });
const ROOF_M = `matrix(${K} 0.5 ${-K} 0.5 ${A.x} ${A.y})`;
const D = p(0, V);
const B = p(U, 0);
const LEFT_M = `matrix(${K} 0.5 0 1 ${D.x} ${D.y})`; // cara frontal izquierda (u, z)
const RIGHT_M = `matrix(${-K} 0.5 0 1 ${B.x} ${B.y})`; // cara frontal derecha (w, z)
const WALK_V = 110;
const START = p(28, WALK_V);
const END = p(282, WALK_V);
const pts = (list: { x: number; y: number }[]) => list.map((q) => `${q.x},${q.y}`).join(' ');

const INK = '#0b0b0c';

/** Operario de AquaTech, dibujado con origen en los pies, mirando hacia donde avanza */
const Worker: React.FC<{ phase: number }> = ({ phase }) => {
  const line = { stroke: INK, strokeWidth: 3, strokeLinecap: 'round' as const, fill: 'none' };
  let tool: React.ReactNode = null;
  let particles: React.ReactNode = null;

  if (phase === 0) {
    tool = (
      <g>
        <path d="M22 -36 L40 -3" {...line} strokeWidth={4} />
        <path d="M32 2 L50 2 L46 -6 L34 -6 Z" fill="#6e6e75" stroke={INK} strokeWidth={2} />
      </g>
    );
    particles = [0, 1, 2, 3, 4].map((i) => (
      <path key={i} className="chip-fly" style={{ animationDelay: `${i * 160}ms` }} d="M40 -4 l9 -3 l3 6 l-8 3 Z" fill="#56565c" />
    ));
  }
  if (phase === 1) {
    tool = (
      <g>
        <path d="M20 -38 L42 -4" {...line} strokeWidth={4} />
        <path d="M30 2 L58 2 L52 -8 L34 -8 Z" fill="#c9c9cd" stroke={INK} strokeWidth={2} />
      </g>
    );
    particles = [0, 1, 2].map((i) => (
      <circle key={i} className="dust-puff" style={{ animationDelay: `${i * 280}ms` }} cx="44" cy="-2" r="6" fill="#c9c9cd" />
    ));
  }
  if (phase === 2 || phase === 4) {
    tool = (
      <g>
        <path d="M22 -36 L36 -12" {...line} strokeWidth={4} />
        <rect x="30" y="-14" width="26" height="14" rx="7" fill={phase === 2 ? '#1c1c1f' : '#ffffff'} stroke={INK} strokeWidth={2} />
      </g>
    );
  }

  return (
    <g key={phase} className="worker-walk" style={{
      ['--x0' as string]: `${START.x}px`, ['--y0' as string]: `${START.y}px`,
      ['--x1' as string]: `${END.x}px`, ['--y1' as string]: `${END.y}px`,
      animationDuration: `${DELAY + MOVE}ms`,
    } as React.CSSProperties}>
      <ellipse cx="4" cy="1" rx="20" ry="5" fill="rgba(11,11,12,0.18)" />
      {phase === 3 && (
        <g>
          {/* rollo de membrana que empuja */}
          <path d="M14 -34 L30 -22" {...line} strokeWidth={4} />
          <g className="roll-spin">
            <circle cx="38" cy="-14" r="15" fill="#9a9aa0" stroke={INK} strokeWidth={2.5} />
            <circle cx="38" cy="-14" r="8" fill="none" stroke={INK} strokeWidth={1.5} />
            <circle cx="38" cy="-14" r="2.5" fill={INK} />
          </g>
        </g>
      )}
      <g className="worker-bob">
        {/* piernas y botas */}
        <path d="M-2 -30 L-6 -2 M6 -30 L10 -2" stroke="#3a3a3f" strokeWidth={7} strokeLinecap="round" />
        <path d="M-11 0 h9 M5 0 h10" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        {/* torso con el logo en la espalda */}
        <rect x="-10" y="-60" width="22" height="34" rx="8" fill={INK} />
        <path d="M-1 -38 L1 -50 L4.4 -38 H2.6 L1 -43 L-0.8 -38 Z" fill="#ffffff" />
        {/* cabeza y gorra */}
        <circle cx="2" cy="-68" r="8" fill="#d8cfc6" />
        <path d="M-6 -70 Q2 -80 10 -70 L15 -69 L10 -67 L-6 -68 Z" fill={INK} />
        {/* brazo con la herramienta */}
        <g className={phase === 3 ? undefined : 'worker-arm'}>
          <path d="M6 -52 L22 -36" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <circle cx="22" cy="-36" r="3.5" fill="#d8cfc6" />
          {tool}
          {particles}
        </g>
      </g>
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
    const t = window.setTimeout(() => setPhase((ph) => (ph >= 5 ? -1 : ph + 1)), PHASE_MS[phase]);
    return () => window.clearTimeout(t);
  }, [phase, visible, reduced]);

  const animated = !reduced;
  // Capa que avanza sincronizada con el operario (mismo retardo, duración y easing)
  const layer = (from: number) => ({
    width: phase >= from ? U : 0,
    transition: animated && phase === from ? `width ${MOVE}ms ${EASE} ${DELAY}ms` : 'none',
  });
  const fade = (show: boolean, active: boolean) => ({
    opacity: show ? 1 : 0,
    transition: animated && active ? `opacity ${MOVE}ms ${EASE} ${DELAY}ms` : 'none',
  });
  const zoomed = phase >= 0 && phase <= 4;
  const caption =
    phase === -1
      ? { label: 'El problema', title: 'Filtraciones y humedad' }
      : phase === 5
        ? { label: 'Resultado', title: 'Techo protegido' }
        : { label: `Paso ${phase + 1} de 5`, title: STEPS[phase].title };

  const rain = [
    [40, 40], [110, 30], [190, 50], [260, 40], [70, 120], [150, 110], [230, 130], [290, 100], [30, 190], [120, 180], [200, 200], [270, 175],
  ].map(([u, v]) => p(u, v));

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
                viewBox="110 70 620 470"
                className="block w-full h-auto"
                role="img"
                aria-label="Animación: un operario retira la membrana vieja, limpia, aplica pintura asfáltica, membrana geotextil y pintura acrílica; al final llueve y el techo queda protegido"
              >
                <defs>
                  <pattern id="geo" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="12" height="12" fill="#8f8f95" />
                    <path d="M0 0 V12" stroke="#a9a9ae" strokeWidth="3" />
                  </pattern>
                  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={phase === 5 ? '#e4e4e7' : '#f6f6f7'} />
                    <stop offset="1" stopColor="#ffffff" />
                  </linearGradient>
                  <linearGradient id="white-sheen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#ececee" />
                  </linearGradient>
                </defs>

                <rect x="110" y="70" width="620" height="470" fill="url(#sky)" />

                <g className="roof-scene" style={{ transform: zoomed ? 'translate(-15px, 25px) scale(1.3)' : 'translate(-8px, -14px) scale(0.92)' }}>
                  {/* fondo: sol y sierras */}
                  <circle cx="650" cy="130" r="26" fill="#ececee" style={{ opacity: phase === 5 ? 0 : 1, transition: 'opacity 0.8s' }} />
                  <path d="M0 330 L110 300 L210 262 L290 300 L390 236 L500 296 L590 248 L680 300 L780 270 L900 300 L900 700 L0 700 Z" fill="#f2f2f3" />

                  {/* piso y sombra */}
                  <polygon points={pts([p(-70, -70, H), p(U + 70, -70, H), p(U + 70, V + 70, H), p(-70, V + 70, H)])} fill="#ececee" />
                  <polygon points={pts([p(20, V, H), p(U + 40, V, H), p(U + 40, 30, H), p(U, 0, H), p(U, V, H)])} fill="rgba(11,11,12,0.08)" />

                  {/* paredes */}
                  <g transform={LEFT_M}>
                    <rect width={U} height={H} fill="#e9e9ec" />
                    <rect width={U} height="14" fill="#c9c9cd" />
                    {/* mancha de humedad que gotea: el problema */}
                    <g style={fade(phase < 4, phase === 4)}>
                      <path d="M50 14 C44 42 62 56 56 78 C78 68 92 86 110 66 C124 46 108 30 120 14 Z" fill="#a7a7ad" />
                      <path d="M64 14 C60 34 72 44 70 58 C84 52 94 60 104 48 C110 34 102 24 108 14 Z" fill="#8f8f95" />
                      {phase <= 0 && (
                        <>
                          <circle className="drip" cx="84" cy="64" r="3.5" fill="#6e6e75" />
                          <circle className="drip" style={{ animationDelay: '700ms' }} cx="66" cy="70" r="3" fill="#6e6e75" />
                        </>
                      )}
                    </g>
                    {[38, 140].map((x) => (
                      <g key={x}>
                        <rect x={x} y="44" width="56" height="44" rx="2" fill="#ffffff" stroke="#c9c9cd" strokeWidth="2" />
                        <path d={`M${x + 28} 44 V88 M${x} 66 H${x + 56}`} stroke="#c9c9cd" strokeWidth="2" />
                      </g>
                    ))}
                    <rect x="236" y="62" width="40" height="88" rx="2" fill="#3a3a3f" />
                    <circle cx="268" cy="108" r="2.5" fill="#c9c9cd" />
                  </g>
                  <g transform={RIGHT_M}>
                    <rect width={V} height={H} fill="#d6d6da" />
                    <rect width={V} height="14" fill="#b4b4b9" />
                    <rect x="80" y="44" width="56" height="44" rx="2" fill="#f2f2f3" stroke="#bdbdc2" strokeWidth="2" />
                    <path d="M108 44 V88 M80 66 H136" stroke="#bdbdc2" strokeWidth="2" />
                  </g>

                  {/* techo: capas en coordenadas (u, v) */}
                  <g transform={ROOF_M}>
                    <rect width={U} height={V} fill="#6e6e75" />
                    <path d="M40 40 l30 14 l20 -8 l26 18 M150 120 l24 -14 l34 10 l16 -12 M220 50 l26 16 l24 -8 M60 170 l34 -10 l26 12" stroke="#3a3a3f" strokeWidth="3" fill="none" />
                    <ellipse cx="110" cy="150" rx="40" ry="22" fill="#9a9aa0" />
                    <ellipse cx="240" cy="160" rx="26" ry="16" fill="#9a9aa0" />
                    <circle cx="200" cy="80" r="9" fill="#56565c" />
                    <circle cx="80" cy="96" r="6" fill="#56565c" />
                    {/* paso 1: aparece el hormigón */}
                    <rect height={V} fill="#d4d4d8" style={layer(0)} />
                    {/* restos que quedan del retiro y se van con la limpieza */}
                    <g style={{ opacity: phase === 0 ? 1 : 0, transition: animated && phase <= 1 ? `opacity ${phase === 0 ? 1200 : MOVE}ms ${EASE} ${DELAY}ms` : 'none' }}>
                      {[[40, 60], [90, 150], [130, 40], [170, 120], [210, 190], [250, 70], [280, 150], [60, 200]].map(([u, v]) => (
                        <rect key={`${u}-${v}`} x={u} y={v} width="9" height="6" fill="#6e6e75" />
                      ))}
                    </g>
                    <rect height={V} fill="#1c1c1f" style={layer(2)} />
                    <rect height={V} fill="url(#geo)" style={layer(3)} />
                    <rect height={V} fill="url(#white-sheen)" style={layer(4)} />
                    <rect width={U} height={V} fill="none" stroke="#9a9aa0" strokeWidth="2" />
                  </g>

                  {phase >= 0 && phase <= 4 && <Worker phase={phase} />}

                  {/* resultado: nubes, lluvia que rebota y sello */}
                  {phase === 5 && (
                    <g>
                      <g className="cloud-in" transform="translate(110 0)">
                        <path d="M240 128 a26 26 0 0 1 48 -14 a30 30 0 0 1 54 8 a22 22 0 0 1 4 42 H246 a20 20 0 0 1 -6 -36 Z" fill="#c9c9cd" />
                        <path d="M430 108 a22 22 0 0 1 40 -12 a26 26 0 0 1 46 6 a18 18 0 0 1 4 36 H436 a17 17 0 0 1 -6 -30 Z" fill="#d4d4d8" />
                      </g>
                      {rain.map((q, i) => (
                        <g key={i}>
                          <path className="rain-fall" style={{ animationDelay: `${600 + (i % 6) * 170}ms` }} d={`M${q.x + 6} ${q.y - 16} L${q.x} ${q.y}`} stroke="#3a3a3f" strokeWidth="3" strokeLinecap="round" />
                          <ellipse className="splash" style={{ animationDelay: `${600 + (i % 6) * 170}ms` }} cx={q.x} cy={q.y} rx="10" ry="4" fill="none" stroke="#6e6e75" strokeWidth="2" />
                        </g>
                      ))}
                      <g className="stamp-pop">
                        <circle cx={p(150, 110).x} cy={p(150, 110).y} r="30" fill={INK} />
                        <path d={`M${p(150, 110).x - 13} ${p(150, 110).y} l9 9 l18 -19`} stroke="#ffffff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                    </g>
                  )}
                </g>
              </svg>

              {/* subtítulo tipo video */}
              <div key={phase} className="caption-in absolute left-3 top-3 sm:left-6 sm:top-6 pointer-events-none">
                <div className="inline-flex flex-col px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-white/90 backdrop-blur ring-1 ring-line shadow-sm">
                  <span className="text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.2em] text-muted">{caption.label}</span>
                  <span className="mt-0.5 font-headline text-[13px] sm:text-base font-bold text-ink flex items-center gap-1.5">
                    {phase === 5 && <Check size={16} strokeWidth={2.8} aria-hidden="true" />}
                    {caption.title}
                  </span>
                </div>
              </div>

              {/* barra de progreso */}
              <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-5 flex gap-1.5" aria-hidden="true">
                {STEPS.map((s, i) => (
                  <span key={s.title} className="h-1.5 flex-1 rounded-full bg-ink/10 overflow-hidden">
                    <span
                      key={`${i}-${phase}`}
                      className={`block h-full bg-ink ${i === phase && animated ? 'progress-run' : ''}`}
                      style={{
                        width: i < phase || phase === 5 ? '100%' : i === phase && !animated ? '100%' : i === phase ? undefined : '0%',
                        animationDuration: `${PHASE_MS[i]}ms`,
                      }}
                    />
                  </span>
                ))}
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
