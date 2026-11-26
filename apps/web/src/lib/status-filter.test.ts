import { describe, expect, it } from 'vitest'

import { readStatusFilter, withStatusFilter } from './status-filter.ts'

describe('readStatusFilter', () => {
  it.each([
    ['?status=open', 'open'],
    ['?status=resolved', 'resolved'],
    ['?status=all', 'all']
  ])('lee %s', (search, expected) => {
    expect(readStatusFilter(search)).toBe(expected)
  })

  it.each(['', '?status=cerradas', '?otro=1'])(
    'usa "open" si el filtro falta o no es válido: %j',
    (search) => {
      expect(readStatusFilter(search)).toBe('open')
    }
  )
})

describe('withStatusFilter', () => {
  it('agrega o reemplaza el filtro y conserva los demás parámetros', () => {
    expect(withStatusFilter('http://localhost:5173/?x=1', 'resolved')).toBe(
      'http://localhost:5173/?x=1&status=resolved'
    )
    expect(withStatusFilter('http://localhost:5173/?status=open', 'all')).toBe(
      'http://localhost:5173/?status=all'
    )
  })
})
