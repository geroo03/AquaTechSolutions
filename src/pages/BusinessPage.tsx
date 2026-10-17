import { useState } from 'react';
import { ArrowDown, ArrowUpRight, Building2, Check, MapPin, ReceiptText, ShieldCheck } from 'lucide-react';
import { SiteLayout } from '../components/SiteLayout';
import { Eyebrow, waLink } from '../components/ui';
import { WhatsAppIcon } from '../components/Brand';
import { ASSETS, PRIVATE_NEIGHBORHOODS_NOTE, WORKS } from '../data/mockData';
import { BUSINESS_PATH, GREENVILLE_PATH, type SitePage } from '../routes';

const container = 'max-w-7xl mx-auto px-5 sm:px-8 lg:px-12';
const field = 'mt-2 w-full rounded-2xl bg-paper ring-1 ring-line px-4 py-3 text-sm text-ink placeholder:text-muted outline-none focus:ring-2 focus:ring-ink';
const properties = ['Edificio / consorcio', 'Country / barrio privado', 'Comercio / oficina', 'Galpón / industria', 'Otro inmueble'];

function BusinessInquiry() {
  const [property, setProperty] = useState(properties[0]);
  const [company, setCompany] = useState('');
  const [place, setPlace] = useState('');
  const [area, setArea] = useState('');
  const [problem, setProblem] = useState('');
  const message = `Hola AquaTech, quiero consultar por un trabajo para un consorcio o empresa:
- Inmueble: ${property}
- Administración o empresa: ${company.trim() || 'a confirmar'}
- Barrio o localidad: ${place.trim() || 'a confirmar'}
- Superficie aproximada (m²): ${area.trim() || 'a confirmar'}
- Problema: ${problem.trim() || 'les cuento por WhatsApp'}
Les puedo compartir fotos y los requisitos de ingreso al inmueble.`;

  return <section id="consulta-empresa" className="bg-white border-y border-line">
    <div className={`${container} py-16 sm:py-24 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20`}>
      <div>
        <Eyebrow>Una consulta con contexto</Eyebrow>
        <h2 className="font-headline text-3xl sm:text-4xl font-bold leading-tight">Contanos qué inmueble necesitás proteger.</h2>
        <p className="mt-5 text-muted leading-relaxed">Completá los datos que tengas y seguimos por WhatsApp. Si todavía no sabés los metros cuadrados, podemos empezar igual.</p>
        <ul className="mt-8 space-y-4 text-sm text-graphite">
          {['Fotos generales y de los sectores afectados.', 'Desde cuándo aparece la filtración o humedad.', 'Horarios y requisitos para acceder al inmueble.'].map(text => <li key={text} className="flex gap-3"><Check size={18} className="shrink-0 mt-0.5" />{text}</li>)}
        </ul>
        <p className="mt-8 text-xs text-muted leading-relaxed">La visita técnica se coordina y puede tener un costo de viáticos según la distancia. {PRIVATE_NEIGHBORHOODS_NOTE}</p>
      </div>
      <div className="rounded-3xl p-6 sm:p-8 ring-1 ring-line bg-white">
        <fieldset>
          <legend className="font-headline text-xl font-bold mb-6">Prepará tu consulta</legend>
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="text-sm font-medium">Tipo de inmueble
              <select value={property} onChange={event => setProperty(event.target.value)} className={field}>
                {properties.map(value => <option key={value}>{value}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium">Administración o empresa <span className="text-muted font-normal">(opcional)</span>
              <input value={company} onChange={event => setCompany(event.target.value)} maxLength={120} placeholder="Nombre de la organización" className={field} />
            </label>
            <label className="text-sm font-medium">Barrio o localidad
              <input value={place} onChange={event => setPlace(event.target.value)} maxLength={120} placeholder="Ej: Nueva Córdoba" className={field} />
            </label>
            <label className="text-sm font-medium">Superficie aproximada en m²
              <input value={area} onChange={event => setArea(event.target.value)} inputMode="decimal" maxLength={20} placeholder="Si la conocés" className={field} />
            </label>
            <label className="text-sm font-medium sm:col-span-2">¿Qué necesitás resolver?
              <textarea value={problem} onChange={event => setProblem(event.target.value)} maxLength={1000} rows={4} placeholder="Sectores afectados, cuándo aparece y si hay una impermeabilización anterior." className={`${field} resize-y`} />
            </label>
          </div>
        </fieldset>
        <a href={waLink(message)} target="_blank" rel="noopener noreferrer" data-origen="Consulta de consorcios y empresas"
          className="mt-7 w-full inline-flex justify-center items-center gap-2.5 rounded-full bg-ink text-white px-5 py-4 text-sm font-semibold hover:bg-graphite transition-colors">
          <WhatsAppIcon size={18} />Enviar consulta de empresa
        </a>
        <p className="mt-3 text-xs text-muted text-center leading-relaxed">Revisá el mensaje en WhatsApp y adjuntá las fotos del inmueble.</p>
      </div>
    </div>
  </section>;
}

export default function BusinessPage({ page }: { page: SitePage }) {
  const references = WORKS.filter(work => ['greenville', 'hospital-italiano', 'colegio-abogados'].includes(work.id));
  return <SiteLayout pagePath={page.path}>{() => <>
    <section id="inicio" className="bg-ink text-white">
      <div className={`${container} pt-28 sm:pt-36 pb-16 sm:pb-24`}>
        <nav aria-label="Ubicación" className="flex flex-wrap items-center gap-2 text-xs text-white/65 mb-9"><a href="./" className="hover:text-white">Inicio</a><span aria-hidden="true">/</span><span aria-current="page" className="text-white">Consorcios y empresas</span></nav>
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
          <div>
            <Eyebrow tone="light">Consorcios · Countries · Empresas</Eyebrow>
            <h1 className="font-headline text-[clamp(2.1rem,5.5vw,4rem)] leading-[1.08] font-bold">Impermeabilización para el inmueble que administrás.</h1>
            <p className="mt-6 text-lg leading-relaxed text-white/75 max-w-xl">Techos, terrazas y problemas de humedad en Córdoba. Contanos qué superficie necesitás evaluar y qué condiciones tiene el lugar para preparar la consulta.</p>
            <a href={`.${BUSINESS_PATH}#consulta-empresa`} className="mt-8 inline-flex gap-2.5 items-center min-h-14 px-6 py-3 rounded-full bg-white text-ink text-sm font-semibold hover:bg-mist transition-colors">Preparar consulta <ArrowDown size={18} /></a>
          </div>
          <figure className="rounded-3xl overflow-hidden ring-1 ring-white/15">
            <img src={ASSETS.heroBgSmall} alt="Techo durante una obra real de impermeabilización de AquaTech" width={960} height={720} className="w-full aspect-[4/3] object-cover grayscale" decoding="async" />
            <figcaption className="px-5 py-4 bg-white/5 text-xs text-white/75">Trabajo real de AquaTech en Córdoba.</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section className={`${container} py-16 sm:py-20`} aria-labelledby="respaldo-empresas">
      <Eyebrow>Para evaluar la propuesta</Eyebrow>
      <h2 id="respaldo-empresas" className="font-headline text-3xl sm:text-4xl font-bold max-w-2xl">Un trabajo definido para tu superficie.</h2>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {[
          { icon: Building2, title: 'Revisión y coordinación', text: 'Nos compartís fotos, ubicación y condiciones de acceso. Coordinamos la visita cuando hace falta revisar o medir.' },
          { icon: ReceiptText, title: 'Presupuesto y facturación', text: 'El presupuesto es sin cargo. Contanos qué factura necesitás: el precio de la mano de obra puede variar según la factura.' },
          { icon: ShieldCheck, title: 'Garantía por escrito', text: 'La garantía corresponde al sistema aplicado y se entrega en papel y en formato digital. Contamos con seguro.' },
        ].map(({ icon: Icon, title, text }) => <article key={title} className="border-t border-line pt-6"><Icon size={24} strokeWidth={1.5} /><h3 className="mt-5 font-headline text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{text}</p></article>)}
      </div>
    </section>

    <section className="bg-silver-disc"><div className={`${container} py-16 sm:py-20 grid lg:grid-cols-[0.7fr_1.3fr] gap-10 lg:gap-20`}>
      <div><Eyebrow>Obras realizadas</Eyebrow><h2 className="font-headline text-3xl sm:text-4xl font-bold leading-tight">Experiencia en distintos inmuebles.</h2><p className="mt-5 text-sm text-graphite leading-relaxed">Conocé algunos trabajos publicados por AquaTech. Cada propuesta se define después de conocer el estado de la superficie.</p></div>
      <div className="divide-y divide-ink/15">{references.map(work => <a key={work.id} href={work.id === 'greenville' ? `.${GREENVILLE_PATH}` : work.url} target={work.id === 'greenville' ? undefined : '_blank'} rel={work.id === 'greenville' ? undefined : 'noopener noreferrer'} className="group flex justify-between gap-5 py-6 first:pt-0 last:pb-0">
        <div><span className="text-xs text-graphite flex items-center gap-2"><MapPin size={14} />{work.type}</span><h3 className="mt-2 font-headline text-xl font-bold group-hover:underline underline-offset-4">{work.place}</h3><p className="mt-2 text-sm leading-relaxed text-graphite">{work.detail}</p><span className="mt-3 block text-xs text-graphite">{work.id === 'greenville' ? 'Conocer la obra' : 'Ver publicación en Instagram'}</span></div><ArrowUpRight size={20} className="shrink-0 mt-1" />
      </a>)}</div>
    </div></section>

    <BusinessInquiry />
  </>}</SiteLayout>;
}
