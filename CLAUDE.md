# AquaTech Solutions — contexto para Claude Code

Web de **AquaTech Solutions**, empresa de impermeabilizaciones de Córdoba, Argentina. Hoy es una **demo** para presentarle al dueño; el objetivo es convertirla en la web real que genere consultas por WhatsApp.

- Demo publicada: https://geroo03.github.io/AquaTechSolutions/
- Repo: https://github.com/geroo03/AquaTechSolutions
- Trabaja en esto Sebastián (desarrollador, le arma el marketing digital al cliente). Escribirle en **español rioplatense**, informal. "Subir" = commitear y pushear.

Más contexto en `docs/`:
- [docs/negocio-y-marca.md](docs/negocio-y-marca.md) — datos del negocio, marca, qué es real y qué es de ejemplo
- [docs/plan-marketing.md](docs/plan-marketing.md) — plan de marketing digital (Instagram, Google, Meta Ads, WhatsApp)
- [docs/videos.md](docs/videos.md) — cómo armar los reels a partir de las fotos de obra

## Comandos

```bash
npm install        # Node 22+
npm run dev        # http://localhost:3000
npm run lint       # tsc --noEmit (tiene que pasar sin errores)
npm run build      # genera dist/
npm run preview    # sirve dist/ para revisar la build
```

## Deploy

Cada push a `main` publica solo en GitHub Pages con `.github/workflows/deploy.yml` (lint → build → Pages). Tarda ~30 s. `vite.config.ts` usa `base: './'`, así que las rutas son relativas: no cambiarlo o se rompen las imágenes bajo `/AquaTechSolutions/`.

## Stack y estructura

React 19 + TypeScript + Vite 8 + Tailwind CSS 4 (`@tailwindcss/vite`) + `motion` (animaciones) + `lucide-react` (íconos). Sin backend: todo es estático y los formularios abren WhatsApp con el mensaje armado.

```
src/
  App.tsx                 orden de secciones + estado de los 3 modales
  index.css               tokens de color (@theme), estilos base (@layer base), animaciones
  data/mockData.ts        TODOS los textos y datos: servicios, obras, zonas, testimonios, FAQ, teléfono
  types.ts
  components/
    Brand.tsx             Logo, LogoMark (la "Λ"), íconos SVG de WhatsApp / Instagram / Facebook
    ui.tsx                waLink(), Eyebrow, SectionHeader, Reveal, Modal, Select, IconTile
    Header, Hero, ServicesSection, BeforeAfterSection, ProcessSection, WarrantySection,
    CoverageZonesSection, TestimonialsSection, FaqSection, CallToAction, Footer,
    FloatingWhatsApp, QuoteCalculatorModal, DiagnosticModal, WarrantyModal
public/
  images/                 fotos (hoy son de ejemplo generadas por IA, 512 px)
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
- Modales: usar el componente `Modal` (cierra con Esc / tocando afuera y bloquea el scroll).
- Estilos globales siempre dentro de `@layer base`, si no pisan las utilidades de Tailwind (ya pasó con el `tracking`).
- Mobile primero: probar a 390 px de ancho; el título del hero usa `clamp()` para que "Impermeabilizaciones" entre.

## Reglas sobre los datos

- **No inventar datos del negocio** (precios, años de garantía, matrículas, direcciones, reseñas, cantidades de obras, certificaciones). Si falta un dato, dejarlo como pendiente y avisar.
- Lo que hoy es de ejemplo está listado en `docs/negocio-y-marca.md` → "Pendiente de confirmar". Al reemplazarlo por datos reales, sacar también la nota "Testimonios ilustrativos para esta demo".
- El email `contacto@aquatech.com.ar` que traía la plantilla se sacó a propósito (el dominio no es del cliente).

## Cómo verificar cambios visuales

Antes de dar algo por terminado: `npm run lint && npm run build`, levantar `npm run preview` y sacar capturas en **1440×900 y 390×844** (Playwright con `channel: 'chrome'` funciona en esta Mac). Revisar: sin errores de consola, sin scroll horizontal, sin texto cortado, imágenes cargando, modales y menú mobile. Con el scroll suave activo las capturas salen corridas: inyectar `html{scroll-behavior:auto}` antes de capturar.

## Historial

- Base generada con Google AI Studio / Stitch (azul, emojis, imágenes remotas).
- Oct 2026: rediseño monocromo con el logo, íconos SVG, comparador antes/después arreglado, mapa vectorial, imágenes locales, mobile pulido y deploy automático a Pages.
