# Videos (reels) a partir de fotos de obra

El cliente saca las fotos con un **Motorola**, que les pone marca de agua ("Shot on moto…" / logo "M", abajo a la izquierda). Se puede apagar en Cámara → Configuración → "Marca de agua".

## Qué fotos pedir

- Verticales, con luz de día, sin dedos ni objetos tapando.
- **Antes y después desde el mismo lugar y ángulo** (es lo más importante).
- Proceso: cada capa, herramientas y el equipo trabajando. Primeros planos de los problemas.
- Una carpeta por obra, con los archivos nombrados en orden (`01_antes.jpg`, `02_proceso.jpg`, `03_despues.jpg`). Por WhatsApp, mandarlas **como documento** para que no se compriman.
- Por cada obra, una línea con barrio, problema, sistema usado y m².

## Prompt para generar el reel

Completar los [corchetes] y pasarlo junto con las fotos:

```
Sos editor de video para redes sociales. Armá un reel de Instagram para
AquaTech, una empresa de impermeabilizaciones de Córdoba, Argentina, usando
las fotos que te adjunto. Todo el texto en pantalla va en español rioplatense.

DATOS DE ESTA OBRA
- Plantilla: [Antes→Después | Paso a paso | Tip educativo | Obra del mes]
- Barrio/localidad: [ej. Villa Allende]
- Problema que había: [ej. filtraciones en terraza de 60 m²]
- Sistema usado: [ej. membrana asfáltica + geotextil + poliuretano]
- Gancho (texto inicial): [ej. "¿Se te llueve el techo?"] — si lo dejo vacío,
  proponé 3 opciones y usá la mejor.

ESPECIFICACIONES TÉCNICAS
- MP4, H.264, 1080×1920 (9:16), 30 fps, pix_fmt yuv420p, sin audio
  (la música la agrego desde Instagram).
- Duración: Antes→Después 12–18 s · Paso a paso y Obra del mes 20–30 s ·
  Tip educativo 15–20 s.
- Herramientas: Python + Pillow para los textos y ffmpeg para el video
  (si falta ffmpeg: brew install ffmpeg).
- Cada foto con movimiento suave (zoom 1.0→1.08 o paneo lento), recortada a
  9:16 sin deformarla. Si una foto es horizontal, usá un fondo desenfocado de
  la misma foto en lugar de franjas negras.
- Transiciones de 0.3 s. En Antes→Después, un barrido horizontal que revele
  el "después" sobre el "antes".
- Corrección leve de brillo y contraste si están oscuras, sin alterar el
  resultado del trabajo.

LIMPIEZA DE MARCA DE AGUA (fotos de celular Motorola)
1. En cada foto, ubicá la marca de la cámara (logo "M" y/o "Shot on moto…",
   casi siempre abajo a la izquierda).
2. Primero intentá sacarla con el recorte 9:16, verificando que quede afuera
   durante TODO el zoom o paneo (primer y último cuadro).
3. Si no se puede, borrala con inpainting: una máscara con 10–15 px de margen
   y cv2.inpaint (TELEA, radio 5–9). Si el fondo es complejo y queda manchado,
   clonar la textura que tiene al lado.
4. Si nada queda bien, cubrir esa zona con la caja de texto o con el fondo
   desenfocado, sin que se note.
5. Guardá las fotos limpias en "limpias/" sin tocar los originales.
6. Solo se borra la marca de la cámara; no se toca el trabajo.

ESTILO DE TEXTOS (marca monocroma)
- Montserrat o Inter en negrita. Gancho ~90 px, secundarios ~60 px.
- Texto blanco sobre una caja negra (#0b0b0c) semitransparente con bordes
  redondeados. Detalles en plata (#c9c9cd).
- Zona segura: nada de texto en los 250 px de arriba ni en los 400 px de
  abajo, y 80 px de margen a los costados.
- Máximo 6–7 palabras por texto y cada uno en pantalla por lo menos 1.5 s.

ESTRUCTURA
1. 0–2 s: el gancho sobre la foto más llamativa del problema.
2. Desarrollo según la plantilla (ANTES → barrido → DESPUÉS + barrio y
   sistema · etapas numeradas · pregunta + 3 claves · recorrido de la obra).
3. Cierre de 2.5 s: fondo negro, logo AquaTech (public/logo-aquatech.png),
   "Presupuesto sin cargo", "WhatsApp 351 613-4658" y "Garantía escrita".

CÓMO TRABAJAR
1. Listá qué muestra cada foto y en qué orden la vas a usar. Si falta algo
   (por ejemplo, el antes y el después no son del mismo ángulo), avisá.
2. Mostrá 3 fotogramas de muestra (gancho, uno del medio y el cierre) y el
   antes/después de la limpieza de 2 fotos, para aprobar antes de renderizar.
3. Renderizá y guardá aquatech_[plantilla]_[barrio].mp4.
4. Escribí el texto del post (3–4 líneas + llamado a WhatsApp), 6–8 hashtags
   y qué fotograma usar como portada.

No inventes datos: ni m², ni años de garantía, ni precios, ni testimonios.
```
