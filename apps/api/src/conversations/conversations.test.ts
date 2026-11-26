import { describe, expect, it } from 'vitest'

import { phoneSchema, type Conversation, type Message } from '@mini-inbox/types'

import { buildApp } from '../app.ts'
import { seedConversations } from '../data/seed.ts'

describe('GET /api/conversations', () => {
  it('devuelve las conversaciones de la más reciente a la más antigua', async () => {
    const app = buildApp()

    const response = await app.inject({ method: 'GET', url: '/api/conversations' })

    expect(response.statusCode).toBe(200)
    expect(response.json<Conversation[]>().map((c) => c.id)).toEqual([
      'c2', // 18/11/2026 16:40
      'c4', // 18/11/2026 09:10
      'c6', // 05/11/2026 08:30
      'c1', // 03/11/2026 09:15
      'c3', // 28/10/2026 11:00
      'c5' //  15/12/2025 14:20
    ])
  })
})

describe('POST /api/conversations/:id/messages', () => {
  it('agrega el mensaje y actualiza el resumen de la conversación', async () => {
    const app = buildApp()

    const response = await app.inject({
      method: 'POST',
      url: '/api/conversations/c3/messages',
      payload: { text: 'Hola María, ya te lo enviamos' }
    })

    expect(response.statusCode).toBe(201)
    expect(response.json<Message>().author).toBe('agent')

    const conversation = await app.inject({ method: 'GET', url: '/api/conversations/c3' })
    expect(conversation.json<Conversation>().lastMessagePreview).toBe(
      'Hola María, ya te lo enviamos'
    )
  })

  it('rechaza mensajes vacíos', async () => {
    const app = buildApp()

    const response = await app.inject({
      method: 'POST',
      url: '/api/conversations/c1/messages',
      payload: { text: '   ' }
    })

    expect(response.statusCode).toBe(400)
  })

  it('responde 404 si la conversación no existe', async () => {
    const app = buildApp()

    const response = await app.inject({
      method: 'POST',
      url: '/api/conversations/no-existe/messages',
      payload: { text: 'Hola' }
    })

    expect(response.statusCode).toBe(404)
  })
})

describe('POST /api/conversations', () => {
  it.each(['+57 300 123 4567', '+573001234567', '300 123 4567', '(300) 123-4567', '3001234567'])(
    'acepta el celular "%s" y lo guarda como +573001234567',
    async (contactPhone) => {
      const app = buildApp()

      const response = await app.inject({
        method: 'POST',
        url: '/api/conversations',
        payload: { contactName: 'Ana Martínez', contactPhone }
      })

      expect(response.statusCode).toBe(201)
      expect(response.json<Conversation>().contactPhone).toBe('+573001234567')
    }
  )

  it.each(['300 123 456', '+1 300 123 4567', '+57 200 123 4567', '300 abc 4567', ''])(
    'rechaza el celular "%s"',
    async (contactPhone) => {
      const app = buildApp()

      const response = await app.inject({
        method: 'POST',
        url: '/api/conversations',
        payload: { contactName: 'Ana Martínez', contactPhone }
      })

      expect(response.statusCode).toBe(400)
    }
  )

  it('los celulares de los datos existentes cumplen el mismo esquema', () => {
    for (const { contactPhone } of seedConversations) {
      expect(phoneSchema.parse(contactPhone)).toBe(contactPhone)
    }
  })
})
