import type { FastifyPluginAsync } from 'fastify'

import {
  createConversationInputSchema,
  listConversationsQuerySchema,
  sendMessageInputSchema,
  updateConversationInputSchema
} from '@mini-inbox/types'

import type { Store } from '../store.ts'
import { sortByLastMessage } from './sort.ts'

type Options = { store: Store }
type IdParams = { Params: { id: string } }

const NOT_FOUND = { message: 'Conversación no encontrada' }

export const conversationRoutes: FastifyPluginAsync<Options> = async (app, { store }) => {
  app.get('/', async (request, reply) => {
    const parsed = listConversationsQuerySchema.safeParse(request.query)
    if (!parsed.success) {
      return reply.code(400).send({ issues: parsed.error.issues })
    }
    return sortByLastMessage(store.listConversations(parsed.data.status))
  })

  app.post('/', async (request, reply) => {
    const parsed = createConversationInputSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ issues: parsed.error.issues })
    }
    return reply.code(201).send(store.createConversation(parsed.data))
  })

  app.get<IdParams>('/:id', async (request, reply) => {
    const conversation = store.getConversation(request.params.id)
    if (!conversation) return reply.code(404).send(NOT_FOUND)
    return conversation
  })

  app.patch<IdParams>('/:id', async (request, reply) => {
    const parsed = updateConversationInputSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ issues: parsed.error.issues })
    }
    const conversation = store.updateStatus(request.params.id, parsed.data.status)
    if (!conversation) return reply.code(404).send(NOT_FOUND)
    return conversation
  })

  app.get<IdParams>('/:id/messages', async (request, reply) => {
    if (!store.getConversation(request.params.id)) {
      return reply.code(404).send(NOT_FOUND)
    }
    return store.listMessages(request.params.id)
  })

  app.post<IdParams>('/:id/messages', async (request, reply) => {
    const parsed = sendMessageInputSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ issues: parsed.error.issues })
    }
    const message = store.addMessage(request.params.id, 'agent', parsed.data.text)
    if (!message) return reply.code(404).send(NOT_FOUND)
    return reply.code(201).send(message)
  })
}
