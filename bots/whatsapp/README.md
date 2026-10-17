**Bot de WhatsApp de Aquatech — MVP**

[![Pruebas del bot](https://github.com/geroo03/AquaTechSolutions/actions/workflows/whatsapp-bot.yml/badge.svg)](https://github.com/geroo03/AquaTechSolutions/actions/workflows/whatsapp-bot.yml)

Este proyecto está en `bots/whatsapp/` y funciona independientemente de la web que está en la raíz del repositorio. Ejecutar los comandos de este documento **desde esta carpeta**:

```sh
cd bots/whatsapp
```

El proveedor predeterminado es **WhatsApp Cloud API oficial**. Recibe consultas por webhook y permite responder dentro de las 24 horas desde el último mensaje del usuario. Puede enviar una bienvenida automática por contacto cada 24 horas, si se habilita. Arranca en **simulación**, sin enviar mensajes. Ver la [guía de activación de Meta y Railway](ACTIVACION_META_RAILWAY.md).

También conserva el importador de Google Sheets/CSV y el simulador de campañas. Todos los contactos importados empiezan pendientes. **Las campañas proactivas oficiales con plantillas aprobadas todavía no están implementadas**. El conector Baileys anterior queda como opción explícita (`WHATSAPP_PROVIDER=baileys`); es no oficial y no garantiza evitar suspensiones.

La lista actual contiene contactos nuevos sin permiso. Se puede importar y revisar desde ahora; para habilitar mensajes hay que registrar la aceptación real del destinatario. Un delay aleatorio no reemplaza esa autorización. El sistema usa un intervalo configurable de 30 minutos por defecto, sin simular comportamiento humano.

**Puesta en marcha local**

Requisito: Node.js 24. Las dependencias están fijadas en `package-lock.json`.

```sh
npm ci
npm run setup
npm run build
npm start
```

`setup` crea `.env` con dos claves aleatorias y permisos restringidos. No sobrescribe un `.env` existente. En otra terminal:

```sh
npm run cli -- status
npm run cli -- import-csv examples/contactos.csv
npm run cli -- contacts
npm run cli -- preview examples/campana.json
```

La vista previa debería mostrar cero destinatarios elegibles después de importar contactos nuevos. Actualizá las fechas de `examples/campana.json` antes de usarlo: el ejemplo tiene una vigencia explícita y el servidor rechaza campañas vencidas.

Para el simulador de campañas y el conector anterior, el horario predeterminado es 08:00 inclusive a 20:00 exclusivo, hora de Córdoba, de lunes a viernes. Los días son una propuesta inicial configurable mediante `ACTIVE_DAYS`; todavía no fueron confirmados por el negocio. No hay un mínimo obligatorio de envíos ni se acumulan mensajes vencidos al reiniciar.

**Formato de la planilla**

Primera fila, con estos encabezados:

| contact_id | lugar | telefono | pais | origen_contacto |
| --- | --- | --- | --- | --- |
| local_001 | Nombre del lugar | +54… | AR | Referencia de origen |

Usar teléfonos como texto, preferentemente en formato internacional completo; revisar el prefijo móvil argentino. La aplicación valida el formato, no la existencia de una cuenta de WhatsApp. `contact_id` debe ser estable: letras, números, guion o guion bajo; no usar el número de fila. El teléfono se deduplica aun si aparece con otro ID. Cambiar el teléfono de un ID existente requiere revisión: no se transfiere su permiso.

Las columnas adicionales de permiso en la planilla **no otorgan autorización automáticamente**. Sheets funciona como importación de contactos: borrar una fila no representa una baja y no cancela campañas ya creadas. Para excluir un destinatario usá el comando `revoke`; para detener una campaña, `cancel-campaign`.

**Conectar Google Sheets**

1. Habilitar Google Sheets API en un proyecto de Google Cloud y crear una cuenta de servicio para esta aplicación.
2. Compartir solo la planilla dedicada con el correo de esa cuenta, como **lector**.
3. Guardar la credencial JSON en `secrets/google-service-account.json`, fuera del repositorio.
4. Completar `SHEETS_SPREADSHEET_ID`, `SHEETS_RANGE` y `GOOGLE_APPLICATION_CREDENTIALS` en `.env`. El ID es la parte entre `/d/` y `/edit` en la URL de Sheets.
5. Reiniciar el servidor. La sincronización es automática cada 10 minutos; también se puede ejecutar `npm run cli -- sync-sheets`.

En local, usar `GOOGLE_APPLICATION_CREDENTIALS=./secrets/google-service-account.json`; en Docker, `/app/secrets/google-service-account.json`. La cuenta solo necesita `spreadsheets.readonly`. Si Google falla o los datos superan la antigüedad permitida, se detienen nuevos envíos hasta sincronizar correctamente. No se publican la planilla ni las credenciales.

**Autorizaciones y campañas**

Registrar la aceptación con fecha, alcance (`marketing` o `service`) y referencia verificable. `examples/consentimiento.json` es una muestra de estructura; reemplazar sus datos por la evidencia real. No usarlo como evidencia de un contacto real.

```sh
npm run cli -- consent autorizacion-real.json
npm run cli -- preview campana-real.json
npm run cli -- campaign campana-real.json
npm run cli -- jobs
npm run cli -- audit
```

Solo se incluyen contactos autorizados para el mismo alcance de la campaña. La plantilla admite `{{lugar}}` y `{{empresa}}`; el texto final identifica a la empresa e incluye instrucciones para dar la baja. El texto queda fijado al crear el trabajo. Reusar el mismo ID y los mismos datos no duplica destinatarios; cambiar contenido o fechas con el mismo ID produce conflicto.

Una campaña tiene modo propio: cambiar `.env` a `live` no transforma trabajos simulados en mensajes reales. Para enviar en el nuevo modo se requiere una campaña nueva. Las campañas se crean con todos los contactos elegibles de la base, así que revisar siempre la vista previa.

**Operación y revisión**

```sh
npm run cli -- pause
npm run cli -- revoke local_001
npm run cli -- cancel-campaign presentacion_001
npm run cli -- resume
```

`BAJA`, `STOP` y varias frases comunes de rechazo se procesan al recibirlas. Las bajas cancelan pendientes y sobreviven reimportaciones. Con Cloud API, las consultas quedan en `GET /cloud/inbox` y generan un evento `human_review_required`. Si `AUTO_REPLY_ENABLED=true`, se prepara una bienvenida fija pidiendo datos para presupuestar; la atención posterior es humana mediante la API protegida. No hay interfaz de chat ni lectura de fotos en esta versión. El conector Baileys solo deriva la conversación a atención humana. Revisar también rechazos con otras palabras y registrar bajas recibidas por otros canales con `revoke`.

Estados principales: `queued`, `sending`, `simulated`, `sent`, `unknown`, `cancelled`, `expired`. `sent` significa que el conector devolvió un ID; no certifica entrega ni lectura. Si una operación falla después de invocar el envío, se marca `unknown`, se consume el cupo reservado y se pausa el procesador. No hay reintentos automáticos de mensajes inciertos.

Para resolver un `unknown`, usar `POST /jobs/ID/resolve` con `{"action":"cancel","note":"Motivo de la revisión manual"}` o `action: "mark_sent"` si se comprobó el envío. Después, `resume`. Estas acciones no vuelven a enviar el mensaje. La pausa y la baja detienen pendientes; no pueden retirar un envío que ya empezó.

**Conector anterior: vincular Baileys**

Este apartado solo aplica si elegís expresamente `WHATSAPP_PROVIDER=baileys`. Para la API oficial se usa la [guía de Meta](ACTIVACION_META_RAILWAY.md), sin QR.

Primero detener el servidor. La vinculación usa la misma base; no ejecutar ambos procesos a la vez.

```sh
npm run whatsapp:pair
```

Ejecutarlo en una terminal interactiva y escanear el QR desde **Dispositivos vinculados**. No se imprime el QR en los logs del servidor. Este comando vincula y cifra la sesión; no manda mensajes. El conector usa Baileys `7.0.0-rc14`, una versión candidata fijada al instalar; hay que validar su compatibilidad con la cuenta antes de producción.

Para activar el modo real se requieren ambas variables: `MODE=live` y `SEND_ENABLED=true`, permisos reales registrados y una campaña nueva. El servidor revalida cupo, baja y consentimiento antes de cada envío. Los errores de sesión permanentes exigen revisión; las desconexiones transitorias tienen reconexión limitada. Si se pierde una sesión, no se borran automáticamente sus credenciales.

No se ha vinculado ni probado una cuenta real durante este desarrollo. Para un número crítico, evaluar la API oficial antes de usar una conexión no oficial. La [política de WhatsApp](https://whatsappbusiness.com/policy/) y las [advertencias de Baileys](https://github.com/WhiskeySockets/Baileys) siguen aplicando.

**Servidor con Docker**

```sh
docker compose up -d --build
docker compose exec bot npm run cli -- status
docker compose logs --tail=50 bot
```

Docker Compose publica la API solo en `127.0.0.1`. Requiere `Authorization: Bearer ADMIN_API_KEY`, salvo `/health` y el webhook oficial `/webhooks/whatsapp`, que usa token de verificación y firma HMAC de Meta. No incluye una interfaz web pública. Para acceso remoto, usar un túnel SSH o un proxy HTTPS con acceso restringido. En Railway, el dominio HTTPS debe llegar al webhook; las rutas administrativas siguen exigiendo la clave privada.

Para vincular desde Docker:

```sh
docker compose stop bot
docker compose run --rm -it --no-deps bot npm run whatsapp:pair
docker compose up -d bot
```

Usar **una sola réplica** y disco persistente local; la base tiene un lease contra procesos simultáneos. Tras un cierre abrupto puede haber que esperar hasta dos minutos para que venza. `bot_data` guarda SQLite; `.env` guarda la clave que permite descifrar la sesión. Respaldar ambos de forma privada y separada, con el contenedor detenido para una copia consistente. No ejecutar `docker compose down -v` si se necesitan conservar los datos.

**Verificación y límites actuales**

```sh
npm run check
npm test
npm run build
```

Las pruebas cubren permisos, bajas, duplicados, horario, cupo persistente, envíos inciertos, cifrado de sesión, API y ciclo de inicio/reinicio en simulación. Las pruebas HTTP requieren permiso para abrir puertos locales.

GitHub Actions ejecuta estos controles con Node.js 24 y construye el contenedor en Linux. Luego prueba su API, importa un contacto ficticio y verifica que siga pendiente, sin mensajes en cola. El workflow está en [`.github/workflows/whatsapp-bot.yml`](../../.github/workflows/whatsapp-bot.yml); no usa credenciales reales ni activa WhatsApp. Los cambios exclusivos del bot no vuelven a publicar la web en GitHub Pages.

SQLite reemplaza PostgreSQL del plan inicial para simplificar este MVP de una cuenta y 20 avisos diarios. No necesita Redis ni un servicio de IA pago. La sesión se cifra con AES-256-GCM; la lista de contactos y las evidencias se guardan en la base con acceso restringido, por lo que el respaldo completo también debe protegerse.

Pendientes externos: crear la app de Meta y sus credenciales con el dueño, configurar y probar el webhook con el número de prueba, decidir cómo incorporar el número empresarial y habilitar envíos solo después de verificar la atención. Sheets requiere credenciales y acceso a la planilla real por separado. La prospección importada no tiene autorización de marketing. Ver el análisis de alternativas y costos en [PLAN_WHATSAPP.md](PLAN_WHATSAPP.md).

**Atención con Cloud API**

`GET /cloud/inbox` devuelve las últimas 100 entradas y `GET /cloud/replies` las últimas 100 respuestas. Ambas rutas requieren Bearer. `POST /cloud/replies` recibe `{"contactId":"wa_…","text":"Tu respuesta"}` y solo permite responder mientras siga abierta la ventana de atención y no haya una baja. El ID real del contacto se consulta en `/contacts`.

El procesador vuelve a validar ventana, baja y cupo antes del envío. Cuenta intentos, incluso inciertos, contra el límite operativo compartido de 20 por día. Este valor es una configuración del bot, **no un límite seguro publicado por WhatsApp**. La atención entrante no usa el horario ni el intervalo de campañas: puede acusar recibo las 24 horas, con una sola bienvenida por contacto cada 24 horas. Al llegar al cupo, la cola espera; los mensajes vencidos no se envían.

Un rechazo explícito de Meta deja la respuesta `failed` y pausa el bot. Si el resultado es incierto queda `unknown` y no se reintenta. Para revisar: `POST /cloud/replies/ID/resolve` con `{"action":"cancel","note":"Motivo de revisión manual"}` o `mark_sent`, y luego `/resume`. `sent` significa aceptación de Meta, no entrega ni lectura. Los eventos de estado se aceptan pero no actualizan confirmaciones de entrega en esta versión.

El webhook verifica la firma sobre los bytes originales, filtra la cuenta y el número configurados y deduplica por ID de mensaje. Una consulta entrante permite atención contextual; nunca registra por sí sola consentimiento para campañas. Las credenciales y los contenidos no se imprimen en logs. La base contiene datos personales: proteger volumen, acceso y copias de seguridad.
