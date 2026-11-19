import type { Conversation } from '@mini-inbox/types'

/**
 * Ordena las conversaciones de la más reciente a la más antigua.
 */
export const sortByLastMessage = (conversations: Conversation[]): Conversation[] =>
  [...conversations].sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
