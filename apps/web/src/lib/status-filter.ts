import { statusFilterSchema, type StatusFilter } from '@mini-inbox/types'

/** Por defecto mostramos lo que falta por atender. */
export const DEFAULT_STATUS_FILTER: StatusFilter = 'open'

/**
 * Lee el filtro de la URL (?status=...). Si no está o no es válido (por ejemplo, alguien
 * editó la URL a mano), usa el de por defecto en vez de romper la página.
 */
export const readStatusFilter = (search: string): StatusFilter => {
  const parsed = statusFilterSchema.safeParse(new URLSearchParams(search).get('status'))
  return parsed.success ? parsed.data : DEFAULT_STATUS_FILTER
}

/** Devuelve la misma URL con el filtro aplicado, sin tocar el resto de parámetros. */
export const withStatusFilter = (href: string, filter: StatusFilter): string => {
  const url = new URL(href)
  url.searchParams.set('status', filter)
  return url.toString()
}
