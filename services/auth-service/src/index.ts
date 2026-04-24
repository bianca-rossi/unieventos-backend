import Fastify from 'fastify'
import sensible from '@fastify/sensible'
import { userRoutes } from './routes/user.routes.js'
import { profileRoutes } from './routes/profile.routes.js'
import { accessLogRoutes } from './routes/accessLog.routes.js'

const app = Fastify({ logger: true })

await app.register(sensible)
await app.register(userRoutes, { prefix: '/users' })
await app.register(profileRoutes, { prefix: '/profiles' })
await app.register(accessLogRoutes, { prefix: '/access-logs' })

const port = Number(process.env.PORT ?? 3001)
const host = process.env.HOST ?? '0.0.0.0'

try {
  await app.listen({ port, host })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
