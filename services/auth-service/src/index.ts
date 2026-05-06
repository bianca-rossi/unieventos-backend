import Fastify from 'fastify'
import sensible from '@fastify/sensible'
import jwt from '@fastify/jwt'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { jsonSchemaTransform } from '@fastify/type-provider-zod'
import { userRoutes } from './routes/user.routes.js'
import { profileRoutes } from './routes/profile.routes.js'
import { accessLogRoutes } from './routes/accessLog.routes.js'
import { authRoutes } from './routes/auth.routes.js'

const app = Fastify({ logger: true })

await app.register(sensible)
await app.register(jwt, { secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-prod' })

await app.register(swagger, {
  transform: jsonSchemaTransform,
  openapi: {
    info: {
      title: 'Auth Service',
      description: 'API de autenticação e gestão de usuários do UniEventos',
      version: '0.1.0',
    },
    tags: [
      { name: 'Auth', description: 'Autenticação e emissão de token' },
      { name: 'Users', description: 'Gerenciamento de usuários' },
      { name: 'Profiles', description: 'Perfis públicos de usuários' },
      { name: 'Access Logs', description: 'Registros de acesso e auditoria' },
    ],
  },
})

await app.register(swaggerUi, { routePrefix: '/docs' })

await app.register(authRoutes, { prefix: '/auth' })
await app.register(userRoutes, { prefix: '/users' })
await app.register(profileRoutes, { prefix: '/profiles' })
await app.register(accessLogRoutes, { prefix: '/access-logs' })

app.addHook('onRequest', async (request, reply) => {
  if (request.url.startsWith('/docs')) return

  const path = request.url.split('?')[0]
  const isPublic =
    (request.method === 'POST' && path === '/auth/login') ||
    (request.method === 'POST' && path === '/users')
  if (isPublic) return

  try {
    await request.jwtVerify()
  } catch {
    return reply.unauthorized('Token inválido ou ausente')
  }
})

const port = Number(process.env.PORT ?? 3001)
const host = process.env.HOST ?? '0.0.0.0'

try {
  await app.listen({ port, host })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
