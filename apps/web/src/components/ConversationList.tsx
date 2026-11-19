import { useConversations } from '../hooks/conversations.ts'

type Props = { selectedId?: string; onSelect: (id: string) => void }

export const ConversationList = ({ selectedId, onSelect }: Props) => {
  const { data: conversations, isPending, isError } = useConversations()

  if (isPending) return <p className="muted">Cargando conversaciones…</p>
  if (isError) return <p className="error">No se pudieron cargar</p>
  if (conversations.length === 0) {
    return <p className="muted">No hay conversaciones</p>
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
            <span className="conversation-name">{conversation.contactName}</span>
            <span className="conversation-date">{conversation.lastMessageAt}</span>
            <span className="conversation-preview">
              {conversation.lastMessagePreview || 'Sin mensajes'}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
