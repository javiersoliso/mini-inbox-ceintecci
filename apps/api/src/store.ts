import { randomUUID } from 'node:crypto'

import type { Conversation, Message, MessageAuthor } from '@mini-inbox/types'

import { seedConversations, seedMessages } from './data/seed.ts'
import { formatProviderDate } from './lib/dates.ts'

type StoreData = { conversations: Conversation[]; messages: Message[] }

/**
 * "Base de datos" en memoria. Se reinicia cada vez que arranca el servidor.
 */
export const createStore = (
  initial: StoreData = { conversations: seedConversations, messages: seedMessages }
) => {
  const conversations = new Map(initial.conversations.map((c) => [c.id, { ...c }]))
  const messages = initial.messages.map((m) => ({ ...m }))

  return {
    listConversations: (): Conversation[] => [...conversations.values()],

    getConversation: (id: string): Conversation | undefined => conversations.get(id),

    listMessages: (conversationId: string): Message[] =>
      messages.filter((m) => m.conversationId === conversationId),

    createConversation: (input: { contactName: string; contactPhone: string }): Conversation => {
      const conversation: Conversation = {
        id: randomUUID(),
        contactName: input.contactName,
        contactPhone: input.contactPhone,
        lastMessageAt: formatProviderDate(new Date()),
        lastMessagePreview: ''
      }
      conversations.set(conversation.id, conversation)
      return conversation
    },

    addMessage: (
      conversationId: string,
      author: MessageAuthor,
      text: string
    ): Message | undefined => {
      const conversation = conversations.get(conversationId)
      if (!conversation) return undefined

      const message: Message = {
        id: randomUUID(),
        conversationId,
        author,
        text,
        sentAt: formatProviderDate(new Date())
      }
      messages.push(message)
      conversation.lastMessageAt = message.sentAt
      conversation.lastMessagePreview = text
      return message
    }
  }
}

export type Store = ReturnType<typeof createStore>
