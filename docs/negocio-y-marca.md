# Negocio y marca

Fuente: "Datos para la web de AquaTech" (15/10/2026). Todo lo de la tabla está confirmado por el dueño o por Sebastián. **No agregar a la web nada que no esté acá.**

## Datos confirmados

| Dato | Valor |
| --- | --- |
| Nombre | AquaTech Solutions |
| Dueño | Martín Emiliano Nieto |
| Lema | "Impermeabilizaciones que perduran" |
| Desde | 2008 |
| WhatsApp | +54 9 351 613-4658 → `https://wa.me/5493516134658` |
| Email | aquatech.cba@gmail.com |
| Instagram | https://www.instagram.com/aqua.tech.solutions/ |
| Facebook | https://www.facebook.com/p/Aquatech-Solutions-61563827794730/ |
| Dirección | **No se publica**: trabaja a domicilio y la dirección es su casa. En la web y en los datos estructurados va solo "Córdoba, Argentina". |
| Servicios | Techos (membrana asfáltica + geotextil + poliuretano), terrazas y balcones, humedad de cimientos, filtraciones, tanques y piletas, mantenimiento preventivo. Secundario: pintura interior y exterior. |
| Metros trabajados | 5.000 m² |
| Obra real con detalle | Country GreenVille (zona sur de Córdoba Capital): membrana asfáltica con geotextil de 4 mm y pintura poliuretánica (posteo de Instagram del 20/09/2026). En la web aparece **sin el nombre del country** hasta tener permiso. |

**Garantía, por sistema (no por servicio):**

| Sistema | Garantía |
| --- | --- |
| Membrana con geotextil | 10 años |
| Membrana con aluminio | 5 años |
| Pintura | 2 años |
| Tratamientos y productos específicos | 15, 20 o 25 años |

Para lo que no encaja en un sistema (tanques, piletas, cimientos): "garantía según el sistema, consultá".

## Decisiones tomadas en la web (15/10/2026)

- **Testimonios**: sección sacada hasta tener reseñas reales en Google. La única reseña real con texto es de Alejandra Guzmán en Muovi ("Hace más de 10 años me hicieron la impermeabilización del techo. Hasta ahora no tengo filtraciones."): **solo se puede usar si ella lo autoriza**. No usar las reseñas de Muovi escritas por el propio Martín.
- **Cotizador sin precios**: pide tipo de trabajo, m², estado y barrio, y arma el mensaje de WhatsApp. Si Martín quiere mostrar precios, que pase un rango por sistema.
- **Preguntas frecuentes**: solo las confirmadas (cómo pedir presupuesto, garantía por sistema, desde cuándo trabaja y zona). Se sacaron las de Factura A/B, ART, cuotas y certificado con número.
- **Sin afirmaciones no confirmadas**: se sacaron "presupuesto sin cargo", "visita sin cargo", "garantía escrita", "respuesta en el día", "presupuesto en 24 h", el horario, las marcas de materiales y el certificado modelo.
- **Fotos**: la del hero y la de la obra son ilustrativas (IA) y la web lo aclara. **Sin las fotos reales, la web no sale a producción.**
- **Analítica**: recomendada Cloudflare Web Analytics (gratis, sin cookies). No cuenta clics por botón, así que cada mensaje de WhatsApp de la web es distinto según el botón y termina en "(Enviado desde la web)".
- **Imagen para compartir**: el logo sobre fondo negro hasta tener una foto real de obra.

## Falta pedirle a Martín

- [ ] **Fotos originales de 3 obras con antes y después**, mandadas como documento por WhatsApp (ideal: GreenVille, Los Cerezos y una terraza). Las de los reels no sirven: son capturas de video.
- [ ] **Zonas que cubre** (hay obras en Capital, countries de zona sur y Jesús María; Facebook dice "provincia de Córdoba").
- [ ] **Horario** de atención.
- [ ] Si el **presupuesto y la visita son sin cargo**.
- [ ] **Dominio** y su **CUIT** para registrarlo en NIC Argentina a su nombre. Opciones para chequear: aquatechsolutions.com.ar, aquatechcordoba.com.ar, aquatechimpermeabilizaciones.com.ar. El costo lo fija NIC Argentina.
- [ ] **Permiso para nombrar obras**: Hospital Italiano, Colegio de Abogados de Jesús María, countries GreenVille, Campo de Vuelo, La Cascada y Los Cerezos.
- [ ] **Facturación y pagos**: Factura A/B, medios de pago, cuotas, ART y si la garantía se entrega por escrito.
- [ ] Autorización de Alejandra Guzmán para usar su reseña.

## Marca

- Logo: `public/logo-aquatech.png` — disco plateado con la "Λ" negra, **AQUATECH** en negrita, **SOLUTIONS** espaciado, una línea fina y "IMPERMEABILIZACIONES QUE PERDURAN".
- Versión vectorial en `src/components/Brand.tsx` (`Logo`, `LogoMark`).
- Paleta: negro tinta #0b0b0c, grafito #3a3a3f, gris #6e6e75, plata #c9c9cd y blanco.
- Tipografías: Montserrat (títulos) e Inter (texto).
