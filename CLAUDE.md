# AquaTech Solutions — contexto para Claude Code

Web de **AquaTech Solutions**, empresa de impermeabilizaciones de Córdoba, Argentina. La web está publicada con dominio propio y permite pedir presupuestos por WhatsApp.

- Web publicada: https://aquatechsolutions.com.ar/ (github.io redirige al dominio propio)
- Repo: https://github.com/geroo03/AquaTechSolutions
- Trabaja en esto Sebastián (desarrollador, le arma el marketing digital al cliente). Escribirle en **español rioplatense**, informal. "Subir" = commitear y pushear.

Más contexto en `docs/`:
- [docs/negocio-y-marca.md](docs/negocio-y-marca.md) — datos del negocio, marca, qué es real y qué es de ejemplo
- [docs/plan-marketing.md](docs/plan-marketing.md) — plan de marketing digital 100% orgánico (Instagram, Google, WhatsApp, B2B, referidos)
- [docs/videos.md](docs/videos.md) — cómo armar los reels a partir de las fotos de obra

## Comandos

```bash
npm install        # Node 24 (igual que GitHub Actions)
npm run dev        # http://localhost:3000
npm run lint       # tsc --noEmit (tiene que pasar sin errores)
npm run test:security # validación de configuración y restricciones de la build
npm run build      # build del cliente + build SSR + pre-render (scripts/prerender.mjs) → dist/
npm run preview    # sirve dist/ para revisar la build
```

## Deploy

Cada push a `main` con cambios de la web publica en GitHub Pages con `.github/workflows/deploy.yml` (lint → build → pruebas de navegador → Pages). Los cambios exclusivos de `bots/` no publican la web. `vite.config.ts` usa `base: './'`: conservarlo para soportar el dominio propio y el prefijo `/AquaTechSolutions/`.

### Pre-render y SEO

`npm run build` hace tres pasos: build del cliente, build SSR de `src/entry-server.tsx` y `scripts/prerender.mjs`, que:
- genera todas las rutas de `src/routes.ts` como archivos `index.html` pre-renderizados. El cliente **hidrata** la página correspondiente: no leer datos del navegador durante el render inicial;
- inserta los datos estructurados `HomeAndConstructionBusiness` (marcador `<!--jsonld-->`), armados en `jsonLd()` de `entry-server.tsx` **solo con datos confirmados**;
- genera metadatos por página, `sitemap.xml` con todas las rutas y `robots.txt`. Un `<base>` relativo en cada HTML mantiene funcionando recursos y enlaces desde rutas anidadas. No publicar todas las páginas con el canonical de la portada.

**`site.config.json` es la única fuente** de URL, nombre, título, descripción y teléfono del sitio (sin dirección: no se publica) (la usan `vite.config.ts` para completar `%SITE_URL%`, `%TITLE%` y `%DESCRIPTION%` en `index.html`, y el pre-render). La imagen para compartir es `public/og-image.png` (1200×630).

Los títulos y descripciones de páginas internas viven en `src/routes.ts`; la portada usa los de `site.config.json`. `src/data/serviceDetails.ts` contiene los textos de los tres servicios. La página de GreenVille usa únicamente los datos confirmados y enlaza las imágenes originales en Instagram. `src/pages/BusinessPage.tsx` contiene la página para consorcios y empresas, con consulta por WhatsApp; sus campos no se guardan ni se mandan a un servidor del sitio.

La atribución vive en `src/attribution.ts` y se agrega a los enlaces de WhatsApp al hacer clic, sin cambiar el HTML de hidratación. Ver `docs/medicion-consultas.md`. `npm run test:web` comprueba escritorio y celular contra la build estática; localmente usa Chrome y en CI Chromium.

### Seguridad y reseñas

`prerender.mjs` aplica `secureHtml()` de `scripts/security.ts` después de generar el HTML final. Los hashes de scripts inline deben coincidir con ese HTML: no mover este paso antes de Vite ni añadir `unsafe-inline` / `unsafe-eval` a scripts. La CSP restringe recursos, conexiones y formularios; permite CSS inline por los estilos de React. Las cabeceras HTTP y el WAF requieren configurar Cloudflare: estado y regla preparada en `docs/seguridad.md`; no afirmar que están activos solo por existir el JSON.

