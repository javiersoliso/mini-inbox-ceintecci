import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { SendMessageInput } from '@mini-inbox/types'

import { api } from '../api/client.ts'

export const useMessages = (conversationId: string) =>
  useQuery({
    queryKey: ['conversations', conversationId, 'messages'],
    queryFn: () => api.getMessages(conversationId)
  })

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SendMessageInput) => api.sendMessage(conversationId, input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['conversations', conversationId, 'messages'] }),
        // Refresca la bandeja para mostrar el último mensaje
        queryClient.invalidateQueries({ queryKey: ['conversation'] })
      ])
    }
  })
}
