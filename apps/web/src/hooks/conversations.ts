import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateConversationInput } from '@mini-inbox/types'

import { api } from '../api/client.ts'
import { conversationKeys, invalidateConversations } from './keys.ts'

export const useConversations = () =>
  useQuery({ queryKey: conversationKeys.list(), queryFn: api.getConversations })

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
