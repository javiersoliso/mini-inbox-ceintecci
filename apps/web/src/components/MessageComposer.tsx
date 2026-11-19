import { useState, type FormEvent } from 'react'

import { sendMessageInputSchema } from '@mini-inbox/types'

import { useSendMessage } from '../hooks/messages.ts'

type Props = { conversationId: string }

export const MessageComposer = ({ conversationId }: Props) => {
  const [text, setText] = useState('')
  const [error, setError] = useState<string>()
  const sendMessage = useSendMessage(conversationId)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = sendMessageInputSchema.safeParse({ text })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message)
      return
    }

    setError(undefined)
    sendMessage.mutate(parsed.data, { onSuccess: () => setText('') })
  }

  return (
    <form
      className="composer"
      onSubmit={handleSubmit}
    >
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Escribe una respuesta…"
        rows={3}
      />
      {error && <p className="error">{error}</p>}
      {sendMessage.isError && <p className="error">No se pudo enviar el mensaje</p>}
      <button
        type="submit"
        disabled={sendMessage.isPending}
      >
        {sendMessage.isPending ? 'Enviando…' : 'Enviar'}
      </button>
    </form>
  )
}