`site.config.json` contiene `reviewUrl`, verificado contra el Place ID público de AquaTech. `docs/resenas-google.md` explica la comprobación y el mensaje para clientes. La web enlaza a escribir reseñas, no publica comentarios automáticamente ni muestra puntuaciones no verificadas.

### Promos temporales

`src/data/promo.ts` define la promo vigente (textos, precios y `endsAt` con hora de Córdoba, `-03:00`). Se ve como sección `#promo` después del hero y como aviso en el hero. Desaparece sola al vencer:
- al compilar no se genera (`__BUILD_TIME__`, definido en `vite.config.ts`), y el workflow **recompila todos los días a las 00:05 de Argentina** (`schedule` en `deploy.yml`);
- en el navegador, `usePromoActive()` arranca con la fecha de compilación (para que el pre-render y la hidratación coincidan) y después chequea la fecha real.

Para una promo nueva: editar `promo.ts` y subir. Para probar el vencimiento: Playwright con `page.clock.install({ time })`.

### Pasar al dominio propio

**Estado verificado (17/10/2026):** dominio registrado (titular Martín, vence 15/10/2027) y conectado a GitHub Pages mediante Cloudflare Free, con nameservers `angelina.ns.cloudflare.com` y `rohin.ns.cloudflare.com`. La web responde en HTTPS y HTTP redirige a HTTPS. El DNS público del dominio muestra el proxy de Cloudflare activo; la anotación anterior de "DNS only" correspondía a la configuración inicial. El modo SSL actual de la cuenta no se comprobó. La API de Pages todavía informa el certificado de origen en `authorization_created` y `https_enforced: false`; eso es distinto del HTTPS público, que funciona. No cambiar DNS o SSL basándose en la configuración histórica sin revisar el panel.

