import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { SendMessageInput } from '@mini-inbox/types'

import { api } from '../api/client.ts'
import { conversationKeys, invalidateConversations } from './keys.ts'

export const useMessages = (conversationId: string) =>
  useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: () => api.getMessages(conversationId)
  })

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SendMessageInput) => api.sendMessage(conversationId, input),
    onSuccess: async () => {
      // Refresca los mensajes, el detalle y la bandeja (último mensaje y orden)
      await invalidateConversations(queryClient)
    }
  })
}
