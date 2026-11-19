import { z } from 'zod'

export const messageAuthorSchema = z.enum(['contact', 'agent', 'bot'])
export type MessageAuthor = z.output<typeof messageAuthorSchema>

export const MessageRawSchema = {
  id: z.string(),
  conversationId: z.string(),
  author: messageAuthorSchema,
  text: z.string(),
  /** Formato del proveedor de WhatsApp: "dd/mm/yyyy HH:mm" */
  sentAt: z.string()
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
