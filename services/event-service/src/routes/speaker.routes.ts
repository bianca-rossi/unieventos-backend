import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import { z } from 'zod'
import {
  createSpeakerSchema,
  updateSpeakerSchema,
  speakerParamsSchema,
  speakerResponseSchema,
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

  server.get('/', {
    schema: {
      tags: ['Speakers'],
      summary: 'Listar todos os palestrantes',
      response: { 200: z.array(speakerResponseSchema) },
    },
  }, async (_req, reply) => reply.send(await listSpeakers()))

  server.get('/:id', {
    schema: {
      tags: ['Speakers'],
      summary: 'Buscar palestrante por ID',
      params: speakerParamsSchema,
      response: { 200: speakerResponseSchema },
    },
  }, async (req, reply) => {
    try {
      return reply.send(await getSpeakerById(req.params.id))
    } catch {
      return reply.notFound('Speaker not found')
    }
  })

  server.post('/', {
    schema: {
      tags: ['Speakers'],
      summary: 'Criar novo palestrante',
      body: createSpeakerSchema,
      response: { 201: speakerResponseSchema },
    },
  }, async (req, reply) => {
    return reply.code(201).send(await createSpeaker(req.body))
  })

  server.put('/:id', {
    schema: {
      tags: ['Speakers'],
      summary: 'Atualizar palestrante',
      params: speakerParamsSchema,
      body: updateSpeakerSchema,
      response: { 200: speakerResponseSchema },
    },
  }, async (req, reply) => {
    try {
      return reply.send(await updateSpeaker(req.params.id, req.body))
    } catch {
      return reply.notFound('Speaker not found')
    }
  })

  server.delete('/:id', {
    schema: {
      tags: ['Speakers'],
      summary: 'Deletar palestrante',
      params: speakerParamsSchema,
    },
  }, async (req, reply) => {
    try {
      await deleteSpeaker(req.params.id)
      return reply.code(204).send()
    } catch {
      return reply.notFound('Speaker not found')
    }
  })
}
