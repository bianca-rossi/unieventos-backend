import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import { z } from 'zod'
import {
  createAccessLogSchema,
  accessLogParamsSchema,
  accessLogQuerySchema,
  accessLogResponseSchema,
} from '../schemas/accessLog.schema.js'
import {
  listAccessLogs,
  getAccessLogById,
  createAccessLog,
  deleteAccessLog,
} from '../services/accessLog.service.js'

export async function accessLogRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get('/', {
    schema: {
      tags: ['Access Logs'],
      summary: 'Listar registros de acesso',
      querystring: accessLogQuerySchema,
      response: { 200: z.array(accessLogResponseSchema) },
    },
  }, async (req, reply) => {
    const logs = await listAccessLogs(req.query.userId)
    return reply.send(logs)
  })

  server.get('/:id', {
    schema: {
      tags: ['Access Logs'],
      summary: 'Buscar registro de acesso por ID',
      params: accessLogParamsSchema,
      response: { 200: accessLogResponseSchema },
    },
  }, async (req, reply) => {
    try {
      const log = await getAccessLogById(req.params.id)
      return reply.send(log)
    } catch {
      return reply.notFound('Access log not found')
    }
  })

  server.post('/', {
    schema: {
      tags: ['Access Logs'],
      summary: 'Registrar acesso',
      body: createAccessLogSchema,
      response: { 201: accessLogResponseSchema },
    },
  }, async (req, reply) => {
    try {
      const log = await createAccessLog(req.body)
      return reply.code(201).send(log)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message === 'User not found') return reply.notFound(message)
      throw err
    }
  })

  server.delete('/:id', {
    schema: {
      tags: ['Access Logs'],
      summary: 'Deletar registro de acesso',
      params: accessLogParamsSchema,
    },
  }, async (req, reply) => {
    try {
      await deleteAccessLog(req.params.id)
      return reply.code(204).send()
    } catch {
      return reply.notFound('Access log not found')
    }
  })
}
