import 'dotenv/config'

console.log('Worker started')

const shutdown = async (signal: string) => {
  console.log(`Received ${signal}, shutting down gracefully...`)
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
