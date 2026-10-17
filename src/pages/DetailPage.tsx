import { ArrowRight, ArrowUpRight, Check, ChevronDown, Droplets, Layers3, MapPin, ShieldCheck } from 'lucide-react';
import { SiteLayout } from '../components/SiteLayout';
import { Eyebrow, Reveal, waLink } from '../components/ui';
import { InstagramIcon, WhatsAppIcon } from '../components/Brand';
import { ASSETS, SERVICES, WORKS, WORK_PROCESS } from '../data/mockData';
import { SERVICE_DETAILS } from '../data/serviceDetails';
import { GREENVILLE_PATH, PAGES, type SitePage } from '../routes';

const container = 'max-w-7xl mx-auto px-5 sm:px-8 lg:px-12';

function Breadcrumbs({ label }: { label: string }) {
  return <nav aria-label="Ubicación" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/65 mb-9">
    <a href="./" className="hover:text-white">Inicio</a><span aria-hidden="true">/</span><span aria-current="page" className="text-white">{label}</span>
  </nav>;
}

function ContactLink({ text, children, light = false }: { text: string; children: React.ReactNode; light?: boolean }) {
  return <a href={waLink(text)} target="_blank" rel="noopener noreferrer" data-origen="Consulta del servicio"
    className={`inline-flex items-center justify-center gap-2.5 min-h-14 px-6 py-3 rounded-full text-sm font-semibold transition-colors ${light ? 'bg-white text-ink hover:bg-mist' : 'bg-ink text-white hover:bg-graphite'}`}>
    <WhatsAppIcon size={18} />{children}
  </a>;
}

function RelatedServices({ current }: { current?: string }) {
  return <section className={`${container} py-16 sm:py-20`} aria-labelledby="otros-servicios">
    <Eyebrow>Seguí explorando</Eyebrow>
    <h2 id="otros-servicios" className="font-headline text-2xl sm:text-3xl font-bold">Más soluciones de AquaTech</h2>
    <div className="mt-8 grid sm:grid-cols-2 gap-4">
      {PAGES.filter(p => p.kind === 'service' && p.serviceId !== current).map(p => <a key={p.path} href={`.${p.path}`} className="group flex justify-between items-center gap-4 rounded-3xl ring-1 ring-line bg-white p-6 hover:ring-ink/30 transition-colors">
        <span className="font-headline font-semibold">{p.label}</span><ArrowUpRight size={19} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </a>)}
    </div>
  </section>;
}

