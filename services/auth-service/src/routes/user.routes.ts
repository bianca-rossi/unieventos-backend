import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import { z } from 'zod'
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
  userResponseSchema,
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

  server.get('/', {
    schema: {
      tags: ['Users'],
      summary: 'Listar todos os usuários',
      response: { 200: z.array(userResponseSchema) },
    },
  }, async (_req, reply) => {
    const users = await listUsers()
    return reply.send(users)
  })

  server.get('/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Buscar usuário por ID',
      params: userParamsSchema,
      response: { 200: userResponseSchema },
    },
  }, async (req, reply) => {
    try {
      const user = await getUserById(req.params.id)
      return reply.send(user)
    } catch {
      return reply.notFound('User not found')
    }
  })

  server.post('/', {
    schema: {
      tags: ['Users'],
      summary: 'Criar novo usuário',
      body: createUserSchema,
      response: { 201: userResponseSchema },
    },
  }, async (req, reply) => {
    try {
      const user = await createUser(req.body)
      return reply.code(201).send(user)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message === 'Email already in use') return reply.conflict(message)
      throw err
    }
  })

  server.put('/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Atualizar usuário',
      params: userParamsSchema,
      body: updateUserSchema,
      response: { 200: userResponseSchema },
    },
  }, async (req, reply) => {
    try {
      const user = await updateUser(req.params.id, req.body)
      return reply.send(user)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message === 'User not found') return reply.notFound(message)
      if (message === 'Email already in use') return reply.conflict(message)
      throw err
    }
  })

  server.delete('/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Deletar usuário',
      params: userParamsSchema,
    },
  }, async (req, reply) => {
    try {
      await deleteUser(req.params.id)
      return reply.code(204).send()
    } catch {
      return reply.notFound('User not found')
    }
  })
}
