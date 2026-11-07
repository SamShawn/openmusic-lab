import Fastify from 'fastify'
import cors from '@fastify/cors'
import 'dotenv/config'

const app = Fastify({ logger: true })

await app.register(cors, { origin: true })

app.get('/health', async () => ({ status: 'ok' }))

const port = Number(process.env.API_PORT) || 4000

try {
  await app.listen({ port, host: '0.0.0.0' })
  app.log.info(`API listening on <http://localhost>:${port}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
