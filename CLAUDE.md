# AquaTech Solutions — contexto para Claude Code

Web de **AquaTech Solutions**, empresa de impermeabilizaciones de Córdoba, Argentina. Hoy es una **demo** para presentarle al dueño; el objetivo es convertirla en la web real que genere consultas por WhatsApp.

- Demo publicada: https://geroo03.github.io/AquaTechSolutions/
- Repo: https://github.com/geroo03/AquaTechSolutions
- Trabaja en esto Sebastián (desarrollador, le arma el marketing digital al cliente). Escribirle en **español rioplatense**, informal. "Subir" = commitear y pushear.

Más contexto en `docs/`:
- [docs/negocio-y-marca.md](docs/negocio-y-marca.md) — datos del negocio, marca, qué es real y qué es de ejemplo
- [docs/plan-marketing.md](docs/plan-marketing.md) — plan de marketing digital 100% orgánico (Instagram, Google, WhatsApp, B2B, referidos)
- [docs/videos.md](docs/videos.md) — cómo armar los reels a partir de las fotos de obra

## Comandos

```bash
npm install        # Node 22+
npm run dev        # http://localhost:3000
npm run lint       # tsc --noEmit (tiene que pasar sin errores)
npm run build      # build del cliente + build SSR + pre-render (scripts/prerender.mjs) → dist/
npm run preview    # sirve dist/ para revisar la build
```

## Deploy

Cada push a `main` publica solo en GitHub Pages con `.github/workflows/deploy.yml` (lint → build → Pages). Tarda ~30 s. `vite.config.ts` usa `base: './'`, así que las rutas son relativas: no cambiarlo o se rompen las imágenes bajo `/AquaTechSolutions/`.

### Pre-render y SEO

`npm run build` hace tres pasos: build del cliente, build SSR de `src/entry-server.tsx` y `scripts/prerender.mjs`, que:
- mete el HTML de la app ya renderizado en `dist/index.html` (marcador `<!--app-->`); el cliente lo **hidrata** (`hydrateRoot` en `main.tsx`), así que lo que renderiza el servidor y el cliente tiene que coincidir: nada de `window`, `Date.now()` ni azar durante el render, solo en `useEffect`;
- inserta los datos estructurados `HomeAndConstructionBusiness` (marcador `<!--jsonld-->`), armados en `jsonLd()` de `entry-server.tsx` **solo con datos confirmados**;
- genera `sitemap.xml` y `robots.txt`.

**`site.config.json` es la única fuente** de URL, nombre, título, descripción y teléfono del sitio (la usan `vite.config.ts` para completar `%SITE_URL%`, `%TITLE%` y `%DESCRIPTION%` en `index.html`, y el pre-render). La imagen para compartir es `public/og-image.png` (1200×630).

### Pasar al dominio propio

1. Cambiar `url` en `site.config.json` (con `/` final, ej. `https://aquatech.com.ar/`).
2. Crear `public/CNAME` con el dominio (una sola línea, sin `https://`).
3. En el proveedor del dominio: registros `A` del apex a 185.199.108.153, .109.153, .110.153 y .111.153 (y `CNAME` de `www` a `geroo03.github.io`).
4. GitHub → Settings → Pages → Custom domain + "Enforce HTTPS".
5. Dar de alta el sitio en Google Search Console y enviar el `sitemap.xml`.

### Analítica

`src/analytics.ts` registra el evento **"WhatsApp"** en cada clic a `wa.me` con su `origen` (id de la sección, `header`, `footer`, `flotante` o el nombre del modal; se puede forzar con `data-origen`). No hace nada hasta que se configura un proveedor: cargar `VITE_PLAUSIBLE_DOMAIN` (Plausible, sin cookies) **o** `VITE_GA_ID` (Google Analytics 4) en GitHub → Settings → Secrets and variables → Actions → **Variables**. `vite.config.ts` inyecta el script solo si existe la variable.

## Stack y estructura

React 19 + TypeScript (strict) + Vite 8 + Tailwind CSS 4 (`@tailwindcss/vite`) + `lucide-react` (íconos). Fuentes Inter y Montserrat servidas desde el repo (`@fontsource-variable`), sin Google Fonts. Sin backend: todo es estático, pre-renderizado, y los formularios abren WhatsApp con el mensaje armado.

```
site.config.json          URL, nombre, título, descripción, teléfono (fuente única)
scripts/prerender.mjs     pre-render + JSON-LD + sitemap + robots
src/
  main.tsx                hidrata (prod) o renderiza (dev), fuentes, analítica
  entry-server.tsx        render() y jsonLd() para el pre-render
  analytics.ts            track() y clics a WhatsApp
  App.tsx                 orden de secciones + estado de los 3 modales (cargados con lazy)
  index.css               tokens de color (@theme), estilos base (@layer base), animaciones
  data/mockData.ts        TODOS los textos y datos: servicios, obras, zonas, testimonios, FAQ, teléfono
  types.ts
  components/
    Brand.tsx             Logo, LogoMark (la "Λ"), íconos SVG de WhatsApp / Instagram / Facebook
    ui.tsx                waLink(), Eyebrow, SectionHeader, Reveal (IntersectionObserver), Modal, Select, IconTile
    Header, Hero, ServicesSection, BeforeAfterSection, ProcessSection, WarrantySection,
    CoverageZonesSection, TestimonialsSection, FaqSection, CallToAction, Footer,
    FloatingWhatsApp, QuoteCalculatorModal, DiagnosticModal, WarrantyModal
public/
  images/*.webp           fotos en WebP (hoy son de ejemplo generadas por IA, 512 px)
  og-image.png            imagen para compartir en WhatsApp/redes (1200×630)
  logo-aquatech.png       logo original del cliente (disco plateado)
  favicon.svg
```

