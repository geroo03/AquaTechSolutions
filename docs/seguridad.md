# Seguridad de la web

Revisión del 17/10/2026. La web es estática en GitHub Pages, detrás de Cloudflare. El bot es un servicio separado: no se publica en Pages y su configuración no forma parte de `dist/`.

## Protecciones implementadas

- Cada HTML publicado contiene una Content Security Policy (CSP) antes de scripts, recursos y `<base>`. `scripts/security.ts` calcula hashes de los scripts inline del HTML final. No permite JavaScript inline arbitrario, manejadores HTML como `onclick`, `eval`, objetos ni iframes. Solo permite recursos propios y los proveedores de analítica incluidos al compilar.
- Los estilos inline siguen permitidos para las animaciones y estilos de React. Esta excepción es para CSS, no para JavaScript. La CSP complementa el escape de React y la codificación de los mensajes; no reemplaza la validación del código.
- La configuración de analítica se valida antes de insertarse en HTML. La compilación falla ante valores inesperados, sin imprimirlos. Los metadatos se escapan.
- El referrer enviado a otros sitios se limita al origen. Los enlaces externos de la interfaz abren con `noopener noreferrer`.
- La atribución acepta solo canales y páginas conocidos y etiquetas de campaña acotadas. No almacena los campos de consulta ni los envía a la analítica. Los formularios preparan el mensaje de WhatsApp; no hay un endpoint público de carga de archivos o envío de formularios que justifique añadir un CAPTCHA en el cliente.
- Las dependencias de web y bot se auditan en sus workflows. La publicación de la web se detiene ante vulnerabilidades altas o críticas, errores de compilación o pruebas fallidas. Dependabot revisa semanalmente ambos proyectos y las acciones de GitHub, con cambios propuestos para revisión, sin fusión automática.
- El job de compilación tiene acceso de lectura. Solo el job de publicación tiene permisos de Pages y OIDC. Checkout no conserva credenciales.
- GitHub: alertas de dependencias y correcciones de seguridad activadas; detección de secretos y bloqueo al subir secretos verificados como activos. CodeQL activado para Actions, JavaScript/TypeScript y Python; el análisis inicial completó correctamente y no había alertas abiertas al revisar. Los resultados siguientes quedan en Security → Code scanning.

`npm run test:security` comprueba la configuración y `npm run test:web` verifica en navegador que un script inyectado y una conexión no autorizada sean bloqueados. También prueba texto HTML en el formulario y datos manipulados de sessionStorage.

## Pendiente de acceso a Cloudflare

Las cabeceras públicas revisadas no incluían CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy ni HSTS. La CSP de los HTML queda activa por sí misma al publicar; las otras cabeceras no se activan mediante archivos `_headers` en GitHub Pages.

No hay una conexión ni credenciales de Cloudflare disponibles en esta sesión. No se cambió DNS, SSL, WAF ni reglas de esa cuenta. La configuración concreta está preparada en `cloudflare-security-rule.json`.

En el panel del dominio: Rules → Transform Rules → Modify Response Header. Crear una regla nueva para los dos hostnames del JSON y establecer sus cinco cabeceras. El JSON representa **una regla**, no un reemplazo de todo el conjunto de reglas de la zona. Si ya existe una CSP HTTP, combinarla después de revisarla: no sobrescribir una política existente sin comprobar su contenido.

| Cabecera | Valor |
| --- | --- |
| Content-Security-Policy | `frame-ancestors 'none'` |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |

La CSP HTTP de esta regla impide que otros sitios incrusten la web. Se combina con la CSP completa de cada HTML; `frame-ancestors` no funciona en una etiqueta meta. No está activo hasta aplicar y verificar la regla en Cloudflare.

Revisar en la cuenta el certificado de origen de GitHub Pages y el modo SSL antes de cambiar a Full (strict) o habilitar HSTS. El HTTPS público y la redirección HTTP → HTTPS funcionan. HSTS no se incluye en la regla preparada: empezarlo con una duración corta después de verificar certificados y todos los hostnames, sin preload ni includeSubDomains inicialmente.

En Security revisar las protecciones disponibles del plan y los eventos del WAF. No activar desafíos globales indiscriminadamente. Bot Fight Mode puede afectar tráfico legítimo y sus scripts de detección requieren comprobar compatibilidad con la CSP; no resolverlo permitiendo todo JavaScript inline. Mantener accesibles las páginas y Googlebot. No se promete que estas protecciones eliminen todo tráfico automatizado ni toda vulnerabilidad.

Después de aplicar la regla, verificar las cabeceras con `curl -I https://aquatechsolutions.com.ar/` y recorrer las seis páginas, formularios y enlaces de reseñas.

Fuentes: [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy), [cabeceras en Cloudflare](https://developers.cloudflare.com/rules/transform/response-header-modification/), [Bot Fight Mode y CSP](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/).
