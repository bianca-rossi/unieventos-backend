import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import { z } from 'zod'
import {
  createInscriptionSchema,
  updateInscriptionSchema,
  inscriptionParamsSchema,
} from '../schemas/inscription.schema.js'
import {
  listInscriptions,
  getInscriptionById,
  createInscription,
  updateInscription,
  deleteInscription,
} from '../services/inscription.service.js'

export async function inscriptionRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get(
    '/',
    {
      schema: {
        querystring: z.object({
          eventId: z.string().uuid().optional(),
          participantUserId: z.string().uuid().optional(),
        }),
      },
    },
    async (req, reply) =>
      reply.send(
        await listInscriptions(req.query.eventId, req.query.participantUserId),
      ),
  )

  server.get('/:id', { schema: { params: inscriptionParamsSchema } }, async (req, reply) => {
    try {
      return reply.send(await getInscriptionById(req.params.id))
    } catch {
      return reply.notFound('Inscription not found')
    }
  })

  server.post('/', { schema: { body: createInscriptionSchema } }, async (req, reply) => {
    try {
      return reply.code(201).send(await createInscription(req.body))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message === 'Event not found') return reply.notFound(message)
      if (message === 'Event is not published') return reply.badRequest(message)
      throw err
    }
  })

  server.put(
    '/:id',
    { schema: { params: inscriptionParamsSchema, body: updateInscriptionSchema } },
    async (req, reply) => {
      try {
        return reply.send(await updateInscription(req.params.id, req.body))
      } catch {
        return reply.notFound('Inscription not found')
      }
    },
  )

  server.delete('/:id', { schema: { params: inscriptionParamsSchema } }, async (req, reply) => {
    try {
      await deleteInscription(req.params.id)
      return reply.code(204).send()
    } catch {
      return reply.notFound('Inscription not found')
    }
  })
}