Referencia de conexión inicial para **aquatechsolutions.com.ar** (ver el estado actual arriba). NIC Argentina solo **delega** el dominio a servidores DNS (no permite cargar registros A), así que el DNS va en Cloudflare (gratis):
1. El titular (Martín, con su CUIT) lo registra en [nic.ar](https://nic.ar) entrando con su Clave Fiscal de ARCA.
2. En Cloudflare: "Add a domain" → `aquatechsolutions.com.ar` → plan Free. Cloudflare da dos nameservers.
3. En NIC Argentina → el dominio → "Delegaciones": cargar esos dos nameservers. Puede tardar unas horas.
4. En Cloudflare DNS: registros `A` del apex a 185.199.108.153, 185.199.109.153, 185.199.110.153 y 185.199.111.153, y `CNAME` de `www` a `geroo03.github.io`, todos en **DNS only** (nube gris) al principio, para que GitHub pueda emitir el certificado.
5. Repo: `url` en `site.config.json` → `https://aquatechsolutions.com.ar/`, crear `public/CNAME` con `aquatechsolutions.com.ar`, subir.
6. GitHub → Settings → Pages → Custom domain + "Enforce HTTPS".
7. Cloudflare Web Analytics: agregar el hostname nuevo y actualizar `VITE_CF_BEACON_TOKEN` (con el dominio en Cloudflare también se puede activar automático).
8. Google Search Console: alta del dominio y envío del `sitemap.xml`.

### Analítica

**Activa: Cloudflare Web Analytics** (gratis, sin cookies) con la variable `VITE_CF_BEACON_TOKEN` del repo (desde el 15/10/2026, hostname `geroo03.github.io`, cuenta de Cloudflare de Sebastián; panel en Observability → Analytics → Web analytics). Al pasar al dominio propio hay que agregar el hostname nuevo en Cloudflare y actualizar el token. Cuenta visitas pero no clics por botón, así que **cada mensaje de WhatsApp de la web es distinto según el botón y termina con "(Enviado desde la web)"** (lo agrega `waLink()`): el dueño cuenta las consultas en su propio WhatsApp. Alternativas: `VITE_PLAUSIBLE_DOMAIN` (pago) o `VITE_GA_ID` (GA4); con esas, `src/analytics.ts` registra además el evento "WhatsApp" con su `origen`. Las variables se cargan en GitHub → Settings → Secrets and variables → Actions → **Variables**; `vite.config.ts` inyecta el script solo si existe la variable.

### Panel de presupuestos (/presupuestos/, con login)

Herramienta interna para que Martín arme presupuestos y se los mande al cliente: https://aquatechsolutions.com.ar/presupuestos/ (26/10/2026). Es una segunda página de Vite (`presupuestos/index.html` → `src/presupuestos/`), sin pre-render, con `noindex`, `Disallow` en `robots.txt`, fuera del sitemap y sin enlaces desde la web. `prerender.mjs` le aplica la misma CSP, más el origen de Supabase en `connect-src`.
- **Login y datos en Supabase**: proyecto `aquatech-presupuestos` (ref `vbfmtbdilgbqnyegsgco`, sa-east-1, plan gratis, org "hackatoh" de Sebastián). URL y clave publicable en `src/presupuestos/supabase.json` (públicas a propósito). Tablas `presupuestos` (el presupuesto entero en `data` jsonb) y `emisor` (dirección, CUIT, etc. del PDF), con RLS: cada usuario ve y edita solo lo suyo, y `anon` no tiene acceso.
- **Solo existe la cuenta de Martín** (`aquatech.cba@gmail.com`): el trigger `private.solo_permitidos` rechaza cualquier alta que no esté en `private.usuarios_permitidos`. Para sumar a alguien: insertar su mail en esa tabla y crear el usuario. La contraseña se cambia desde el panel (botón de cuenta). No hay "olvidé mi contraseña" por mail (el SMTP gratis de Supabase no manda a mails externos): si la olvida, Sebastián la resetea desde Supabase.
- El plan gratis pausa el proyecto tras 7 días sin uso: `.github/workflows/supabase-activo.yml` llama a la función `ping()` cada 3 días.
- `Gate.tsx`: login y carga. `BudgetApp.tsx`: el panel; guarda en la nube con una espera de 0,7 s, reintenta si no hay conexión y avisa antes de cerrar con cambios sin guardar. `cloud.ts`: Supabase. `model.ts`: datos y cálculos (cantidad × precio, "global" = precio total, descuento %), número correlativo, copia de seguridad en JSON.
- `pdf.ts`: PDF A4 con jsPDF (se carga solo en el panel, no pesa en la web): cabecera negra con el logo, marca de agua (la "Λ", "AQUATECH" y trama diagonal), tabla, total, garantía, detalle, condiciones y firma del cliente. Helvetica (WinAnsi): `clean()` saca emojis.
- **Dirección y CUIT no están en el código** (no se publican): Martín los carga una vez en "Datos del negocio" y quedan en su cuenta.
- "Enviar por WhatsApp": en el celular comparte el PDF con el menú del sistema; en la compu lo descarga y abre el chat del cliente con el mensaje (el PDF se adjunta a mano).
- Dos secciones, **Mano de obra** y **Materiales** (`kind` de cada línea; los presupuestos viejos sin `kind` son mano de obra), cada una con su subtotal en el panel y en el PDF. El descuento se aplica solo a la mano de obra. Si no hay materiales, el PDF dice que no están incluidos. Los materiales son totalmente editables: unidad libre (con sugerencias) y una lista propia **"Mis materiales"** (nombre, unidad y precio) que Martín edita y que completa las líneas al elegirlas; se guarda en la tabla `catalogo` (RLS como `emisor`). Cada línea de material tiene "Guardar en mis materiales". Opción **"Sin precios de materiales"** (`materialsUnpriced`): los materiales se listan solo con cantidad, no suman, el PDF los muestra "a cotizar" y el total dice "TOTAL MANO DE OBRA" (los precios varían y se cotizan al comprar).
- Precios: solo el de la promo ($10.000/m² de mano de obra) viene cargado; el resto lo pone Martín en cada presupuesto.
- La prueba de `tests/web/presupuestos.spec.ts` simula Supabase: no toca la base real.

## Stack y estructura

React 19 + TypeScript (strict) + Vite 8 + Tailwind CSS 4 (`@tailwindcss/vite`) + `lucide-react` (íconos). Fuentes Inter y Montserrat servidas desde el repo (`@fontsource-variable`), sin Google Fonts. Sin backend: todo es estático, pre-renderizado, y los formularios abren WhatsApp con el mensaje armado.

```
site.config.json          URL, nombre, título, descripción, teléfono (fuente única)
scripts/prerender.mjs     pre-render + JSON-LD + sitemap + robots
src/
  main.tsx                hidrata (prod) o renderiza (dev), fuentes, analítica
  entry-server.tsx        render() y jsonLd() para el pre-render
  analytics.ts            track() y clics a WhatsApp
  App.tsx                 orden de secciones de la portada
  components/SiteLayout.tsx cabecera, pie y estado de los modales (cargados con lazy)
  index.css               tokens de color (@theme), estilos base (@layer base), animaciones
  data/mockData.ts        TODOS los datos del negocio (solo confirmados): servicios, garantías, obra, zonas, FAQ, contacto
  types.ts
  components/
    Brand.tsx             Logo, LogoMark (la "Λ"), íconos SVG de WhatsApp / Instagram / Facebook
    ui.tsx                waLink(), Eyebrow, SectionHeader, Reveal (IntersectionObserver), Modal, Select, IconTile
    Header, Hero, ServicesSection, BeforeAfterSection, ProcessSection, WarrantySection,
    CoverageZonesSection, TestimonialSection, FaqSection, CallToAction, Footer, PromoSection,
    FloatingWhatsApp, QuoteCalculatorModal (sin precios), DiagnosticModal
public/
  images/*.webp           fotos reales de obra en WebP; hero con variante para celular
  og-image.png            imagen para compartir en WhatsApp/redes (1200×630)
  logo-aquatech.png       logo original del cliente (disco plateado; también va en el PDF)
  favicon.svg
presupuestos/index.html   panel interno de presupuestos (src/presupuestos/)
```

## Convenciones de diseño (respetarlas)

- **Monocromo, tomado del logo**: usar solo los tokens de `index.css` → `ink` (#0b0b0c), `ink-2`, `graphite`, `muted`, `silver`, `line`, `mist`, `paper`, blanco. Nada de azules ni del verde de WhatsApp; los botones de WhatsApp son negros (o blancos sobre fondo oscuro).
- **Íconos: solo SVG** (`lucide-react` o los de `Brand.tsx`). **Nunca emojis** ni Material Symbols.
- Tipografía: títulos en Montserrat (`font-headline`), texto en Inter. Etiquetas de sección con `<Eyebrow>` (línea fina + mayúsculas espaciadas, como "SOLUTIONS" en el logo).
- Formas: tarjetas `rounded-3xl ring-1 ring-line`, botones `rounded-full`.
- Textos en español rioplatense (vos, mandá, pedí).
- Todo contacto sale por `waLink(texto)` de `ui.tsx` (número en `PHONE_NUMBER` de `mockData.ts`).
- Modales: usar el componente `Modal` (contiene el foco, vuelve al botón de apertura, cierra con Esc / tocando afuera y bloquea el fondo). Los modales de `SiteLayout.tsx` se montan solo cuando están abiertos y se cargan con `lazy`.
- Animaciones de aparición: `<Reveal>` (sin librerías). Solo oculta contenido si `<html>` tiene la clase `js`, para que el HTML pre-renderizado se lea sin JavaScript. **El hero no lleva animación de entrada** (es el LCP en celular). La foto del hero es decorativa: **sin preload y con `fetchPriority="low"`** (precargarla retrasaba el texto, que es el LCP: el rendimiento en celular bajaba de 97 a 85).
- Imágenes nuevas: en WebP, con `width`/`height`, y `loading="lazy"` si no están arriba de todo.
- Rutas de archivos de `public/`: siempre relativas (`./images/...`). **No usar `import.meta.env.BASE_URL`**: en la build SSR vale `/` y el HTML pre-renderizado apunta a la raíz del dominio (en Pages da 404). En local no se nota porque `preview` sirve desde la raíz: verificar siempre en la URL publicada.
- Accesibilidad: Lighthouse tiene que dar 100. Ojo con el contraste de textos grises sobre negro (mínimo `text-white/60`) y con el orden de los títulos.
- Estilos globales siempre dentro de `@layer base`, si no pisan las utilidades de Tailwind (ya pasó con el `tracking`).
- Mobile primero: probar a 390 px de ancho; el título del hero usa `clamp()` para que "Impermeabilizaciones" entre.

## Reglas sobre los datos

- `src/data/mockData.ts` tiene **solo datos confirmados** por el dueño (Martín Emiliano Nieto) o por Sebastián: desde 2008, +15.000 m², garantía por sistema y por escrito, presupuesto sin cargo en menos de 24 h, respuesta en ~20 min, horario todos los días de 8 a 20 h (barrios privados: lunes a viernes), cuotas con Mercado Pago, zonas (Córdoba y provincias limítrofes), seguro, obras que se pueden nombrar, email, Instagram y Facebook. La fuente y la lista de lo que falta están en `docs/negocio-y-marca.md`.
- **Plan de Mantenimiento**: la fuente de verdad es el contrato versión 1.0 (21/10/2026), cargado en `src/data/mantenimiento.ts`. Nunca "póliza" ni "seguro" para el plan, sin precios del abono ni de urgencias, nada de gas (lo atiende un gasista matriculado), y sin dirección, CUIT, CBU ni PDF del contrato.
- **No inventar datos del negocio** ni poner lo no confirmado: precios fuera de la promo, medios de pago distintos de Mercado Pago, tipo de factura (A/B/C), "visita sin cargo" (la visita puede cobrar viáticos), marcas de materiales, certificados o testimonios. La dirección **Caseros 1191, Córdoba**, y el enlace de Google Maps fueron proporcionados por Sebastián el 17/10/2026 con instrucción expresa de publicarlos en el footer; esa instrucción reemplaza la indicación anterior de ocultar la calle. No afirmar que hay atención presencial sin confirmarlo. Si falta un dato, dejarlo afuera y avisar.
- La garantía se muestra **por sistema**, no por servicio. Lo que no encaja en un sistema: "Garantía según el sistema".
- Fotos: el hero, la sección "En obra" (`WorkGallerySection`, `WORK_PHOTOS`) y `og-image.png` usan fotos reales de Martín. Trabajos muestra obras reales de las redes (`WORKS`), con link al posteo. Ya no quedan imágenes de IA. El comparador antes/después se sacó y está en el historial de git (`ComparisonSlider`), para volver a usarlo cuando lleguen las fotos originales. Las fotos nuevas van en WebP, y el hero tiene versión de 960 px para celular (`srcSet`).
- Testimonios: solo la reseña autorizada de Alejandra G. (Muovi). Sumar únicamente reseñas reales (Google) o con autorización expresa de quien la escribió.

## Cómo verificar cambios visuales

Antes de dar algo por terminado: `npm run lint && npm run build`, levantar `npm run preview` y sacar capturas en **1440×900 y 390×844** (Playwright con `channel: 'chrome'` funciona en esta Mac). Revisar: sin errores de consola (incluidos los de hidratación), sin scroll horizontal, sin texto cortado, imágenes cargando, modales y menú mobile, y que con JavaScript desactivado se vea todo el contenido. Con el scroll suave activo las capturas salen corridas: inyectar `html{scroll-behavior:auto}` antes de capturar.

Referencia Lighthouse (oct 2026, build local): celular 96 / 100 / 100 / 100, escritorio 100 / 100 / 100 / 100 (rendimiento / accesibilidad / buenas prácticas / SEO). No empeorarlo.

## Historial

- Base generada con Google AI Studio / Stitch (azul, emojis, imágenes remotas).
- Oct 2026: rediseño monocromo con el logo, íconos SVG, comparador antes/después arreglado, mapa vectorial, imágenes locales, mobile pulido y deploy automático a Pages.
- 16/10/2026 (5): Trabajos con 6 obras reales del relevamiento de redes; se sacaron las imágenes de IA. Las contradicciones de garantías y del año están en docs/negocio-y-marca.md.
- 16/10/2026 (4): mapa de cobertura real (provincias del IGN, `scripts/build-map.py` → `src/data/mapShapes.ts`), con Córdoba y las limítrofes resaltables y los puntos de obras; +15.000 m²; animaciones de la promo en Servicios.
- 16/10/2026 (3): fotos reales de obra en el hero, la sección "En obra" y la imagen para compartir.
- 16/10/2026 (2): atención todos los días (barrios privados de lunes a viernes), cuotas con Mercado Pago, reseña autorizada de Alejandra G., horario en JSON-LD.
- 16/10/2026: respuestas de Martín (zonas, horario, presupuesto sin cargo, tiempos, garantía por escrito, seguro, obras nombradas). La promo queda sin fecha de fin.
- 15/10/2026: datos reales del dueño. Se sacaron testimonios, certificado, precios del cotizador y afirmaciones no confirmadas; garantía por sistema; pintura como servicio secundario; email y Facebook; Cloudflare Web Analytics.
- Oct 2026 (producción, parte técnica): pre-render + hidratación, JSON-LD, sitemap/robots, canonical y Open Graph absolutos con `og-image.png`, fuentes propias, WebP, modales lazy, sin `motion` (JS 422 → 291 KB), accesibilidad 100, analítica lista para activar, impresión del certificado, TypeScript strict y limpieza de restos de AI Studio.
