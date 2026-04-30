import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import { z } from 'zod'
import {
  createActivitySchema,
  updateActivitySchema,
  activityParamsSchema,
  activityQuerySchema,
  activityResponseSchema,
} from '../schemas/activity.schema.js'
import {
  listActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from '../services/activity.service.js'

export async function activityRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get('/', {
    schema: {
      tags: ['Activities'],
      summary: 'Listar atividades',
      querystring: activityQuerySchema,
      response: { 200: z.array(activityResponseSchema) },
    },
  }, async (req, reply) => reply.send(await listActivities(req.query.eventId)))

  server.get('/:id', {
    schema: {
      tags: ['Activities'],
      summary: 'Buscar atividade por ID',
      params: activityParamsSchema,
      response: { 200: activityResponseSchema },
    },
  }, async (req, reply) => {
    try {
      return reply.send(await getActivityById(req.params.id))
    } catch {
      return reply.notFound('Activity not found')
    }
  })

  server.post('/', {
    schema: {
      tags: ['Activities'],
      summary: 'Criar nova atividade',
      body: createActivitySchema,
      response: { 201: activityResponseSchema },
    },
  }, async (req, reply) => {
    try {
      return reply.code(201).send(await createActivity(req.body))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message === 'Event not found') return reply.notFound(message)
      throw err
    }
  })

  server.put('/:id', {
    schema: {
      tags: ['Activities'],
      summary: 'Atualizar atividade',
      params: activityParamsSchema,
      body: updateActivitySchema,
      response: { 200: activityResponseSchema },
    },
  }, async (req, reply) => {
    try {
      return reply.send(await updateActivity(req.params.id, req.body))
    } catch {
      return reply.notFound('Activity not found')
    }
  })

  server.delete('/:id', {
    schema: {
      tags: ['Activities'],
      summary: 'Deletar atividade',
      params: activityParamsSchema,
    },
  }, async (req, reply) => {
    try {
      await deleteActivity(req.params.id)
      return reply.code(204).send()
    } catch {
      return reply.notFound('Activity not found')
    }
  })
}
