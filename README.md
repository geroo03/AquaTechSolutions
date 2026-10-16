# AquaTech Solutions — web

Web de AquaTech Solutions, impermeabilizaciones en Córdoba, Argentina.

**Web:** https://aquatechsolutions.com.ar/

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # dist/ — cada push a main se publica solo en GitHub Pages
```

El contexto completo para trabajar con Claude Code está en [CLAUDE.md](CLAUDE.md) y en [docs/](docs/).

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
