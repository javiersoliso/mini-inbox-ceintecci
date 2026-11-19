import Fastify from 'fastify'

import { conversationRoutes } from './conversations/routes.ts'
import { createStore, type Store } from './store.ts'

type BuildAppOptions = { logger?: boolean; store?: Store }

export const buildApp = ({ logger = false, store }: BuildAppOptions = {}) => {
  const app = Fastify({ logger })

  app.get('/api/health', async () => ({ ok: true }))
  app.register(conversationRoutes, { prefix: '/api/conversations', store: store ?? createStore() })

  return app
}
