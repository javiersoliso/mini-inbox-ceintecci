import { useConversation, useUpdateConversation } from '../hooks/conversations.ts'
import { useMessages } from '../hooks/messages.ts'
import { formatDateTime } from '../lib/format.ts'
import { MessageComposer } from './MessageComposer.tsx'

const AUTHOR_LABEL = { contact: 'Contacto', agent: 'Agente', bot: 'Bot' } as const

type Props = { conversationId: string }

export const ConversationDetail = ({ conversationId }: Props) => {
  const conversation = useConversation(conversationId)
  const messages = useMessages(conversationId)
  const updateConversation = useUpdateConversation(conversationId)

  if (conversation.isPending) return <p className="muted">Cargando…</p>
  if (conversation.isError) {
    return <p className="error">No se pudo cargar la conversación</p>
  }

  const isResolved = conversation.data.status === 'resolved'

  return (
    <section className="detail">
      <header className="detail-header">
        <h2>{conversation.data.contactName}</h2>
        <span className="muted">{conversation.data.contactPhone}</span>
        <span className="detail-status">{isResolved ? 'Resuelta' : 'Abierta'}</span>
        <button
          type="button"
          className="detail-action"
          disabled={updateConversation.isPending}
          onClick={() => updateConversation.mutate({ status: isResolved ? 'open' : 'resolved' })}
        >
          {isResolved ? 'Reabrir' : 'Marcar como resuelta'}
        </button>
      </header>
      {updateConversation.isError && <p className="error">No se pudo cambiar el estado</p>}

      <ol className="messages">
        {messages.data?.map((message) => (
          <li
            key={message.id}
            className={`message message-${message.author}`}
          >
            <span className="message-meta">
              {AUTHOR_LABEL[message.author]} · {formatDateTime(message.sentAt)}
            </span>
            <p>{message.text}</p>
          </li>
        ))}
      </ol>

      <MessageComposer conversationId={conversationId} />
    </section>
  )
}
