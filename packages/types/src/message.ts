import { z } from 'zod'

export const messageAuthorSchema = z.enum(['contact', 'agent', 'bot'])
export type MessageAuthor = z.output<typeof messageAuthorSchema>

export const MessageRawSchema = {
  id: z.string(),
  conversationId: z.string(),
  author: messageAuthorSchema,
  text: z.string(),
  /** Instante en ISO 8601 (UTC). La API convierte el formato del proveedor al recibirlo. */
  sentAt: z.iso.datetime()
}

export const messageSchema = z.object(MessageRawSchema)
export type Message = z.output<typeof messageSchema>

export const messageListSchema = z.array(messageSchema)

export const sendMessageInputSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'El mensaje no puede estar vacío')
    .max(1000, 'El mensaje es muy largo')
})
export type SendMessageInput = z.output<typeof sendMessageInputSchema>
