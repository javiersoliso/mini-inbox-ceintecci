import type { z } from 'zod'

import {
  conversationListSchema,
  conversationSchema,
  messageListSchema,
  messageSchema,
  type CreateConversationInput,
  type SendMessageInput
} from '@mini-inbox/types'

const request = async <T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> => {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers }
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status} al llamar ${path}`)
  }

  return schema.parse(await response.json())
}

export const api = {
  getConversations: () => request('/conversations', conversationListSchema),

  getConversation: (id: string) => request(`/conversations/${id}`, conversationSchema),

  getMessages: (conversationId: string) =>
    request(`/conversations/${conversationId}/messages`, messageListSchema),

  sendMessage: (conversationId: string, input: SendMessageInput) =>
    request(`/conversations/${conversationId}/messages`, messageSchema, {
      method: 'POST',
      body: JSON.stringify(input)
    }),

  createConversation: (input: CreateConversationInput) =>
    request('/conversations', conversationSchema, { method: 'POST', body: JSON.stringify(input) })
}
