import { buildApp } from './app.ts'

const PORT = Number(process.env.PORT ?? 3001)

const app = buildApp({ logger: true })

try {
  await app.listen({ port: PORT, host: '0.0.0.0' })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
