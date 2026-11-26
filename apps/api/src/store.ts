import { randomUUID } from 'node:crypto'

import type { Conversation, Message, MessageAuthor } from '@mini-inbox/types'

import {
  seedConversations,
  seedMessages,
  type ProviderConversation,
  type ProviderMessage
} from './data/seed.ts'
import { parseProviderDate } from './lib/dates.ts'

type StoreData = { conversations: ProviderConversation[]; messages: ProviderMessage[] }

const toIso = (providerDate: string) => parseProviderDate(providerDate).toISOString()
const now = () => new Date().toISOString()

/**
 * "Base de datos" en memoria. Se reinicia cada vez que arranca el servidor.
 * Los datos entran en formato del proveedor y aquí, en la frontera, las fechas
 * se convierten a ISO 8601 (UTC). El resto de la app nunca ve "dd/mm/yyyy".
 */
export const createStore = (
  initial: StoreData = { conversations: seedConversations, messages: seedMessages }
) => {
  const conversations = new Map(
    initial.conversations.map((c): [string, Conversation] => [
      c.id,
      { ...c, lastMessageAt: toIso(c.lastMessageAt) }
    ])
  )
  const messages = initial.messages.map((m): Message => ({ ...m, sentAt: toIso(m.sentAt) }))

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
        lastMessageAt: now(),
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

      const message: Message = { id: randomUUID(), conversationId, author, text, sentAt: now() }
      messages.push(message)
      conversation.lastMessageAt = message.sentAt
      conversation.lastMessagePreview = text
      return message
    }
  }
}

export type Store = ReturnType<typeof createStore>
