# Medición de consultas y trabajos

El objetivo es distinguir visitas, clics a WhatsApp, consultas recibidas y trabajos cerrados. No son la misma métrica.

## Origen de cada consulta

Los mensajes de WhatsApp de la web conservan el texto de la consulta y agregan el canal, la página y, si existe, la campaña. Si la persona recorrió varias páginas, también se indica la página de entrada. Ejemplo:

```text
(Enviado desde la web)
Origen: Instagram
Página: Techos
Entrada: Inicio
Campaña: bio
```

Se reconoce `utm_source` y, cuando está disponible, el sitio de referencia. Sin esa información aparece “Directo o sin identificar”: no se inventa un canal. La atribución se conserva durante la sesión del navegador, incluso si el visitante pasa de la portada a un servicio. Si el navegador bloquea el almacenamiento, se usa la información disponible en esa página.

Solo se guardan canal, página de entrada y una etiqueta acotada de campaña en `sessionStorage`. No se conserva la URL completa, el término de búsqueda, el teléfono ni datos del formulario. Las etiquetas de `utm_campaign` admiten letras sin acentos, números, guion y guion bajo, hasta 64 caracteres. No incluir datos de clientes en los enlaces.

El texto inicial se sirve igual en el HTML y en el navegador; la atribución se añade al hacer clic. Con JavaScript desactivado los botones siguen abriendo WhatsApp, con su mensaje básico.

## Enlaces para compartir

Instagram, enlace de la biografía:

```text
https://aquatechsolutions.com.ar/?utm_source=instagram&utm_medium=social&utm_campaign=bio
```

Facebook, publicación sobre techos:

```text
https://aquatechsolutions.com.ar/servicios/impermeabilizacion-techos/?utm_source=facebook&utm_medium=social&utm_campaign=techos
```

Perfil de Empresa en Google:

```text
https://aquatechsolutions.com.ar/?utm_source=google&utm_medium=organic&utm_campaign=perfil_empresa
```

Referidos:

```text
https://aquatechsolutions.com.ar/?utm_source=referido&utm_campaign=recomendaciones
```

Los enlaces internos, el sitemap y los canonical usan URLs limpias, sin parámetros de campaña.

## Planilla comercial

Importar [consultas-template.csv](consultas-template.csv) en una planilla privada. Registrar una fila cuando llega una consulta real, copiando el origen que aparece en el mensaje. Los estados sugeridos son Nueva, Visita coordinada, Presupuestada, Cerrada y Perdida.

Revisar cada semana:

- Consultas recibidas por canal y por servicio.
- Presupuestos enviados sobre consultas recibidas.
- Trabajos cerrados sobre presupuestos enviados.
- Monto cerrado por canal, cuando esté disponible.

La web no lee ni registra automáticamente las conversaciones de WhatsApp o los cierres: esta planilla se completa al atender al cliente. El bot de `bots/whatsapp/` continúa siendo un proyecto independiente; estas páginas no lo activan ni importan contactos a sus campañas.

Con GA4 o Plausible configurado, el evento `WhatsApp` incluye canal, campaña, página de entrada y página del clic. Cloudflare Web Analytics mantiene la medición de visitas existente; no se presenta un clic como una consulta recibida.

## Páginas publicadas

- `/servicios/impermeabilizacion-techos/`
- `/servicios/humedad-cimientos/`
- `/servicios/terrazas-balcones/`
- `/trabajos/greenville/`

Cada una tiene HTML pre-renderizado, título, descripción, canonical y datos estructurados propios. Todas figuran en `sitemap.xml`. La obra de GreenVille se describe con la información confirmada y enlaza a la publicación original para ver sus fotos; no se atribuyen a esa obra las fotos generales disponibles en el repositorio.
