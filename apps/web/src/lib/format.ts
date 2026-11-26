/**
 * Las fechas llegan de la API en ISO 8601 (UTC). Para mostrarlas usamos la hora de
 * Colombia, sin importar la zona horaria del computador del agente.
 */
const dateTimeFormat = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Bogota'
})

export const formatDateTime = (iso: string): string => dateTimeFormat.format(new Date(iso))
