# Activar WhatsApp oficial de AquaTech

Preparado el 17/10/2026. El bot está separado de la web en `bots/whatsapp/`.

- Proyecto: [aquatech-whatsapp en Railway](https://railway.com/project/c4474161-e9ed-42ea-a21d-980174f623f3).
- Servicio: `whatsapp-oficial`, entorno `production`, una réplica y volumen `/app/data`.
- Salud: <https://whatsapp-oficial-production.up.railway.app/health>.
- Callback de Meta: `https://whatsapp-oficial-production.up.railway.app/webhooks/whatsapp`.
- Estado inicial: `MODE=simulation`, `SEND_ENABLED=false`, `AUTO_REPLY_ENABLED=false`. Sin contactos reales importados ni cuenta Meta vinculada.

Este MVP automatiza la recepción y una bienvenida de atención, y ofrece una API privada para respuestas humanas dentro de la ventana de 24 horas. No incluye una interfaz de chat, lectura de fotos ni campañas oficiales con plantillas aprobadas. La lista de prospectos nuevos no se convierte en destinatarios autorizados.

## 1. Crear los activos con el dueño

1. El dueño entra a [Meta Business Suite](https://business.facebook.com/) con su cuenta y crea o selecciona el **portafolio comercial de AquaTech**. Los activos deben pertenecer al cliente; puede agregarte con los permisos necesarios sin compartir su contraseña.
2. Entrar a [Meta for Developers → Mis apps](https://developers.facebook.com/apps/), completar el alta de desarrollador si lo pide y elegir **Crear app**.
3. Seleccionar el caso de uso de **WhatsApp / conectar con clientes a través de WhatsApp** y asociar el portafolio. Si el panel ofrece tipos de app en lugar de casos de uso, elegir la opción empresarial compatible con WhatsApp y agregar el producto **WhatsApp**. Los nombres del panel pueden cambiar; usar el [inicio oficial de Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started).
4. En **WhatsApp → Configuración de la API / Primeros pasos**, empezar con el **número de prueba que proporciona Meta**. Agregar y verificar tu propio celular como destinatario de prueba cuando el panel lo solicite.
5. Conservar el número de la empresa como está durante esta prueba. Para incorporarlo después hay que revisar con el dueño la disponibilidad de coexistencia con la app o el proceso de migración. No borrar su cuenta de WhatsApp Business para intentar avanzar.

La guía oficial genera o vincula el portafolio, la cuenta de WhatsApp Business (WABA) y el teléfono de API. El teléfono visible, el ID del teléfono, el ID de WABA y el ID del portafolio son datos diferentes.

## 2. Cargar credenciales en Railway

En el proyecto de arriba: servicio **whatsapp-oficial → Variables**. Guardar los siguientes valores allí, nunca en el chat, GitHub, una captura pública ni un archivo del repositorio:

| Variable | Dónde obtenerla |
| --- | --- |
| `META_ACCESS_TOKEN` | WhatsApp → Configuración de la API. El temporal del panel sirve para la prueba; para funcionamiento continuo reemplazarlo por uno de usuario del sistema con acceso a estos activos. |
| `META_PHONE_NUMBER_ID` | Identificador del número de teléfono mostrado en esa pantalla. En la primera prueba, usar el del número de prueba. |
| `META_WABA_ID` | Identificador de la cuenta de WhatsApp Business mostrado en esa pantalla. |
| `META_GRAPH_VERSION` | Versión que aparece en la URL del ejemplo de API del panel, con formato `vNN.0`. Copiar la vigente; no escribir literalmente `vNN.0`. |
| `META_APP_SECRET` | Configuración de la app → Básica → Clave secreta de la app. No es el token de acceso. |

`META_WEBHOOK_VERIFY_TOKEN` **ya está generado en Railway**. Mostrarlo solo de forma privada y copiarlo al campo de verificación del webhook de Meta. Es una clave que elegimos nosotros; no se obtiene de Meta. No usar `ADMIN_API_KEY` para el webhook.

También están generadas `ADMIN_API_KEY` y `AUTH_ENCRYPTION_KEY`. No reemplazarlas durante un reinicio o redeploy. La primera protege la administración; la segunda es necesaria para datos cifrados del conector anterior.

Para operación continua: en [Configuración del negocio](https://business.facebook.com/settings/), crear un usuario del sistema para esta integración, asignarle los activos correspondientes y generar un token para la app con `whatsapp_business_messaging` y `whatsapp_business_management`. La duración disponible depende del alta y permisos; el token temporal del panel vence, y uno sin vencimiento también puede revocarse. Revisar el estado y los permisos en las herramientas oficiales de Meta. No hace falta contratar un intermediario para usar Cloud API directamente.

Guardar y desplegar las variables manteniendo todavía `MODE=simulation` y `SEND_ENABLED=false`.

## 3. Configurar el webhook

1. En la app de Meta, abrir **WhatsApp → Configuración → Webhooks** (o la configuración del objeto `whatsapp_business_account`).
2. Callback: `https://whatsapp-oficial-production.up.railway.app/webhooks/whatsapp`.
3. Token de verificación: el valor privado de `META_WEBHOOK_VERIFY_TOKEN` de Railway.
4. Verificar y guardar. El servidor responde al desafío y comprueba ese token.
5. Suscribirse al campo **`messages`**.
6. Asegurar que la app también esté suscrita a la **WABA** elegida. Configurar el campo del webhook por sí solo no sustituye la suscripción de la cuenta. La API oficial ofrece `POST /{WABA_ID}/subscribed_apps` y `GET /{WABA_ID}/subscribed_apps` para comprobarlo. Se usa el token con acceso a esa WABA. Si el panel ya hizo la asociación, verificarla antes de repetir el alta.

Los POST se validan con `X-Hub-Signature-256` usando `META_APP_SECRET`. Cambiar solo el token de verificación no arregla una firma incorrecta. El bot ignora los mensajes de otra WABA o de otro ID de teléfono.

## 4. Probar sin enviar desde el bot

1. Conservar `MODE=simulation` y `SEND_ENABLED=false`.
2. Habilitar `AUTO_REPLY_ENABLED=true` y desplegar: cualquier bienvenida generada seguirá siendo simulada.
3. Desde el celular de prueba, iniciar una conversación escribiendo al número de prueba de Meta, usando el flujo de prueba que indique el panel.
4. Comprobar `GET /cloud/inbox` y `GET /cloud/replies` con la clave administrativa. Debe aparecer la entrada real y una respuesta `simulated`; el celular no recibe una respuesta del bot en esta etapa.
5. Repetir la notificación del mismo mensaje no debe duplicar la entrada. Una conversación no registra consentimiento de marketing. Las pruebas automatizadas cubren estos casos; no hace falta enviar campañas para comprobarlos.

`/health` solo comprueba que el proceso responde. No certifica la validez del token de Meta. El dato `senderReady` indica configuración disponible; la confirmación real del acceso requiere probar la API de Meta.

## 5. Hacer la prueba controlada de envío

Una vez verificados número de prueba, credenciales, suscripción y entrada del webhook:

```dotenv
WHATSAPP_PROVIDER=cloud_api
MODE=live
SEND_ENABLED=true
AUTO_REPLY_ENABLED=true
```

Guardar las cuatro variables juntas y desplegar. `live` activa el conector real; con el número de prueba seguirá limitado a los destinatarios que permita Meta. Desde el celular autorizado, mandar **un mensaje nuevo** al número de prueba. Una bienvenida de simulación nunca se convierte en envío real al cambiar de modo.

Comprobar que llega una sola bienvenida y revisar el ID aceptado por Meta en `/cloud/replies`. Después probar `BAJA` y verificar que no se preparan nuevas respuestas automáticas. No probar con prospectos sin autorización. Para volver a simulación, cambiar juntos `MODE=simulation` y `SEND_ENABLED=false`; para detener solo la bienvenida, `AUTO_REPLY_ENABLED=false`. Las respuestas ya en cola se detienen con `/pause`.

Si Meta rechaza el envío, el bot se pausa. Si el resultado es incierto, no reintenta: revisar manualmente antes de resolver el estado y reanudar. El README detalla esas rutas.

## 6. Pasar al número de la empresa

Con el dueño, completar los pasos de Meta para nombre visible, verificación del teléfono, PIN y verificación del negocio si los exige la cuenta. Antes de migrar el número existente, revisar cómo continuará la atención humana y si corresponde coexistencia: este bot por sí solo no ofrece la aplicación WhatsApp Business ni un panel multiagente.

Durante el cambio volver a simulación, actualizar `META_PHONE_NUMBER_ID` y `META_WABA_ID` si corresponde, revisar permisos del usuario del sistema y la suscripción de la WABA, y repetir la prueba controlada. No cambiar el WhatsApp de la web a un número de prueba.

## Operación y costos

- **20 intentos por día** es el cupo propio del bot, compartido entre colas; no es una garantía contra suspensiones ni un límite oficial de WhatsApp.
- La bienvenida pide problema, localidad, metros aproximados y fotos, y deja la atención posterior a una persona. Puede acusar recibo las 24 horas; informa el horario humano de 8 a 20. Se limita a una bienvenida por contacto cada 24 horas. El horario y espaciado de campañas no se aplican a estas respuestas de atención.
- El bot deja de enviar cuando vence la ventana de atención, con un margen de un minuto. No genera plantillas pagas para continuar fuera de ella.
- Meta publica como gratuitas las respuestas de servicio dentro de las 24 horas desde el último mensaje del usuario. Otras categorías y mensajes con plantillas pueden tener cargos. Railway factura alojamiento y disco según el plan/consumo. No se modificó el plan de la cuenta ni se contrataron servicios adicionales.
- En Railway conservar una réplica, volumen `/app/data`, `DATABASE_PATH=/app/data/bot.sqlite`, healthcheck `/health`, reinicio `ON_FAILURE` con 5 intentos y aplicación sin suspensión por inactividad. Estos ajustes se guardaron en el servicio. No se agrega `railway.json`, que Railway está retirando.
- `RAILWAY_RUN_UID=0` permite ajustar el propietario del volumen durante el arranque. El código baja después al UID 1000: la aplicación no continúa como root. No reemplazar el comando de inicio de Docker por `npm start`, porque evitaría ese ajuste del volumen.
- Proteger acceso al proyecto y habilitar copias privadas del volumen; no se configuró una política automática de backups en esta entrega. La base contiene consultas, números y evidencias.
- La sincronización de Sheets permanece sin configurar hasta tener la planilla y su cuenta de servicio. No hace falta para probar atención entrante.

## Fuentes oficiales

- [Cloud API de Meta: activos, tokens y permisos](https://www.postman.com/meta/whatsapp-business-platform/collection/wlk6lh4/whatsapp-cloud-api).
- [Inicio de Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started).
- [Webhooks de Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks).
- [Precios y ventana de servicio](https://whatsappbusiness.com/products/platform-pricing/).
- [Política de WhatsApp Business](https://whatsappbusiness.com/policy/).
- [Volúmenes de Railway](https://docs.railway.com/volumes).
- [Configuración de infraestructura actual de Railway](https://docs.railway.com/infrastructure-as-code).
