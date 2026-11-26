import type { QueryClient } from '@tanstack/react-query'

const all = ['conversations'] as const

/**
 * Todas las llaves de caché de conversaciones salen de aquí. Antes cada hook escribía
 * su llave a mano y la invalidación usaba ['conversation'] (en singular), que no
 * coincide con ninguna consulta. Con una sola fuente, un nombre mal escrito es un
 * error de TypeScript y no una bandeja desactualizada.
 *
 * Todas comparten el prefijo ['conversations'], así que invalidarlo las cubre todas.
 */
export const conversationKeys = {
  all,
  list: () => [...all, 'list'] as const,
  detail: (id: string) => [...all, 'detail', id] as const,
  messages: (id: string) => [...all, 'detail', id, 'messages'] as const
}

/**
 * Enviar un mensaje cambia los mensajes, el resumen de la conversación y el orden de la
 * bandeja. Invalidamos el prefijo común y TanStack Query vuelve a pedir lo que está en
 * pantalla. Esto funciona aunque `staleTime` sea de 1 minuto: invalidar ignora el staleTime.
 */
export const invalidateConversations = (queryClient: QueryClient) =>
  queryClient.invalidateQueries({ queryKey: conversationKeys.all })
