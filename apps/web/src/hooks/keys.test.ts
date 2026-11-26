import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'

import { conversationKeys, invalidateConversations } from './keys.ts'

describe('invalidateConversations', () => {
  it('invalida la bandeja, el detalle y los mensajes, que cambian al enviar un mensaje', async () => {
    const queryClient = new QueryClient()
    const keys = [
      conversationKeys.list('open'),
      conversationKeys.list('all'),
      conversationKeys.detail('c3'),
      conversationKeys.messages('c3')
    ]
    for (const key of keys) queryClient.setQueryData(key, [])

    await invalidateConversations(queryClient)

    const invalidated = keys.map((key) => queryClient.getQueryState(key)?.isInvalidated)
    expect(invalidated).toEqual([true, true, true, true])
  })

  it('la llave que se usaba antes (en singular) no invalidaba la bandeja', async () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(conversationKeys.list('all'), [])

    await queryClient.invalidateQueries({ queryKey: ['conversation'] })

    expect(queryClient.getQueryState(conversationKeys.list('all'))?.isInvalidated).toBe(false)
  })
})
