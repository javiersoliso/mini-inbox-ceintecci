import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type {
  CreateConversationInput,
  StatusFilter,
  UpdateConversationInput
} from '@mini-inbox/types'

import { api } from '../api/client.ts'
import { conversationKeys, invalidateConversations } from './keys.ts'

export const useConversations = (status: StatusFilter) =>
  useQuery({ queryKey: conversationKeys.list(status), queryFn: () => api.getConversations(status) })

export const useConversation = (id: string) =>
  useQuery({ queryKey: conversationKeys.detail(id), queryFn: () => api.getConversation(id) })

export const useCreateConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateConversationInput) => api.createConversation(input),
    onSuccess: async () => {
      await invalidateConversations(queryClient)
    }
  })
}

export const useUpdateConversation = (id: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateConversationInput) => api.updateConversation(id, input),
    onSuccess: async () => {
      // Cambia el detalle y en qué pestaña de la bandeja aparece la conversación
      await invalidateConversations(queryClient)
    }
  })
}
