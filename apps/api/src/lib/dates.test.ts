import { describe, expect, it } from 'vitest'

import { parseProviderDate } from './dates.ts'

describe('parseProviderDate', () => {
  it('lee la hora de Colombia y la convierte a UTC (UTC−5)', () => {
    expect(parseProviderDate('25/11/2026 14:00').toISOString()).toBe('2026-11-25T19:00:00.000Z')
  })

  it('lee el día primero (03/11 es 3 de noviembre, no 11 de marzo)', () => {
    expect(parseProviderDate('03/11/2026 09:15').toISOString()).toBe('2026-11-03T14:15:00.000Z')
  })

  it('cambia de día y de año cuando la hora en UTC lo cruza', () => {
    expect(parseProviderDate('31/12/2025 21:30').toISOString()).toBe('2026-01-01T02:30:00.000Z')
  })

  it.each(['2026-11-25 14:00', '25/11/2026', '25-11-2026 14:00', ''])(
    'rechaza un formato distinto: %j',
    (value) => {
      expect(() => parseProviderDate(value)).toThrow('Fecha del proveedor inválida')
    }
  )

  it.each(['31/02/2026 10:00', '25/13/2026 10:00', '25/11/2026 24:00'])(
    'rechaza una fecha que no existe: %s',
    (value) => {
      expect(() => parseProviderDate(value)).toThrow('Fecha del proveedor inválida')
    }
  )
})
