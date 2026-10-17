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

La portada se complementa con páginas de techos, humedad de cimientos y terrazas/balcones, y con el caso de Country GreenVille. Todas se generan como HTML estático con URL propia, metadatos y entrada en el sitemap. `src/routes.ts` define las rutas y `src/data/serviceDetails.ts` sus contenidos.

Los mensajes de WhatsApp incluyen el origen de la visita cuando se puede identificar. La guía de enlaces de campaña y la planilla comercial están en [docs/medicion-consultas.md](docs/medicion-consultas.md).

```bash
npm run lint
npm run build
npm run test:web  # requiere Chrome en local; GitHub Actions instala Chromium
```

Las pruebas recorren las páginas en escritorio y celular, revisan recursos, metadatos, ausencia de errores de hidratación, navegación, cotizador y atribución. También comprueban el contenido sin JavaScript. Las capturas y trazas se guardan en `test-results/`, fuera de Git. El workflow de Pages ejecuta estas pruebas antes de publicar.

## Bot de WhatsApp

El servidor del bot vive separado en [`bots/whatsapp/`](bots/whatsapp/README.md). Tiene su propio `package.json`, configuración, pruebas y Docker; los comandos de esta raíz siguen siendo los de la web. GitHub Pages publica únicamente la web: el bot requiere un servidor con almacenamiento persistente.

El workflow [`whatsapp-bot.yml`](.github/workflows/whatsapp-bot.yml) ejecuta las pruebas, revisa TypeScript, compila y arranca el contenedor en simulación. No necesita credenciales de Google ni una cuenta de WhatsApp.

## Etapas

1. **Demo para presentar** — hecha: rediseño con la marca, mobile y deploy automático.
   - **Parte técnica de producción** — hecha: pre-render, SEO local técnico, vista previa para compartir, rendimiento, accesibilidad y analítica lista para activar.
2. **Datos reales** — en curso: ya están los datos y las respuestas de Martín (15 y 16/10/2026). Ya hay fotos reales de obra; falta el antes y después de 3 obras para el comparador (lista en [docs/negocio-y-marca.md](docs/negocio-y-marca.md)). **Sin fotos reales no sale a producción.**
3. **Presencia en Google** — crear la ficha de Google Business, enlazarla desde la web y mostrar las reseñas reales.
4. **Dominio propio** — `aquatechsolutions.com.ar` (elegido por Martín, libre al 16/10/2026). Se compra en [nic.ar](https://nic.ar) con la Clave Fiscal del titular; conectarlo (pasos en [CLAUDE.md](CLAUDE.md) → "Pasar al dominio propio"), alta en Google Search Console y activar la analítica.
5. **Difusión orgánica** — reels semanales ([docs/videos.md](docs/videos.md)), Google Business, grupos de barrio, B2B y referidos ([docs/plan-marketing.md](docs/plan-marketing.md)). Sin anuncios pagos.
