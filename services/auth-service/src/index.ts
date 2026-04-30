import Fastify from 'fastify'
import sensible from '@fastify/sensible'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { userRoutes } from './routes/user.routes.js'
import { profileRoutes } from './routes/profile.routes.js'
import { accessLogRoutes } from './routes/accessLog.routes.js'

const app = Fastify({ logger: true })

await app.register(sensible)

await app.register(swagger, {
  openapi: {
    info: {
      title: 'Auth Service',
      description: 'API de autenticação e gestão de usuários do UniEventos',
      version: '0.1.0',
    },
    tags: [
      { name: 'Users', description: 'Gerenciamento de usuários' },
      { name: 'Profiles', description: 'Perfis públicos de usuários' },
      { name: 'Access Logs', description: 'Registros de acesso e auditoria' },
    ],
  },
})

await app.register(swaggerUi, { routePrefix: '/docs' })

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
