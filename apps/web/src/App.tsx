import { useState } from 'react'

import { ConversationDetail } from './components/ConversationDetail.tsx'
import { ConversationList } from './components/ConversationList.tsx'
import { NewConversationForm } from './components/NewConversationForm.tsx'
import { StatusFilterTabs } from './components/StatusFilterTabs.tsx'
import { useStatusFilter } from './hooks/use-status-filter.ts'

export const App = () => {
  const [selectedId, setSelectedId] = useState<string>()
  const [isCreating, setIsCreating] = useState(false)
  const [statusFilter, setStatusFilter] = useStatusFilter()

  return (
    <div className="layout">
      <aside className="sidebar">
        <header className="sidebar-header">
          <h1>Bandeja</h1>
          <button
            type="button"
            onClick={() => setIsCreating((value) => !value)}
          >
            {isCreating ? 'Cancelar' : 'Nueva conversación'}
          </button>
        </header>

        {isCreating && (
          <NewConversationForm
            onCreated={(id) => {
              setIsCreating(false)
              setSelectedId(id)
            }}
          />
        )}

        <StatusFilterTabs
          value={statusFilter}
          onChange={setStatusFilter}
        />

        <ConversationList
          status={statusFilter}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </aside>

      <main className="content">
        {selectedId ? (
          <ConversationDetail conversationId={selectedId} />
        ) : (
          <p className="empty">Selecciona una conversación</p>
        )}
      </main>
    </div>
  )
}
