# Mini Inbox — Prueba técnica

¡Hola! Gracias por tu interés en trabajar con nosotros.

**Mini Inbox** es una versión muy reducida de la bandeja de conversaciones que usan nuestros agentes para atender a los estudiantes que escriben por WhatsApp a nuestro chatbot. Usa el mismo stack con el que trabajarías en el día a día.

Esta prueba **no** busca que sepas todo de memoria. Queremos ver cómo **resuelves problemas**, cómo **lees documentación** y cómo **justificas tus decisiones**. Puedes buscar en Google, leer documentación y usar IA (ver [Uso de IA](#uso-de-ia)).

- ⏱️ **Tiempo estimado:** 3–4 horas de trabajo efectivo.
- 📅 **Plazo de entrega:** 5 días calendario desde que recibes la prueba.
- Si no alcanzas a terminar todo, entrega lo que tengas y cuéntanos en `SOLUCION.md` qué te faltó y cómo lo harías. Eso también cuenta.

---

## Stack

| Parte              | Tecnología                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| Gestor de paquetes | [Bun](https://bun.sh) (workspaces)                                                                          |
| `apps/api`         | Node + [Fastify](https://fastify.dev) + TypeScript                                                          |
| `apps/web`         | [Vite](https://vite.dev) + [React](https://react.dev) + [TanStack Query](https://tanstack.com/query/latest) |
| `packages/types`   | Esquemas compartidos con [Zod](https://zod.dev) (los usan la API y la web)                                  |
| Tests              | [Vitest](https://vitest.dev)                                                                                |
| Lint / formato     | [oxlint](https://oxc.rs/docs/guide/usage/linter) / [oxfmt](https://oxc.rs/docs/guide/usage/formatter)       |

No hay base de datos: la API guarda todo en memoria a partir de `apps/api/src/data/seed.ts`. Cada vez que reinicias la API los datos vuelven a su estado inicial.

## Cómo correrlo

Requisitos: [Bun](https://bun.sh/docs/installation) 1.2 o superior.

```bash
bun install
bun run dev          # API en http://localhost:3001 y web en http://localhost:5173
```

Otros comandos útiles (desde la raíz):

```bash
bun run test         # tests
bun run check-types  # verificación de tipos
bun run lint         # linter
bun run fmt          # formatea el código
```

## Estructura

```
apps/
  api/
    src/
      app.ts                    # crea la app de Fastify
      store.ts                  # "base de datos" en memoria
      conversations/routes.ts   # endpoints /api/conversations
      conversations/sort.ts     # ordenamiento de la bandeja
      data/seed.ts              # datos de ejemplo
  web/
    src/
      api/client.ts             # llamadas HTTP a la API
      hooks/                    # hooks de TanStack Query
      components/               # componentes de React
packages/
  types/src/                    # esquemas Zod y tipos compartidos
```

### Endpoints

| Método | Ruta                              | Descripción                                    |
| ------ | --------------------------------- | ---------------------------------------------- |
| GET    | `/api/conversations`              | Lista de conversaciones (más reciente primero) |
| POST   | `/api/conversations`              | Crea una conversación                          |
| GET    | `/api/conversations/:id`          | Detalle de una conversación                    |
| GET    | `/api/conversations/:id/messages` | Mensajes de una conversación                   |
| POST   | `/api/conversations/:id/messages` | Envía un mensaje como agente                   |

> Las fechas llegan del proveedor de WhatsApp con el formato `dd/mm/yyyy HH:mm` (hora de Colombia).

---

## Lo que tienes que hacer

### Parte 1 — Corregir errores reportados

Los agentes nos reportaron estos problemas. Para cada uno, encuentra la **causa raíz** y corrígela.

**🐞 Error 1 — "La bandeja está desordenada"**

> "Se supone que las conversaciones más recientes salen arriba, pero me aparecen primero unas de hace semanas y hasta una del año pasado."

Pista: hay un test que falla. Empieza por `bun run test`.

**🐞 Error 2 — "Respondo y la bandeja no se actualiza"**

> "Cuando le respondo a alguien, mi mensaje aparece en el chat, pero en la lista de la izquierda sigue saliendo el mensaje anterior. Solo se arregla si recargo la página."

**🐞 Error 3 (opcional) — "No me deja crear conversaciones"**

> "Cuando intento crear una conversación nueva con el número tal como me lo dan (por ejemplo `+57 300 123 4567`) me dice que el número es inválido."

### Parte 2 — Nueva funcionalidad

> **Como agente, quiero marcar una conversación como _resuelta_ y filtrar la bandeja por estado (abiertas / resueltas / todas), para enfocarme en lo que falta por atender.**

Criterios de aceptación:

1. Toda conversación tiene un estado: abierta o resuelta. Las conversaciones nuevas empiezan abiertas.
2. Desde el detalle de una conversación puedo marcarla como resuelta, y también volver a abrirla.
3. En la bandeja puedo filtrar por **Abiertas**, **Resueltas** o **Todas**.
4. Si recargo la página, el filtro que tenía seleccionado se mantiene.
5. La API valida los datos que recibe (como lo hacen los endpoints que ya existen).
6. Hay al menos un test nuevo que cubra la funcionalidad.

Hay varias formas válidas de resolver esto. No hay una respuesta "correcta": nos interesa que puedas **explicar por qué** elegiste la tuya.

---

## Qué debes entregar

1. **Tu propio repositorio** (GitHub, GitLab, etc.) con el código:
   - Clona este repo, crea una rama (por ejemplo `solucion`) y trabaja ahí.
   - Haz **commits pequeños y descriptivos** (por ejemplo, un commit por error corregido). Queremos ver cómo avanzaste.
   - Sube el repo y abre un **Pull Request de tu rama hacia `main`** dentro de tu repositorio.
   - Si el repo es privado, danos acceso (te diremos a qué usuario).
2. Un archivo **`SOLUCION.md`** en la raíz, con esta estructura:

   ```md
   ## Errores

   ### Error N

   - Síntoma:
   - Cómo lo encontré:
   - Causa raíz:
   - Cómo lo corregí y por qué así:

   ## Nueva funcionalidad

   - Qué hice:
   - Decisiones que tomé y alternativas que descarté (y por qué):
   - Qué haría diferente con más tiempo:

   ## Documentación que consulté

   - (links)

   ## Uso de IA

   - Herramienta(s):
   - Para qué la usé:
   ```

3. Antes de entregar, verifica que estos comandos terminen sin errores:

   ```bash
   bun run test
   bun run check-types
   bun run lint
   bun run fmt
   ```

## Uso de IA

Puedes usar herramientas de IA (ChatGPT, Copilot, Claude, etc.); aquí también las usamos. La única condición es que **lo declares** en `SOLUCION.md`.

Después de la entrega tendremos una **conversación de 30–40 minutos** en la que nos explicarás tu solución y haremos un cambio pequeño juntos. Lo más importante es que **entiendas y puedas defender todo lo que entregas**.

## ¿Qué evaluamos?

- Que los errores se corrijan en su causa raíz, no solo en el síntoma.
- Que la funcionalidad cumpla los criterios y respete la estructura existente del proyecto.
- La claridad con la que explicas tus decisiones y la documentación que consultaste.
- Calidad general: tipos, tests, lint y commits.

Si algo del enunciado no es claro, toma una decisión razonable y explícala en `SOLUCION.md`. Eso también es parte de la prueba.

¡Éxitos! 🚀