## Convenciones de diseño (respetarlas)

- **Monocromo, tomado del logo**: usar solo los tokens de `index.css` → `ink` (#0b0b0c), `ink-2`, `graphite`, `muted`, `silver`, `line`, `mist`, `paper`, blanco. Nada de azules ni del verde de WhatsApp; los botones de WhatsApp son negros (o blancos sobre fondo oscuro).
- **Íconos: solo SVG** (`lucide-react` o los de `Brand.tsx`). **Nunca emojis** ni Material Symbols.
- Tipografía: títulos en Montserrat (`font-headline`), texto en Inter. Etiquetas de sección con `<Eyebrow>` (línea fina + mayúsculas espaciadas, como "SOLUTIONS" en el logo).
- Formas: tarjetas `rounded-3xl ring-1 ring-line`, botones `rounded-full`.
- Textos en español rioplatense (vos, mandá, pedí).
- Todo contacto sale por `waLink(texto)` de `ui.tsx` (número en `PHONE_NUMBER` de `mockData.ts`).
- Modales: usar el componente `Modal` (cierra con Esc / tocando afuera y bloquea el scroll). Los modales de `App.tsx` se montan solo cuando están abiertos y se cargan con `lazy`.
- Animaciones de aparición: `<Reveal>` (sin librerías). Solo oculta contenido si `<html>` tiene la clase `js`, para que el HTML pre-renderizado se lea sin JavaScript. **El hero no lleva animación de entrada** (es el LCP en celular).
- Imágenes nuevas: en WebP, con `width`/`height`, y `loading="lazy"` si no están arriba de todo.
- Rutas de archivos de `public/`: siempre relativas (`./images/...`). **No usar `import.meta.env.BASE_URL`**: en la build SSR vale `/` y el HTML pre-renderizado apunta a la raíz del dominio (en Pages da 404). En local no se nota porque `preview` sirve desde la raíz: verificar siempre en la URL publicada.
- Accesibilidad: Lighthouse tiene que dar 100. Ojo con el contraste de textos grises sobre negro (mínimo `text-white/60`) y con el orden de los títulos.
- Estilos globales siempre dentro de `@layer base`, si no pisan las utilidades de Tailwind (ya pasó con el `tracking`).
- Mobile primero: probar a 390 px de ancho; el título del hero usa `clamp()` para que "Impermeabilizaciones" entre.

## Reglas sobre los datos

- **No inventar datos del negocio** (precios, años de garantía, matrículas, direcciones, reseñas, cantidades de obras, certificaciones). Si falta un dato, dejarlo como pendiente y avisar.
- Lo que hoy es de ejemplo está listado en `docs/negocio-y-marca.md` → "Pendiente de confirmar". Al reemplazarlo por datos reales, sacar también la nota "Testimonios ilustrativos para esta demo".
- El email `contacto@aquatech.com.ar` que traía la plantilla se sacó a propósito (el dominio no es del cliente).

## Cómo verificar cambios visuales

Antes de dar algo por terminado: `npm run lint && npm run build`, levantar `npm run preview` y sacar capturas en **1440×900 y 390×844** (Playwright con `channel: 'chrome'` funciona en esta Mac). Revisar: sin errores de consola (incluidos los de hidratación), sin scroll horizontal, sin texto cortado, imágenes cargando, modales y menú mobile, y que con JavaScript desactivado se vea todo el contenido. Con el scroll suave activo las capturas salen corridas: inyectar `html{scroll-behavior:auto}` antes de capturar.

Referencia Lighthouse (oct 2026, build local): celular 96 / 100 / 100 / 100, escritorio 100 / 100 / 100 / 100 (rendimiento / accesibilidad / buenas prácticas / SEO). No empeorarlo.

## Historial

- Base generada con Google AI Studio / Stitch (azul, emojis, imágenes remotas).
- Oct 2026: rediseño monocromo con el logo, íconos SVG, comparador antes/después arreglado, mapa vectorial, imágenes locales, mobile pulido y deploy automático a Pages.
- Oct 2026 (producción, parte técnica): pre-render + hidratación, JSON-LD, sitemap/robots, canonical y Open Graph absolutos con `og-image.png`, fuentes propias, WebP, modales lazy, sin `motion` (JS 422 → 291 KB), accesibilidad 100, analítica lista para activar, impresión del certificado, TypeScript strict y limpieza de restos de AI Studio.
