import type { StatusFilter } from '@mini-inbox/types'

import { useConversations } from '../hooks/conversations.ts'
import { formatDateTime } from '../lib/format.ts'

const EMPTY_TEXT: Record<StatusFilter, string> = {
  open: 'No hay conversaciones abiertas',
  resolved: 'No hay conversaciones resueltas',
  all: 'No hay conversaciones'
}

type Props = { status: StatusFilter; selectedId?: string; onSelect: (id: string) => void }

export const ConversationList = ({ status, selectedId, onSelect }: Props) => {
  const { data: conversations, isPending, isError } = useConversations(status)

  if (isPending) return <p className="muted">Cargando conversaciones…</p>
  if (isError) return <p className="error">No se pudieron cargar</p>
  if (conversations.length === 0) {
    return <p className="muted">{EMPTY_TEXT[status]}</p>
  }

  return (
    <ul className="conversation-list">
      {conversations.map((conversation) => (
        <li key={conversation.id}>
          <button
            type="button"
            className={
              conversation.id === selectedId ? 'conversation-item selected' : 'conversation-item'
            }
            onClick={() => onSelect(conversation.id)}
          >
            <span className="conversation-name">
              {conversation.contactName}
              {conversation.status === 'resolved' && <span className="badge">Resuelta</span>}
            </span>
            <span className="conversation-date">{formatDateTime(conversation.lastMessageAt)}</span>
            <span className="conversation-preview">
              {conversation.lastMessagePreview || 'Sin mensajes'}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
