import type { Conversation } from '@mini-inbox/types'

/**
 * Ordena las conversaciones de la más reciente a la más antigua.
 * Compara instantes (milisegundos), no texto: ordenar texto solo coincide con el
 * orden en el tiempo si el formato lo garantiza, y eso es justo lo que falló antes.
 */
export const sortByLastMessage = (conversations: Conversation[]): Conversation[] =>
  [...conversations].sort((a, b) => Date.parse(b.lastMessageAt) - Date.parse(a.lastMessageAt))
