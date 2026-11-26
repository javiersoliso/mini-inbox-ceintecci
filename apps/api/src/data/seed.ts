import type { Conversation, Message } from '@mini-inbox/types'

/** Conversación tal como llega del proveedor: `lastMessageAt` en "dd/mm/yyyy HH:mm" (hora de Colombia). */
export type ProviderConversation = Conversation
/** Mensaje tal como llega del proveedor: `sentAt` en "dd/mm/yyyy HH:mm" (hora de Colombia). */
export type ProviderMessage = Message

/**
 * Datos de ejemplo tal como llegan del proveedor de WhatsApp.
 * Las fechas vienen en formato "dd/mm/yyyy HH:mm". `createStore` las convierte a ISO.
 */
export const seedConversations: ProviderConversation[] = [
  {
    id: 'c1',
    contactName: 'Laura Gómez',
    contactPhone: '+573001234567',
    lastMessageAt: '03/11/2026 09:15',
    lastMessagePreview: '¿Cuándo empiezan las inscripciones?'
  },
  {
    id: 'c2',
    contactName: 'Andrés Rojas',
    contactPhone: '+573159876543',
    lastMessageAt: '18/11/2026 16:40',
    lastMessagePreview: 'Gracias, ya pude ingresar a la plataforma'
  },
  {
    id: 'c3',
    contactName: 'María Fernanda Díaz',
    contactPhone: '+573204567890',
    lastMessageAt: '28/10/2026 11:00',
    lastMessagePreview: 'Necesito el certificado de notas'
  },
  {
    id: 'c4',
    contactName: 'Julián Torres',
    contactPhone: '+573112223344',
    lastMessageAt: '18/11/2026 09:10',
    lastMessagePreview: '¿El pago se puede hacer por PSE?'
  },
  {
    id: 'c5',
    contactName: 'Camila Herrera',
    contactPhone: '+573015556677',
    lastMessageAt: '15/12/2025 14:20',
    lastMessagePreview: 'Ok, muchas gracias'
  },
  {
    id: 'c6',
    contactName: 'Santiago Pérez',
    contactPhone: '+573187778899',
    lastMessageAt: '05/11/2026 08:30',
    lastMessagePreview: '¿Tienen programas virtuales?'
  }
]

export const seedMessages: ProviderMessage[] = [
  {
    id: 'm1',
    conversationId: 'c1',
    author: 'bot',
    text: '¡Hola! Soy el asistente virtual. ¿En qué te puedo ayudar?',
    sentAt: '03/11/2026 09:14'
  },
  {
    id: 'm2',
    conversationId: 'c1',
    author: 'contact',
    text: '¿Cuándo empiezan las inscripciones?',
    sentAt: '03/11/2026 09:15'
  },
  {
    id: 'm3',
    conversationId: 'c2',
    author: 'contact',
    text: 'No puedo entrar a la plataforma virtual',
    sentAt: '18/11/2026 16:20'
  },
  {
    id: 'm4',
    conversationId: 'c2',
    author: 'agent',
    text: 'Hola Andrés, ya restablecimos tu contraseña. Intenta de nuevo por favor.',
    sentAt: '18/11/2026 16:35'
  },
  {
    id: 'm5',
    conversationId: 'c2',
    author: 'contact',
    text: 'Gracias, ya pude ingresar a la plataforma',
    sentAt: '18/11/2026 16:40'
  },
  {
    id: 'm6',
    conversationId: 'c3',
    author: 'contact',
    text: 'Necesito el certificado de notas',
    sentAt: '28/10/2026 11:00'
  },
  {
    id: 'm7',
    conversationId: 'c4',
    author: 'contact',
    text: '¿El pago se puede hacer por PSE?',
    sentAt: '18/11/2026 09:10'
  },
  {
    id: 'm8',
    conversationId: 'c5',
    author: 'agent',
    text: 'Te enviamos la información a tu correo.',
    sentAt: '15/12/2025 14:18'
  },
  {
    id: 'm9',
    conversationId: 'c5',
    author: 'contact',
    text: 'Ok, muchas gracias',
    sentAt: '15/12/2025 14:20'
  },
  {
    id: 'm10',
    conversationId: 'c6',
    author: 'contact',
    text: '¿Tienen programas virtuales?',
    sentAt: '05/11/2026 08:30'
  }
]
