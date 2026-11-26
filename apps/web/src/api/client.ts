import type { z } from 'zod'

import {
  conversationListSchema,
  conversationSchema,
  messageListSchema,
  messageSchema,
  type CreateConversationInput,
  type SendMessageInput,
  type StatusFilter,
  type UpdateConversationInput
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
  getConversations: (status: StatusFilter) =>
    request(`/conversations?${new URLSearchParams({ status })}`, conversationListSchema),

  getConversation: (id: string) => request(`/conversations/${id}`, conversationSchema),

  updateConversation: (id: string, input: UpdateConversationInput) =>
    request(`/conversations/${id}`, conversationSchema, {
      method: 'PATCH',
      body: JSON.stringify(input)
    }),

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
