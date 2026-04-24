import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import {
  createSpeakerSchema,
  updateSpeakerSchema,
  speakerParamsSchema,
} from '../schemas/speaker.schema.js'
import {
  listSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
} from '../services/speaker.service.js'

export async function speakerRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get('/', async (_req, reply) => reply.send(await listSpeakers()))

  server.get('/:id', { schema: { params: speakerParamsSchema } }, async (req, reply) => {
    try {
      return reply.send(await getSpeakerById(req.params.id))
    } catch {
      return reply.notFound('Speaker not found')
    }
  })

  server.post('/', { schema: { body: createSpeakerSchema } }, async (req, reply) => {
    return reply.code(201).send(await createSpeaker(req.body))
  })

  server.put(
    '/:id',
    { schema: { params: speakerParamsSchema, body: updateSpeakerSchema } },
    async (req, reply) => {
      try {
        return reply.send(await updateSpeaker(req.params.id, req.body))
      } catch {
        return reply.notFound('Speaker not found')
      }
    },
  )

  server.delete('/:id', { schema: { params: speakerParamsSchema } }, async (req, reply) => {
    try {
      await deleteSpeaker(req.params.id)
      return reply.code(204).send()
    } catch {
      return reply.notFound('Speaker not found')
    }
  })
}
