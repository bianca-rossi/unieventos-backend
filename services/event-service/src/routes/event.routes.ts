import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import { z } from 'zod'
import {
  createEventSchema,
  updateEventSchema,
  eventParamsSchema,
  eventResponseSchema,
} from '../schemas/event.schema.js'
import {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../services/event.service.js'

export async function eventRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get('/', {
    schema: {
      tags: ['Events'],
      summary: 'Listar todos os eventos',
      response: { 200: z.array(eventResponseSchema) },
    },
  }, async (_req, reply) => {
    const events = await listEvents()
    return reply.send(events)
  })

  server.get('/:id', {
    schema: {
      tags: ['Events'],
      summary: 'Buscar evento por ID',
      params: eventParamsSchema,
      response: { 200: eventResponseSchema },
    },
  }, async (req, reply) => {
    try {
      const event = await getEventById(req.params.id)
      return reply.send(event)
    } catch {
      return reply.notFound('Event not found')
    }
  })

  server.post('/', {
    schema: {
      tags: ['Events'],
      summary: 'Criar novo evento',
      body: createEventSchema,
      response: { 201: eventResponseSchema },
    },
  }, async (req, reply) => {
    try {
      const event = await createEvent(req.body)
      return reply.code(201).send(event)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message === 'Category not found') return reply.notFound(message)
      throw err
    }
  })

  server.put('/:id', {
    schema: {
      tags: ['Events'],
      summary: 'Atualizar evento',
      params: eventParamsSchema,
      body: updateEventSchema,
      response: { 200: eventResponseSchema },
    },
  }, async (req, reply) => {
    try {
      const event = await updateEvent(req.params.id, req.body)
      return reply.send(event)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message === 'Event not found') return reply.notFound(message)
      if (message === 'Category not found') return reply.notFound(message)
      throw err
    }
  })

  server.delete('/:id', {
    schema: {
      tags: ['Events'],
      summary: 'Deletar evento',
      params: eventParamsSchema,
    },
  }, async (req, reply) => {
    try {
      await deleteEvent(req.params.id)
      return reply.code(204).send()
    } catch {
      return reply.notFound('Event not found')
    }
  })
}
