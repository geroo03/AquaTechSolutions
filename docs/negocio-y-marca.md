# Negocio y marca

Fuentes: "Datos para la web de AquaTech" (15/10/2026) y respuestas de Martín (16/10/2026). Todo lo de las tablas está confirmado por el dueño o por Sebastián. **No agregar a la web nada que no esté acá.**

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
| Zonas | Toda la provincia de Córdoba y las provincias limítrofes (Catamarca, Santiago del Estero, Santa Fe, Buenos Aires, La Pampa, San Luis, La Rioja) |
| Horario | Todos los días de 8 a 20 h. En barrios privados trabaja de lunes a viernes |
| Cuotas | Sí, con la financiación de Mercado Pago (con el interés que aplique MP según el plan que elija el cliente) |
| Presupuesto | **Sin cargo**, en menos de 24 h. Responde las consultas en unos 20 minutos |
| Visita para medir | Puede tener costo de viáticos según la distancia |
| Garantía | Se entrega **por escrito, en papel y en formato digital** |
| Facturación | Monotributista. Puede hacer factura; el precio de la mano de obra varía según el tipo. En la web va así, sin decir A/B/C (Martín lo aprobó) |
| Seguro | Tiene seguro y cumple los requisitos de higiene y seguridad según normas IRAM |
| Obras que se pueden nombrar | Hospital Italiano, Colegio de Abogados de Jesús María, countries GreenVille, Campo de Vuelo, La Cascada y Los Cerezos |
| Estadísticas | Martín ya tiene acceso a Cloudflare Web Analytics |
| Fotos propias | 16/10/2026: mandó 3 fotos reales de obra (techo con las sierras de fondo, aplicación en el borde y recorrida). Se usan en el hero, la sección "En obra" y la imagen para compartir |
| Dominio | **aquatechsolutions.com.ar**, registrado en NIC Argentina a nombre de Martín el 15/10/2026. **Vence el 15/10/2027**: renovar todos los años en nic.ar (costó $8.500) |
| Obra real con detalle | Country GreenVille (zona sur de Córdoba Capital): membrana asfáltica con geotextil de 4 mm y pintura poliuretánica (posteo de Instagram del 20/09/2026). Ya se puede nombrar. |

**Garantía, por sistema (no por servicio):**

| Sistema | Garantía |
| --- | --- |
| Membrana con geotextil | 10 años |
| Membrana con aluminio | 5 años |
| Pintura | 2 años |
| Tratamientos y productos específicos | 15, 20 o 25 años |

Para lo que no encaja en un sistema (tanques, piletas, cimientos): "garantía según el sistema, consultá".

## Promo vigente

**Promo de octubre 2026** (flyer de Martín, `Desktop/marketing.aquatech/Extras/aquatech-flyer-web.html`): precio de **mano de obra $10.000 por m²**, materiales no incluidos, "solo por este mes", para membrana asfáltica con aluminio flexible, membrana asfáltica con geotextil y pintura, y membrana líquida poliuretánica o acrílica. El 16/10/2026 Martín decidió **dejarla como estrategia de marketing** hasta pasar los precios definitivos: queda sin fecha de fin (`endsAt: null` en `src/data/promo.ts`), con "Por tiempo limitado" en lugar de "Solo por este mes".

## Decisiones tomadas en la web (15/10/2026)

- **Testimonios**: se muestra solo la reseña de Alejandra Guzmán en Muovi ("Hace más de 10 años me hicieron la impermeabilización del techo. Hasta ahora no tengo filtraciones."), que **dio el ok el 16/10/2026**. Va firmada "Alejandra G.". No usar las reseñas de Muovi escritas por el propio Martín. Sumar reseñas de Google cuando exista la ficha.
- **Cotizador sin precios**: pide tipo de trabajo, m², estado y barrio, y arma el mensaje de WhatsApp. Si Martín quiere mostrar precios, que pase un rango por sistema.
- **Preguntas frecuentes**: solo las confirmadas (cómo pedir presupuesto, garantía por sistema, desde cuándo trabaja y zona). Se sacaron las de Factura A/B, ART, cuotas y certificado con número.
- **Sin afirmaciones no confirmadas**: se sacaron las marcas de materiales, el certificado modelo y "visita sin cargo". El 16/10 se volvieron a poner, ya confirmados: presupuesto sin cargo, respuesta en unos 20 min, presupuesto en menos de 24 h, garantía por escrito y horario.
- **Fotos**: la del hero y la de la obra son ilustrativas (IA) y la web lo aclara. **Sin las fotos reales, la web no sale a producción.**
- **Analítica**: recomendada Cloudflare Web Analytics (gratis, sin cookies). No cuenta clics por botón, así que cada mensaje de WhatsApp de la web es distinto según el botón y termina en "(Enviado desde la web)".
- **Imagen para compartir**: el logo sobre fondo negro hasta tener una foto real de obra.

## Falta pedirle a Martín

- [ ] **Fotos de antes y después** de 3 obras, desde el mismo lugar (ideal: GreenVille, Los Cerezos y una terraza), para el comparador de Trabajos, que todavía usa imágenes ilustrativas. Mandarlas como documento por WhatsApp.
- [ ] Confirmar que **las personas que aparecen en las fotos de obra** están de acuerdo con salir en la web.
- [ ] **Otros medios de pago** además de Mercado Pago (efectivo, transferencia), si quiere mostrarlos.
- [ ] **Precios** definitivos por sistema, para después de la promo.
- [ ] **Conectar el dominio**: Cloudflare → delegación en NIC → GitHub Pages (pasos en CLAUDE.md).
- [ ] Links de reseña: tiene clientes para pedirles reseñas en Google; falta crear la ficha de Google Business.

## Marca

- Logo: `public/logo-aquatech.png` — disco plateado con la "Λ" negra, **AQUATECH** en negrita, **SOLUTIONS** espaciado, una línea fina y "IMPERMEABILIZACIONES QUE PERDURAN".
- Versión vectorial en `src/components/Brand.tsx` (`Logo`, `LogoMark`).
- Paleta: negro tinta #0b0b0c, grafito #3a3a3f, gris #6e6e75, plata #c9c9cd y blanco.
- Tipografías: Montserrat (títulos) e Inter (texto).
