import { defineConfig } from 'vitest/config'

// Configuración propia para los tests: no carga el plugin de React de Vite porque
// los tests actuales son de lógica (caché y URL), no renderizan componentes.
export default defineConfig({ test: { environment: 'node' } })
