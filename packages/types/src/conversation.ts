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
