import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import { z } from 'zod'
import {
  createCheckInSchema,
  checkInParamsSchema,
  checkInQuerySchema,
  checkInResponseSchema,
} from '../schemas/checkIn.schema.js'
import {
  listCheckIns,
  getCheckInById,
  createCheckIn,
  deleteCheckIn,
} from '../services/checkIn.service.js'

export async function checkInRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get('/', {
    schema: {
      tags: ['Check-ins'],
      summary: 'Listar check-ins',
      querystring: checkInQuerySchema,
      response: { 200: z.array(checkInResponseSchema) },
    },
  }, async (req, reply) => reply.send(await listCheckIns(req.query.inscriptionId)))

  server.get('/:id', {
    schema: {
      tags: ['Check-ins'],
      summary: 'Buscar check-in por ID',
      params: checkInParamsSchema,
      response: { 200: checkInResponseSchema },
    },
  }, async (req, reply) => {
    try {
      return reply.send(await getCheckInById(req.params.id))
    } catch {
      return reply.notFound('CheckIn not found')
    }
  })

  server.post('/', {
    schema: {
      tags: ['Check-ins'],
      summary: 'Registrar check-in',
      body: createCheckInSchema,
      response: { 201: checkInResponseSchema },
    },
  }, async (req, reply) => {
    try {
      return reply.code(201).send(await createCheckIn(req.body))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message === 'Inscription not found') return reply.notFound(message)
      if (message === 'CheckIn already exists for this inscription') return reply.conflict(message)
      throw err
    }
  })

  server.delete('/:id', {
    schema: {
      tags: ['Check-ins'],
      summary: 'Deletar check-in',
      params: checkInParamsSchema,
    },
  }, async (req, reply) => {
    try {
      await deleteCheckIn(req.params.id)
      return reply.code(204).send()
    } catch {
      return reply.notFound('CheckIn not found')
    }
  })
}
