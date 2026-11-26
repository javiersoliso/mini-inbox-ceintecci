/**
 * El proveedor de WhatsApp entrega las fechas como "dd/mm/yyyy HH:mm" en hora de Colombia.
 * Ese texto no se puede ordenar ni comparar (empieza por el día), así que lo convertimos
 * una sola vez, al entrar a la API, y desde ahí trabajamos con instantes en ISO 8601 (UTC).
 */
const PROVIDER_DATE = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/

/** Colombia está en UTC−5 todo el año: no tiene horario de verano. */
const COLOMBIA_UTC_OFFSET_HOURS = -5
const HOUR_MS = 60 * 60 * 1000

export class InvalidProviderDateError extends Error {
  constructor(value: string) {
    super(`Fecha del proveedor inválida: "${value}" (se esperaba dd/mm/yyyy HH:mm)`)
    this.name = 'InvalidProviderDateError'
  }
}

export const parseProviderDate = (value: string): Date => {
  const match = PROVIDER_DATE.exec(value)
  if (!match) throw new InvalidProviderDateError(value)

  const day = Number(match[1])
  const month = Number(match[2])
  const year = Number(match[3])
  const hours = Number(match[4])
  const minutes = Number(match[5])

  // La hora "de reloj" de Colombia, armada como si fuera UTC para poder validarla.
  const wallClock = new Date(Date.UTC(year, month - 1, day, hours, minutes))

  // Date.UTC no falla con fechas imposibles: 31/02 lo convierte en 3 de marzo.
  // Si algún campo cambió al armarlo, la fecha no existía.
  const exists =
    wallClock.getUTCFullYear() === year &&
    wallClock.getUTCMonth() === month - 1 &&
    wallClock.getUTCDate() === day &&
    wallClock.getUTCHours() === hours &&
    wallClock.getUTCMinutes() === minutes
  if (!exists) throw new InvalidProviderDateError(value)

  return new Date(wallClock.getTime() - COLOMBIA_UTC_OFFSET_HOURS * HOUR_MS)
}
