# Negocio y marca

## El negocio

| Dato | Valor |
| --- | --- |
| Nombre | AquaTech Solutions |
| Rubro | Impermeabilizaciones y control de humedad |
| Lema | "Impermeabilizaciones que perduran" |
| Base | Córdoba Capital, Argentina; trabaja en toda la provincia |
| WhatsApp | +54 351 613-4658 → `5493516134658` en los links `wa.me` |
| Instagram | [@aqua.tech.solutions](https://www.instagram.com/aqua.tech.solutions/) |
| Facebook | Tiene página (sin URL confirmada todavía) |
| Google Maps / web propia | No tiene (la ficha de Google es la prioridad nº 1 del plan) |
| Email / dominio | No confirmados |

**Servicios:** techos (membrana asfáltica + geotextil + terminación en poliuretano), terrazas y balcones, humedad de cimientos, filtraciones, tanques y piletas, mantenimiento preventivo.

**Datos reales que sí sabemos** (de su Instagram, oct 2026): hizo una obra con membrana asfáltica + geotextil + poliuretano en un country del sur de Córdoba; ofrece "trabajos garantizados" y "calidad garantizada"; ~78 seguidores y reels de junio a septiembre de 2026.

**Mercado:** en Córdoba, geotextil + poliuretano se cobra entre $32.000 y $48.000 por m² con materiales y mano de obra (referencia de Servidos, julio 2026). La temporada fuerte es de octubre a marzo (tormentas).

## Marca

- Logo: `public/logo-aquatech.png` — disco plateado con la "Λ" negra, **AQUATECH** en negrita, **SOLUTIONS** espaciado, una línea fina y "IMPERMEABILIZACIONES QUE PERDURAN".
- Versión vectorial en `src/components/Brand.tsx` (`Logo`, `LogoMark`).
- Paleta: negro tinta #0b0b0c, grafito #3a3a3f, gris #6e6e75, plata #c9c9cd, blanco. Degradé plateado del disco en `.bg-silver-disc`.
- Tipografías: Montserrat (títulos) e Inter (texto).

## Pendiente de confirmar con el dueño

Todo esto está en la demo como **ejemplo** y hay que reemplazarlo por datos reales antes de usarla con clientes:

- [ ] **Fotos de obras**: las 3 obras de "Trabajos" (`CASE_STUDIES`) y la foto del hero son imágenes generadas por IA. Sus m², tiempos y descripciones también son de ejemplo.
- [ ] **Testimonios** (`TESTIMONIALS`): inventados. Hay que reemplazarlos por reseñas reales (idealmente de Google) y sacar la nota "Testimonios ilustrativos para esta demo".
- [ ] **Años de garantía** por servicio (10 / 7 / 10 / 5 / 7 / 5) y el "hasta 10 años" del certificado y del hero.
- [ ] **Precios del cotizador** (`QuoteCalculatorModal.tsx`, `SYSTEMS`): entre $22.000 y $38.000 por m², según el sistema.
- [ ] **Materiales y marcas** (Sika, Megaflex, Ormiflex) de cada ficha técnica.
- [ ] **Horario**: "Lunes a sábado, de 8 a 19 h" (`OPENING_HOURS`).
- [ ] **Zonas** y tiempos de visita (`ZONES`).
- [ ] **FAQ**: confirmar si emite Factura A/B, si tiene ART para el personal, si financia en cuotas y si el certificado de garantía lleva número.
- [ ] URL de Facebook, email y dominio propio (si va a tener).
