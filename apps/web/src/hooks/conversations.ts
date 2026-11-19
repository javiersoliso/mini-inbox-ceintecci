import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateConversationInput } from '@mini-inbox/types'

import { api } from '../api/client.ts'

export const useConversations = () =>
  useQuery({ queryKey: ['conversations'], queryFn: api.getConversations })

export const useConversation = (id: string) =>
  useQuery({ queryKey: ['conversations', id], queryFn: () => api.getConversation(id) })

export const useCreateConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateConversationInput) => api.createConversation(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }
  })
}
