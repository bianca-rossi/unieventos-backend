import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import {
  createAccessLogSchema,
  accessLogParamsSchema,
  accessLogQuerySchema,
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

  server.get(
    '/',
    { schema: { querystring: accessLogQuerySchema } },
    async (req, reply) => {
      const logs = await listAccessLogs(req.query.userId)
      return reply.send(logs)
    },
  )

  server.get(
    '/:id',
    { schema: { params: accessLogParamsSchema } },
    async (req, reply) => {
      try {
        const log = await getAccessLogById(req.params.id)
        return reply.send(log)
      } catch {
        return reply.notFound('Access log not found')
      }
    },
  )

  server.post(
    '/',
    { schema: { body: createAccessLogSchema } },
    async (req, reply) => {
      try {
        const log = await createAccessLog(req.body)
        return reply.code(201).send(log)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (message === 'User not found') return reply.notFound(message)
        throw err
      }
    },
  )

  server.delete(
    '/:id',
    { schema: { params: accessLogParamsSchema } },
    async (req, reply) => {
      try {
        await deleteAccessLog(req.params.id)
        return reply.code(204).send()
      } catch {
        return reply.notFound('Access log not found')
      }
    },
  )
}
