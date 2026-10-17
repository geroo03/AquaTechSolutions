# AquaTech Solutions — web

Web de AquaTech Solutions, impermeabilizaciones en Córdoba, Argentina.

**Web:** https://aquatechsolutions.com.ar/

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # dist/ — cada push a main se publica solo en GitHub Pages
```

El contexto completo para trabajar con Claude Code está en [CLAUDE.md](CLAUDE.md) y en [docs/](docs/).

## Servicios, obras y medición

La portada se complementa con páginas de techos, humedad de cimientos y terrazas/balcones, con el caso de Country GreenVille y con una página para consorcios, countries y empresas. Todas se generan como HTML estático con URL propia, metadatos y entrada en el sitemap. `src/routes.ts` define las rutas y `src/data/serviceDetails.ts` sus contenidos. La página empresarial vive en `src/pages/BusinessPage.tsx` y prepara una consulta de WhatsApp con tipo de inmueble, organización, ubicación, superficie y problema; no almacena esos datos.

Los mensajes de WhatsApp incluyen el origen de la visita cuando se puede identificar. La guía de enlaces de campaña y la planilla comercial están en [docs/medicion-consultas.md](docs/medicion-consultas.md).

```bash
npm run lint
npm run test:security
npm run build
npm run test:web  # requiere Chrome en local; GitHub Actions instala Chromium
```

Las pruebas recorren las páginas en escritorio y celular, revisan recursos, metadatos, ausencia de errores de hidratación, navegación, cotizador, atribución y uso de los formularios con teclado. También comprueban el contenido sin JavaScript. Las capturas y trazas se guardan en `test-results/`, fuera de Git. El workflow de Pages ejecuta estas pruebas antes de publicar.

## Seguridad y reseñas

La build incorpora una CSP para restringir scripts y conexiones. Las protecciones implementadas y la regla preparada para Cloudflare están en [docs/seguridad.md](docs/seguridad.md). La regla de Cloudflare requiere acceso a esa cuenta y no se activa solo por publicar.

El enlace directo para escribir reseñas está en el footer, en Opiniones y en [docs/resenas-google.md](docs/resenas-google.md). `site.config.json` define `reviewUrl`.

## Bot de WhatsApp

El servidor del bot vive separado en [`bots/whatsapp/`](bots/whatsapp/README.md). Tiene su propio `package.json`, configuración, pruebas y Docker; los comandos de esta raíz siguen siendo los de la web. GitHub Pages publica únicamente la web: el bot requiere un servidor con almacenamiento persistente.

El workflow [`whatsapp-bot.yml`](.github/workflows/whatsapp-bot.yml) ejecuta las pruebas, revisa TypeScript, compila y arranca el contenedor en simulación. No necesita credenciales de Google ni una cuenta de WhatsApp.

## Etapas

1. **Demo para presentar** — hecha: rediseño con la marca, mobile y deploy automático.
   - **Parte técnica de producción** — hecha: pre-render, SEO local técnico, vista previa para compartir, rendimiento, accesibilidad y analítica lista para activar.
2. **Datos reales** — en curso: ya están los datos y las respuestas de Martín (15 y 16/10/2026). Ya hay fotos reales de obra; falta el antes y después de 3 obras para el comparador (lista en [docs/negocio-y-marca.md](docs/negocio-y-marca.md)). El comparador queda pendiente de esas fotos originales.
3. **Presencia en Google** — ficha enlazada en el footer, junto a Caseros 1191, Córdoba (datos compartidos por Sebastián el 17/10/2026). Pendiente confirmar su gestión y sumar reseñas reales verificadas.
4. **Dominio propio** — conectado: `aquatechsolutions.com.ar`, publicado con HTTPS. Pendiente confirmar el alta en Google Search Console, el envío del sitemap y la medición del nuevo hostname en Cloudflare; configuración en [CLAUDE.md](CLAUDE.md).
5. **Difusión orgánica** — reels semanales ([docs/videos.md](docs/videos.md)), Google Business, grupos de barrio, B2B y referidos ([docs/plan-marketing.md](docs/plan-marketing.md)). Sin anuncios pagos.