function ServiceContent({ page, onQuote }: { page: SitePage; onQuote: () => void }) {
  const detail = SERVICE_DETAILS.find(d => d.id === page.serviceId)!;
  const isWall = page.serviceId === 'cimientos';
  return <>
    <section id="inicio" className="bg-ink text-white overflow-hidden">
      <div className={`${container} pt-28 sm:pt-36 pb-16 sm:pb-24`}>
        <Breadcrumbs label={page.label} />
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-10 lg:gap-16">
          <div>
            <Eyebrow tone="light">Servicio {detail.number} · Córdoba</Eyebrow>
            <h1 className="font-headline text-[clamp(2rem,5.5vw,4rem)] leading-[1.07] font-bold tracking-tight">{detail.heading}</h1>
            <p className="mt-6 text-base sm:text-lg text-white/75 leading-relaxed max-w-xl">{detail.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <ContactLink text={detail.message} light>{detail.action}</ContactLink>
              <button onClick={onQuote} className="min-h-14 px-6 py-3 rounded-full ring-1 ring-white/30 text-sm font-semibold hover:bg-white/10">Armar mi consulta</button>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-white/65"><ShieldCheck size={16} className="shrink-0" />Presupuesto sin cargo · Garantía por escrito según el sistema</p>
          </div>
          {isWall ? <div className="rounded-3xl bg-silver-disc p-8 sm:p-12 text-ink relative overflow-hidden min-h-72 flex flex-col justify-between">
            <Droplets size={160} strokeWidth={0.65} className="absolute -right-5 -top-5 opacity-10" aria-hidden="true" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-graphite">Muros y zócalos</span>
            <div className="relative mt-12"><div className="h-px bg-ink/20 mb-6" /><p className="font-headline text-3xl sm:text-4xl font-semibold leading-tight max-w-xs">Cada problema merece una evaluación.</p><p className="mt-4 text-sm text-graphite">Mandanos fotos y contanos desde cuándo aparece la humedad.</p></div>
          </div> : <figure className="relative overflow-hidden rounded-3xl ring-1 ring-white/15">
            <img src={ASSETS.heroBgSmall} alt="Techo durante una obra de impermeabilización de AquaTech en Córdoba" width={960} height={720} className="w-full aspect-[4/3] object-cover grayscale" decoding="async" />
            <figcaption className="absolute bottom-0 inset-x-0 pt-12 pb-5 px-6 bg-gradient-to-t from-ink/90 to-transparent text-xs text-white/85">Trabajo real de AquaTech · Córdoba</figcaption>
          </figure>}
        </div>
      </div>
    </section>

    <section className={`${container} py-20 sm:py-24`} aria-labelledby="tu-problema">
      <Reveal><Eyebrow>Tu punto de partida</Eyebrow><h2 id="tu-problema" className="font-headline text-3xl sm:text-4xl font-bold max-w-2xl">Contanos qué necesitás resolver.</h2></Reveal>
      <div className="mt-10 grid md:grid-cols-3 gap-5">{detail.questions.map((item, i) => <Reveal key={item.title} delay={i * 0.06} className="h-full"><article className="p-7 rounded-3xl bg-white ring-1 ring-line h-full"><span className="text-xs font-semibold text-muted">0{i + 1}</span><h3 className="mt-5 font-headline text-xl font-bold">{item.title}</h3><p className="mt-3 text-sm text-muted leading-relaxed">{item.text}</p></article></Reveal>)}</div>
    </section>

    <section className="bg-white border-y border-line"><div className={`${container} py-20 sm:py-24 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20`}>
      <Reveal><Eyebrow>Cómo lo abordamos</Eyebrow><h2 className="font-headline text-3xl sm:text-4xl font-bold leading-tight">Primero la superficie.<br />Después, el sistema.</h2><p className="mt-5 text-muted leading-relaxed">El presupuesto describe el trabajo recomendado y la garantía que corresponde. Para definirlo, necesitamos conocer tu caso.</p></Reveal>
      <div className="divide-y divide-line">{detail.approach.map(item => <div key={item.title} className="flex gap-4 py-6 first:pt-0 last:pb-0"><Check size={20} className="shrink-0 mt-1" /><div><h3 className="font-headline text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p></div></div>)}</div>
    </div></section>

    {page.serviceId === 'techos' && <section className={`${container} pt-20 sm:pt-24`}>
      <a href={`.${GREENVILLE_PATH}`} className="group block sm:flex items-center justify-between gap-8 bg-silver-disc rounded-3xl p-8 sm:p-10 ring-1 ring-line"><div><span className="text-[11px] uppercase tracking-[0.2em] text-graphite">Una obra para conocer el sistema</span><h2 className="mt-3 font-headline text-2xl sm:text-3xl font-bold">Country GreenVille, Córdoba</h2><p className="mt-3 text-sm text-graphite max-w-xl">Membrana asfáltica con geotextil de 4 mm y pintura poliuretánica. Conocé la solución aplicada.</p></div><span className="mt-6 sm:mt-0 inline-flex items-center gap-2 text-sm font-semibold shrink-0">Ver el trabajo <ArrowRight size={19} /></span></a>
    </section>}

    <section className={`${container} py-20 sm:py-24`} aria-labelledby="pasos-consulta">
      <Eyebrow>De la consulta al trabajo</Eyebrow><h2 id="pasos-consulta" className="font-headline text-3xl sm:text-4xl font-bold">Así empezamos.</h2>
      <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-7">{WORK_PROCESS.map(item => <li key={item.step} className="border-t border-line pt-5"><span className="text-xs font-semibold text-muted">0{item.step}</span><h3 className="mt-4 font-headline font-bold">{item.title}</h3><p className="mt-3 text-sm text-muted leading-relaxed">{item.description}</p></li>)}</ol>
    </section>

    <section className="bg-white border-y border-line"><div className={`${container} py-20 sm:py-24 grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-20`}>
      <div><Eyebrow>Antes de consultar</Eyebrow><h2 className="font-headline text-3xl sm:text-4xl font-bold">Preguntas frecuentes.</h2></div>
      <div className="divide-y divide-line">{detail.faqs.map(item => <details key={item.question} className="group py-5 first:pt-0"><summary className="flex justify-between items-center gap-5 list-none cursor-pointer text-base font-semibold"><span>{item.question}</span><ChevronDown size={18} className="shrink-0 group-open:rotate-180 transition-transform" /></summary><p className="mt-4 text-sm text-muted leading-relaxed pr-6">{item.answer}</p></details>)}</div>
    </div></section>

    <section className="bg-ink text-white"><div className={`${container} py-16 sm:py-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8`}><div><Eyebrow tone="light">El próximo paso</Eyebrow><h2 className="font-headline text-3xl sm:text-4xl font-bold">Tu consulta empieza con unas fotos.</h2><p className="mt-4 text-white/70 max-w-xl">Sumá tu barrio y la superficie aproximada. Te respondemos de 8 a 20 h.</p></div><div className="shrink-0"><ContactLink text={detail.message} light>{detail.action}</ContactLink></div></div></section>
    <RelatedServices current={page.serviceId} />
  </>;
}

function WorkContent() {
  const work = WORKS.find(w => w.id === 'greenville')!;
  return <>
    <section id="inicio" className="bg-ink text-white"><div className={`${container} pt-28 sm:pt-36 pb-16 sm:pb-24`}>
      <Breadcrumbs label="Obra en GreenVille" />
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-center">
        <div><Eyebrow tone="light">Obra realizada · Septiembre 2026</Eyebrow><h1 className="font-headline text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.06] font-bold">Un techo protegido en GreenVille.</h1><p className="mt-6 text-lg text-white/75 leading-relaxed">En Country GreenVille, en la zona sur de Córdoba Capital, aplicamos membrana asfáltica con geotextil de 4 mm y terminación con pintura poliuretánica.</p><a href={work.url} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-3 min-h-12 px-6 py-3 rounded-full bg-white text-ink text-sm font-semibold"><InstagramIcon size={17} />Ver fotos y video de la obra<ArrowUpRight size={16} /></a></div>
        <div className="rounded-3xl bg-silver-disc p-7 sm:p-10 text-ink"><div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-graphite"><Layers3 size={17} />Sistema aplicado</div><div className="mt-10 space-y-3"><div className="bg-white rounded-2xl px-5 py-5 ring-1 ring-ink/10"><p className="text-xs text-muted mb-2">Terminación</p><p className="font-headline font-semibold text-lg">Pintura poliuretánica</p></div><div className="bg-ink text-white rounded-2xl px-5 py-6"><p className="text-xs text-white/65 mb-2">Impermeabilización</p><p className="font-headline font-semibold text-lg">Membrana asfáltica con geotextil</p><p className="mt-3 text-sm text-white/75">Espesor: 4 mm</p></div><div className="h-3 rounded-full bg-graphite/25 mx-3" aria-hidden="true" /></div><p className="mt-6 text-xs text-graphite">Representación del sistema. Las imágenes de la obra están en la publicación original.</p></div>
      </div>
    </div></section>
    <section className={`${container} py-16 sm:py-20`}><dl className="grid sm:grid-cols-3 gap-px bg-line ring-1 ring-line rounded-3xl overflow-hidden">{[['Ubicación', 'Zona sur, Córdoba Capital'], ['Superficie', 'Techo'], ['Publicación', work.date]].map(([label, value]) => <div key={label} className="p-7 bg-white"><dt className="text-xs uppercase tracking-[0.18em] text-muted">{label}</dt><dd className="mt-3 font-headline text-lg font-semibold">{value}</dd></div>)}</dl></section>
    <section className={`${container} pb-20 sm:pb-24 grid lg:grid-cols-2 gap-10 lg:gap-20`}><div><Eyebrow>La solución</Eyebrow><h2 className="font-headline text-3xl sm:text-4xl font-bold">Membrana y terminación, en un mismo trabajo.</h2></div><div className="text-muted leading-relaxed space-y-5"><p>Esta obra combina la colocación de una membrana asfáltica con geotextil de 4 mm y una terminación con pintura poliuretánica.</p><p>Podés recorrer el trabajo en las fotos y el video publicados en nuestro Instagram. Si necesitás una solución para un techo, mandanos imágenes y contanos dónde está el inmueble: la propuesta se define para tu superficie.</p><a href={work.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ink font-semibold text-sm">Ver publicación original <ArrowUpRight size={16} /></a></div></section>
    <section className="bg-white border-y border-line"><div className={`${container} py-16 sm:py-20 grid lg:grid-cols-2 gap-10 items-center`}><div><Eyebrow>Para tu proyecto</Eyebrow><h2 className="font-headline text-3xl sm:text-4xl font-bold">¿Tenés un techo para evaluar?</h2><p className="mt-5 text-muted leading-relaxed">El presupuesto es sin cargo y la garantía se entrega por escrito según el sistema. Contanos qué necesitás resolver.</p><div className="mt-7"><ContactLink text="Hola AquaTech, vi la obra en GreenVille y quiero consultar por la impermeabilización de mi techo.">Consultar por un trabajo</ContactLink></div></div><a href="./servicios/impermeabilizacion-techos/" className="rounded-3xl p-8 sm:p-10 bg-paper ring-1 ring-line group"><MapPin size={22} /><h3 className="mt-7 font-headline text-2xl font-bold">Impermeabilización de techos en Córdoba</h3><p className="mt-4 text-sm text-muted leading-relaxed">Conocé los sistemas que usamos, las garantías y cómo preparar tu consulta.</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">Conocer el servicio <ArrowRight size={17} /></span></a></div></section>
    <RelatedServices />
  </>;
}

export default function DetailPage({ page }: { page: SitePage }) {
  const service = SERVICES.find(s => s.id === page.serviceId);
  return <SiteLayout initialService={service?.title} pagePath={page.path}>{({ openQuote }) => page.kind === 'work' ? <WorkContent /> : <ServiceContent page={page} onQuote={() => openQuote()} />}</SiteLayout>;
}
