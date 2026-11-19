import { useState, type FormEvent } from 'react'

import { z } from 'zod'

import { createConversationInputSchema } from '@mini-inbox/types'

import { useCreateConversation } from '../hooks/conversations.ts'

type Props = { onCreated: (id: string) => void }
type FieldErrors = { contactName?: string[]; contactPhone?: string[] }

export const NewConversationForm = ({ onCreated }: Props) => {
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const createConversation = useCreateConversation()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = createConversationInputSchema.safeParse({ contactName, contactPhone })
    if (!parsed.success) {
      setErrors(z.flattenError(parsed.error).fieldErrors)
      return
    }

    setErrors({})
    createConversation.mutate(parsed.data, {
      onSuccess: (conversation) => onCreated(conversation.id)
    })
  }

  return (
    <form
      className="new-conversation"
      onSubmit={handleSubmit}
    >
      <label>
        Nombre
        <input
          value={contactName}
          onChange={(event) => setContactName(event.target.value)}
          placeholder="Ana Martínez"
        />
      </label>
      {errors.contactName && <p className="error">{errors.contactName[0]}</p>}

      <label>
        Celular
        <input
          value={contactPhone}
          onChange={(event) => setContactPhone(event.target.value)}
          placeholder="+57 300 123 4567"
        />
      </label>
      {errors.contactPhone && <p className="error">{errors.contactPhone[0]}</p>}

      {createConversation.isError && <p className="error">No se pudo crear la conversación</p>}
      <button
        type="submit"
        disabled={createConversation.isPending}
      >
        Crear
      </button>
    </form>
  )
}
