# Solución — Mini Inbox

> **Contexto.** El correo con la prueba no traía el enlace a este repositorio. Mientras llegaba, reconstruí el proyecto a partir del enunciado en otro repositorio ([javiersoliso/mini-inbox](https://github.com/javiersoliso/mini-inbox)). Esta entrega está hecha sobre el **código real**: `main` es el commit original y la rama `solucion` tiene un commit por cada cambio.
>
> **Cómo se hizo.** La hice con Claude Code. La IA hizo el diagnóstico, el código, los tests y la primera versión de este documento; el detalle está en [Uso de IA](#uso-de-ia). Donde este documento dice "encontré", "elegí" o "descarté", describe ese proceso. Antes de la entrevista voy a repetir cada paso yo mismo para poder defenderlo.

Verificación final (todo termina sin errores): `bun run test` (42 tests: 33 en `api`, 9 en `web`), `bun run check-types`, `bun run lint` y `bun run fmt`.

## Errores

### Error 1 — "La bandeja está desordenada"

- **Síntoma:** la bandeja muestra primero conversaciones de hace semanas y una del año pasado.
- **Cómo lo encontré:** `bun run test` falla con el orden `c3, c2, c4, c5, c6, c1`. Al poner sus fechas en ese orden (28/10, 18/11, 18/11, 15/12/2025, 05/11, 03/11) aparece el patrón: está ordenado por los primeros caracteres, que son el **día**. En `sort.ts` el orden usa `localeCompare`, es decir, orden alfabético. Seguí el dato hacia atrás: las fechas vienen del proveedor como `"dd/mm/yyyy HH:mm"` y se guardaban y mostraban tal cual. Al revisar cómo se generaban las fechas nuevas encontré un segundo problema: `formatProviderDate` usa `getHours()`, que depende de la zona horaria del servidor. Lo comprobé ejecutándolo con `TZ=UTC`: un mensaje de las 14:00 en Colombia quedaba como `19:00`.
- **Causa raíz:** el formato de presentación del proveedor se usaba como representación interna. Ese texto no se puede ordenar ni comparar, porque empieza por el día y no dice en qué zona horaria está.
- **Cómo lo corregí y por qué así:** la API convierte las fechas **una sola vez, en la frontera** (`createStore`), a ISO 8601 en UTC, y desde ahí el resto de la app nunca ve `dd/mm/yyyy`.
  - `parseProviderDate` lee el día primero y suma 5 horas, porque Colombia está en UTC−5 todo el año, sin horario de verano.
  - Rechaza fechas imposibles como `31/02`, porque `Date.UTC` no falla: las convierte en otra fecha (el 3 de marzo).
  - El contrato compartido valida ISO con `z.iso.datetime()`.
  - El orden compara instantes (`Date.parse`), no texto.
  - La web muestra las fechas en `America/Bogota` con `Intl.DateTimeFormat`.
  - Las fechas nuevas se crean con `toISOString()`, lo que también corrige el error de zona horaria.
  - _Descarté_ convertir la fecha solo dentro de la comparación: arreglaba el test, pero dejaba el error de zona horaria y obligaba a convertir de nuevo cada vez que alguien quisiera comparar o filtrar fechas.

### Error 2 — "Respondo y la bandeja no se actualiza"

- **Síntoma:** después de responder, el mensaje aparece en el chat, pero la lista de la izquierda sigue mostrando el mensaje anterior hasta que se recarga la página.
- **Cómo lo encontré:** primero partí el sistema en dos. El test de la API "agrega el mensaje y actualiza el resumen" pasa, así que el servidor sí se actualiza y el problema está en la caché del navegador. TanStack Query solo vuelve a pedir datos cuando se invalida su llave. Al alinear todas las llaves encontré que `useSendMessage` invalida `['conversation']` (en singular), mientras la bandeja vive en `['conversations']`. Lo comprobé con un `QueryClient` real: solo se invalidaban los mensajes. Además, `staleTime: 60_000` explica por qué no se corregía sola durante un minuto.
- **Causa raíz:** las llaves de caché se escribían a mano como strings en cada hook. TypeScript no detecta el error de tipeo, porque `'conversation'` es un string válido.
- **Cómo lo corregí y por qué así:** todas las llaves salen ahora de un solo lugar, `conversationKeys` en `hooks/keys.ts`. Al enviar un mensaje se invalida el prefijo común `['conversations']`, que cubre los mensajes, el detalle y la bandeja (que cambia de resumen y de orden). Invalidar ignora el `staleTime`, así que no hizo falta cambiarlo. Agregué Vitest a `apps/web` (misma versión que `apps/api`) con un test de la invalidación y otro que documenta por qué la llave anterior fallaba.
  - _Descarté_ corregir solo la letra que faltaba: arreglaba el síntoma, pero dejaba la trampa para el próximo hook.
  - _Descarté_ actualizar la lista a mano con `setQueryData`: habría duplicado en el cliente la lógica de orden del servidor.
  - _Descarté_ bajar el `staleTime`: solo escondía el problema y aumentaba las peticiones.

### Error 3 (opcional) — "No me deja crear conversaciones"

- **Síntoma:** al crear una conversación con `+57 300 123 4567` aparece "Número de celular inválido".
- **Cómo lo encontré:** busqué el texto del mensaje de error en el repositorio y llegué a `phoneSchema`, que exige `/^3\d{9}$/`: diez dígitos, sin indicativo ni separadores. Luego comparé la regla con los datos reales: el placeholder del formulario muestra `+57 300 123 4567` y el seed guarda `+573001234567`. **Ninguno de los 6 celulares existentes pasaba su propio esquema.**
- **Causa raíz:** el esquema mezclaba dos cosas, el número _como se escribe_ y el número _como se guarda_, y aceptaba un tercer formato que no coincidía con ninguno de los dos.
- **Cómo lo corregí y por qué así:** el esquema quita los separadores (espacios, guiones, puntos, paréntesis), acepta el número con o sin `+57` y lo devuelve en E.164 (`+573001234567`). Elegí E.164 porque es el formato que ya tienen los datos guardados y el estándar internacional que usa WhatsApp. La salida también es una entrada válida, así que la web y la API pueden validar el mismo dato dos veces. Mantuve la regla de dominio, "celular colombiano" (empieza por 3 y tiene 10 dígitos), que era la intención documentada del esquema.
  - _Descarté_ usar `z.e164()` genérico, porque aceptaría números de cualquier país y eso cambia la regla de negocio sin que nadie lo pidiera.
  - _Descarté_ quitar solo los espacios, porque `+57` seguía fallando.

## Nueva funcionalidad

- **Qué hice:**
  - `status: 'open' | 'resolved'` en el contrato compartido. Las conversaciones nuevas, y las que llegan del proveedor, empiezan abiertas.
  - `PATCH /api/conversations/:id` con el cuerpo `{ status }`, validado con Zod: 400 con `issues` si es inválido, 404 si no existe. Es el mismo patrón que los endpoints existentes.
  - `GET /api/conversations?status=open|resolved|all`, validado con Zod. Sin parámetro devuelve todas, como antes.
  - En la web: pestañas Abiertas / Resueltas / Todas; el detalle muestra el estado y un botón "Marcar como resuelta" / "Reabrir". El filtro vive en la URL, así que se mantiene al recargar.
  - Tests: 8 en la API (estado inicial, resolver y reabrir, cuerpos inválidos, 404, filtro y filtro inválido) y 7 en la web (leer y escribir el filtro en la URL).
- **Decisiones que tomé y alternativas que descarté (y por qué):**
  - _Nota:_ estas decisiones las propuso Claude Code y yo las acepté. Las estoy revisando una por una para poder defenderlas, o cambiarlas si al entenderlas no estoy de acuerdo.
  - **Un `enum` de estado en vez de un booleano `resolved`:** se lee mejor y permite agregar estados (por ejemplo, "pendiente") sin cambiar el contrato.
  - **`PATCH /:id` en vez de `POST /:id/resolve` y `/reopen`:** un solo endpoint de actualización parcial, idempotente. El cuerpo es estricto (`z.strictObject`): rechaza campos desconocidos para que un cliente no crea que cambió algo que la API ignoró.
  - **Filtrar en el servidor y no en el navegador:** el servidor sigue siendo la única fuente de verdad y el diseño aguanta paginación más adelante. El valor por defecto `all` mantiene el comportamiento anterior para quien no envíe el parámetro.
  - **El filtro en la URL (`?status=`) y no en `localStorage`:** sobrevive a la recarga y además se puede compartir el enlace. Uso `history.replaceState` para no llenar el historial. Si el valor falta o es inválido, la página usa el valor por defecto en vez de romperse.
  - **`open` como filtro por defecto en la interfaz:** la historia de usuario pide "enfocarme en lo que falta por atender".
  - **Las conversaciones del proveedor empiezan abiertas:** el estado es un dato nuestro; el proveedor no lo maneja.
  - **Una llave de caché por filtro** (`conversationKeys.list(status)`). Al cambiar el estado se invalida el prefijo común, así la conversación cambia de pestaña.
  - **Ambigüedad:** el enunciado no dice si responder a una conversación resuelta debe reabrirla. Lo dejé manual y lo preguntaría al equipo.
- **Qué haría diferente con más tiempo:**
  - Tests de componentes (Testing Library con jsdom) para las pestañas y el botón.
  - Una actualización optimista, para que el cambio de estado se vea sin esperar al servidor.
  - Reabrir automáticamente cuando el contacto vuelve a escribir.
  - Un contador por pestaña.
  - Un `.gitattributes` con `eol=lf`: en Windows, con `core.autocrlf=true`, Git cambia los finales de línea al clonar y `oxfmt --check` marca todos los archivos.

## Documentación que consulté

**Lo que consulté directamente:** el enunciado (el README del repositorio) y, sobre todo, las explicaciones de Claude Code a mis preguntas mientras avanzábamos:

- qué pide la prueba y cómo justificar las decisiones;
- cómo leer un repositorio en GitHub: Code, Preview, Blame, commits, y la diferencia entre la fecha de un commit y la fecha de creación del repositorio;
- qué es cada parte del stack y por qué se usa: TypeScript, Bun y sus workspaces, Fastify, React, Vite, TanStack Query, Zod, Vitest, oxlint y oxfmt;
- la estructura del monorepo (`apps/` y `packages/`) y sus archivos de configuración: `package.json`, `tsconfig`, `.gitignore`, `.oxlintrc.json`, `.oxfmtrc.json` y `vite.config.ts`;
- qué es una API y cómo distinguir el servidor de la web;
- qué hace cada componente de React y cómo funcionan los hooks y la caché de TanStack Query;
- cómo se encuentra cada error leyendo el código, y la diferencia entre corregir la causa raíz y corregir el síntoma;
- cómo funcionan las ramas, `main` y el Pull Request, y cómo correr y probar todo desde la consola.

**Documentación oficial en la que se apoyan las decisiones.** La citó Claude Code; no la leí durante la entrega y la estoy leyendo para la entrevista:

- TanStack Query — [Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys), [Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation), [Important Defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults) (`staleTime`)
- Zod — [API](https://zod.dev/api): `z.iso.datetime()`, `z.strictObject`, `.transform()` y `.pipe()`
- MDN — [String.prototype.localeCompare](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare), [Date.UTC](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC), [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat), [History.replaceState](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState), [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
- Fastify — [Testing](https://fastify.dev/docs/latest/Guides/Testing/) (`app.inject`)
- Vitest — [Guía](https://vitest.dev/guide/)
- ITU-T — [E.164](https://www.itu.int/rec/T-REC-E.164) (formato internacional de números)

## Uso de IA

- **Herramienta(s):** Claude Code (modelo Claude Opus 5.5).
- **Para qué la usé, siendo transparente:**
  - **Hizo casi todo el trabajo técnico:** leyó el repositorio, reprodujo cada error con evidencia (el test que falla, un `QueryClient` real y la ejecución con otra zona horaria), propuso y escribió las correcciones, la funcionalidad, los tests, los mensajes de commit y la primera versión de este documento, y lo probó en el navegador. Cada cambio pasó por las cuatro verificaciones antes de su commit.
  - **Como tutor:** a la par del trabajo, me explicó todo lo que le pregunté (la lista está en "Documentación que consulté").
  - **Lo que decidí yo:**
    - pedir el repositorio cuando el enlace no llegó y, mientras tanto, reconstruirlo a partir del enunciado;
    - hacer la entrega sobre el código real en un repositorio nuevo, sin tocar la reconstrucción;
    - ir estudiando cada parte mientras la completábamos y la verificábamos, preguntando todo lo que no entendía;
    - declarar todo esto tal cual.
  - **Lo que estoy haciendo ahora:** reproducir cada error en `main` y verlo corregido en `solucion`, y leer cada commit y la documentación de arriba, para poder explicar y defender cada decisión en la entrevista.
