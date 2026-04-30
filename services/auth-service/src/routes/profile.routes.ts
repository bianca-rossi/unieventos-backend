import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import {
  createProfileSchema,
  updateProfileSchema,
  profileUserParamsSchema,
  profileResponseSchema,
} from '../schemas/profile.schema.js'
import {
  getProfileByUserId,
  createProfile,
  updateProfile,
  deleteProfile,
} from '../services/profile.service.js'

export async function profileRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get('/:userId', {
    schema: {
      tags: ['Profiles'],
      summary: 'Buscar perfil pelo ID do usuário',
      params: profileUserParamsSchema,
      response: { 200: profileResponseSchema },
    },
  }, async (req, reply) => {
    try {
      const profile = await getProfileByUserId(req.params.userId)
      return reply.send(profile)
    } catch {
      return reply.notFound('Profile not found')
    }
  })

  server.post('/', {
    schema: {
      tags: ['Profiles'],
      summary: 'Criar perfil para um usuário',
      body: createProfileSchema,
      response: { 201: profileResponseSchema },
    },
  }, async (req, reply) => {
    try {
      const profile = await createProfile(req.body)
      return reply.code(201).send(profile)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message === 'User not found') return reply.notFound(message)
      if (message === 'Profile already exists for this user') return reply.conflict(message)
      throw err
    }
  })

  server.put('/:userId', {
    schema: {
      tags: ['Profiles'],
      summary: 'Atualizar perfil',
      params: profileUserParamsSchema,
      body: updateProfileSchema,
      response: { 200: profileResponseSchema },
    },
  }, async (req, reply) => {
    try {
      const profile = await updateProfile(req.params.userId, req.body)
      return reply.send(profile)
    } catch {
      return reply.notFound('Profile not found')
    }
  })

  server.delete('/:userId', {
    schema: {
      tags: ['Profiles'],
      summary: 'Deletar perfil',
      params: profileUserParamsSchema,
    },
  }, async (req, reply) => {
    try {
      await deleteProfile(req.params.userId)
      return reply.code(204).send()
    } catch {
      return reply.notFound('Profile not found')
    }
  })
}
