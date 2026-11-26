import { describe, expect, it } from 'vitest'

import type { Conversation } from '@mini-inbox/types'

import { buildApp } from '../app.ts'

const listIds = async (app: ReturnType<typeof buildApp>, query = '') => {
  const response = await app.inject({ method: 'GET', url: `/api/conversations${query}` })
  return response.json<Conversation[]>().map((c) => c.id)
}

const setStatus = (app: ReturnType<typeof buildApp>, id: string, payload: unknown) =>
  app.inject({ method: 'PATCH', url: `/api/conversations/${id}`, payload: payload as object })

describe('estado de una conversación', () => {
  it('las conversaciones nuevas empiezan abiertas', async () => {
    const app = buildApp()

    const response = await app.inject({
      method: 'POST',
      url: '/api/conversations',
      payload: { contactName: 'Ana Martínez', contactPhone: '3001234567' }
    })

    expect(response.json<Conversation>().status).toBe('open')
  })

  it('se puede marcar como resuelta y volver a abrir', async () => {
    const app = buildApp()

    const resolved = await setStatus(app, 'c1', { status: 'resolved' })
    expect(resolved.statusCode).toBe(200)
    expect(resolved.json<Conversation>().status).toBe('resolved')

    const reopened = await setStatus(app, 'c1', { status: 'open' })
    expect(reopened.json<Conversation>().status).toBe('open')
  })

  it.each([{ status: 'cerrada' }, {}, { status: 'resolved', contactName: 'Otro nombre' }])(
    'rechaza un cuerpo inválido: %j',
    async (payload) => {
      const app = buildApp()

      const response = await setStatus(app, 'c1', payload)

      expect(response.statusCode).toBe(400)
    }
  )

  it('responde 404 si la conversación no existe', async () => {
    const app = buildApp()

    const response = await setStatus(app, 'no-existe', { status: 'resolved' })

    expect(response.statusCode).toBe(404)
  })
})

describe('GET /api/conversations?status=', () => {
  it('filtra por estado y mantiene el orden por fecha', async () => {
    const app = buildApp()
    await setStatus(app, 'c4', { status: 'resolved' })
    await setStatus(app, 'c5', { status: 'resolved' })

    expect(await listIds(app, '?status=open')).toEqual(['c2', 'c6', 'c1', 'c3'])
    expect(await listIds(app, '?status=resolved')).toEqual(['c4', 'c5'])
    expect(await listIds(app, '?status=all')).toHaveLength(6)
    expect(await listIds(app)).toHaveLength(6)
  })

  it('rechaza un filtro desconocido', async () => {
    const app = buildApp()

    const response = await app.inject({ method: 'GET', url: '/api/conversations?status=foo' })

    expect(response.statusCode).toBe(400)
  })
})
