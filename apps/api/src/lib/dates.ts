const pad = (value: number) => String(value).padStart(2, '0')

/**
 * El proveedor de WhatsApp maneja las fechas como "dd/mm/yyyy HH:mm".
 * Usamos el mismo formato para que todo sea consistente.
 */
export const formatProviderDate = (date: Date): string => {
  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1)
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${day}/${month}/${date.getFullYear()} ${hours}:${minutes}`
}
