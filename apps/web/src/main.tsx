import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { App } from './App.tsx'
import './styles.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Los datos se consideran frescos durante 1 minuto
      staleTime: 60_000
    }
  }
})

const root = document.getElementById('root')
if (!root) throw new Error('No se encontró el elemento #root')

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
