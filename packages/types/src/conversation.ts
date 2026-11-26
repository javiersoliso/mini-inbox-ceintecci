import { z } from 'zod'

/**
 * Celular colombiano. Ej: 3001234567
 */
export const phoneSchema = z.string().regex(/^3\d{9}$/, 'Número de celular inválido')

export const ConversationRawSchema = {
  id: z.string(),
  contactName: z.string(),
  contactPhone: z.string(),
  /**
   * Instante en ISO 8601 (UTC), por ejemplo "2026-11-18T21:40:00.000Z".
   * La API convierte el formato del proveedor ("dd/mm/yyyy HH:mm") al recibirlo.
   */
  lastMessageAt: z.iso.datetime(),
  lastMessagePreview: z.string()
}

export const conversationSchema = z.object(ConversationRawSchema)
export type Conversation = z.output<typeof conversationSchema>

export const conversationListSchema = z.array(conversationSchema)

export const createConversationInputSchema = z.object({
  contactName: z.string().trim().min(2, 'El nombre es muy corto'),
  contactPhone: phoneSchema
})
export type CreateConversationInput = z.output<typeof createConversationInputSchema>
