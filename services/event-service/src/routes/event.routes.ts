import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import {
  createEventSchema,
  updateEventSchema,
  eventParamsSchema,
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

  server.get('/', async (_req, reply) => {
    const events = await listEvents()
    return reply.send(events)
  })

  server.get(
    '/:id',
    { schema: { params: eventParamsSchema } },
    async (req, reply) => {
      try {
        const event = await getEventById(req.params.id)
        return reply.send(event)
      } catch {
        return reply.notFound('Event not found')
      }
    },
  )

  server.post(
    '/',
    { schema: { body: createEventSchema } },
    async (req, reply) => {
      try {
        const event = await createEvent(req.body)
        return reply.code(201).send(event)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (message === 'Category not found') return reply.notFound(message)
        throw err
      }
    },
  )

  server.put(
    '/:id',
    { schema: { params: eventParamsSchema, body: updateEventSchema } },
    async (req, reply) => {
      try {
        const event = await updateEvent(req.params.id, req.body)
        return reply.send(event)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (message === 'Event not found') return reply.notFound(message)
        if (message === 'Category not found') return reply.notFound(message)
        throw err
      }
    },
  )

  server.delete(
    '/:id',
    { schema: { params: eventParamsSchema } },
    async (req, reply) => {
      try {
        await deleteEvent(req.params.id)
        return reply.code(204).send()
      } catch {
        return reply.notFound('Event not found')
      }
    },
  )
}
