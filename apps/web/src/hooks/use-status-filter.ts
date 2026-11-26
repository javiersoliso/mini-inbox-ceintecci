import { useState } from 'react'

import type { StatusFilter } from '@mini-inbox/types'

import { readStatusFilter, withStatusFilter } from '../lib/status-filter.ts'

/**
 * El filtro vive en la URL para que sobreviva a la recarga y se pueda compartir el enlace.
 * replaceState cambia la URL sin recargar la página ni llenar el historial del navegador.
 */
export const useStatusFilter = () => {
  const [statusFilter, setStatusFilter] = useState(() => readStatusFilter(window.location.search))

  const changeStatusFilter = (filter: StatusFilter) => {
    window.history.replaceState(null, '', withStatusFilter(window.location.href, filter))
    setStatusFilter(filter)
  }

  return [statusFilter, changeStatusFilter] as const
}
