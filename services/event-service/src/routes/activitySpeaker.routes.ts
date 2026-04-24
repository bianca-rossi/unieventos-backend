import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import {
  activitySpeakerParamsSchema,
  addSpeakerToActivitySchema,
  removeSpeakerFromActivityParamsSchema,
} from '../schemas/activitySpeaker.schema.js'
import {
  listSpeakersForActivity,
  addSpeakerToActivity,
  removeSpeakerFromActivity,
} from '../services/activitySpeaker.service.js'

export async function activitySpeakerRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get(
    '/:activityId/speakers',
    { schema: { params: activitySpeakerParamsSchema } },
    async (req, reply) => {
      try {
        return reply.send(await listSpeakersForActivity(req.params.activityId))
      } catch {
        return reply.notFound('Activity not found')
      }
    },
  )

  server.post(
    '/:activityId/speakers',
    { schema: { params: activitySpeakerParamsSchema, body: addSpeakerToActivitySchema } },
    async (req, reply) => {
      try {
        const result = await addSpeakerToActivity(req.params.activityId, req.body.speakerId)
        return reply.code(201).send(result)
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (message === 'Activity not found' || message === 'Speaker not found')
          return reply.notFound(message)
        if (message === 'Speaker already assigned to this activity')
          return reply.conflict(message)
        throw err
      }
    },
  )

  server.delete(
    '/:activityId/speakers/:speakerId',
    { schema: { params: removeSpeakerFromActivityParamsSchema } },
    async (req, reply) => {
      try {
        await removeSpeakerFromActivity(req.params.activityId, req.params.speakerId)
        return reply.code(204).send()
      } catch {
        return reply.notFound('ActivitySpeaker not found')
      }
    },
  )
}
