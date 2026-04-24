import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import { z } from 'zod'
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
} from '../schemas/user.schema.js'
import {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../services/user.service.js'

export async function userRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get('/', async (_req, reply) => {
    const users = await listUsers()
    return reply.send(users)
  })

  server.get(
    '/:id',
    { schema: { params: userParamsSchema } },
    async (req, reply) => {
      try {
        const user = await getUserById(req.params.id)
        return reply.send(user)
      } catch {
        return reply.notFound('User not found')
      }
    },
  )

  server.post(
    '/',
    { schema: { body: createUserSchema } },
    async (req, reply) => {
      try {
        const user = await createUser(req.body)
        return reply.code(201).send(user)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (message === 'Email already in use') return reply.conflict(message)
        throw err
      }
    },
  )

  server.put(
    '/:id',
    { schema: { params: userParamsSchema, body: updateUserSchema } },
    async (req, reply) => {
      try {
        const user = await updateUser(req.params.id, req.body)
        return reply.send(user)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (message === 'User not found') return reply.notFound(message)
        if (message === 'Email already in use') return reply.conflict(message)
        throw err
      }
    },
  )

  server.delete(
    '/:id',
    { schema: { params: userParamsSchema } },
    async (req, reply) => {
      try {
        await deleteUser(req.params.id)
        return reply.code(204).send()
      } catch {
        return reply.notFound('User not found')
      }
    },
  )
}

export const userRoutesSchema = {
  listUsersResponse: z.array(
    z.object({
      id: z.string(),
      email: z.string(),
      role: z.enum(['STUDENT', 'ORGANIZER', 'ADMIN']),
      status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED']),
      createdAt: z.date(),
    }),
  ),
}
