import { z } from 'zod'

/** Separadores que se usan al escribir un número: espacios, guiones, puntos y paréntesis. */
const PHONE_SEPARATORS = /[\s().-]/g

/**
 * Celular colombiano. Acepta el número como lo escribe un agente ("+57 300 123 4567",
 * "300-123-4567", "3001234567") y lo devuelve en E.164 ("+573001234567"), el mismo
 * formato que ya tienen los datos guardados. Como la salida también es una entrada
 * válida, la web y la API pueden validar el mismo dato dos veces sin problema.
 */
export const phoneSchema = z
  .string()
  .transform((value) => value.replace(PHONE_SEPARATORS, ''))
  .pipe(z.string().regex(/^(\+57)?3\d{9}$/, 'Número de celular inválido'))
  .transform((digits) => `+57${digits.slice(-10)}`)

/** Abierta: falta atenderla. Resuelta: el agente la dio por terminada (se puede reabrir). */
export const conversationStatusSchema = z.enum(['open', 'resolved'])
export type ConversationStatus = z.output<typeof conversationStatusSchema>

export const ConversationRawSchema = {
  id: z.string(),
  contactName: z.string(),
  contactPhone: z.string(),
  /**
   * Instante en ISO 8601 (UTC), por ejemplo "2026-11-18T21:40:00.000Z".
   * La API convierte el formato del proveedor ("dd/mm/yyyy HH:mm") al recibirlo.
   */
  lastMessageAt: z.iso.datetime(),
  lastMessagePreview: z.string(),
  status: conversationStatusSchema
}

export const conversationSchema = z.object(ConversationRawSchema)
export type Conversation = z.output<typeof conversationSchema>

export const conversationListSchema = z.array(conversationSchema)

/** Filtro de la bandeja: un estado, o "all" para no filtrar. */
export const statusFilterSchema = z.enum(['open', 'resolved', 'all'])
export type StatusFilter = z.output<typeof statusFilterSchema>

/** Query de GET /api/conversations. Sin `status` devuelve todas, como antes. */
export const listConversationsQuerySchema = z.object({ status: statusFilterSchema.default('all') })

/**
 * Body de PATCH /api/conversations/:id. Es estricto: rechaza campos desconocidos,
 * para que un cliente no crea que cambió algo que la API ignoró.
 */
export const updateConversationInputSchema = z.strictObject({ status: conversationStatusSchema })
export type UpdateConversationInput = z.output<typeof updateConversationInputSchema>

export const createConversationInputSchema = z.object({
  contactName: z.string().trim().min(2, 'El nombre es muy corto'),
  contactPhone: phoneSchema
})
export type CreateConversationInput = z.output<typeof createConversationInputSchema>
