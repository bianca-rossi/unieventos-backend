import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import {
  createCertificateSchema,
  certificateParamsSchema,
  certificateQuerySchema,
} from '../schemas/certificate.schema.js'
import {
  listCertificates,
  getCertificateById,
  createCertificate,
  deleteCertificate,
} from '../services/certificate.service.js'

export async function certificateRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get(
    '/',
    { schema: { querystring: certificateQuerySchema } },
    async (req, reply) => reply.send(await listCertificates(req.query.inscriptionId)),
  )

  server.get('/:id', { schema: { params: certificateParamsSchema } }, async (req, reply) => {
    try {
      return reply.send(await getCertificateById(req.params.id))
    } catch {
      return reply.notFound('Certificate not found')
    }
  })

  server.post('/', { schema: { body: createCertificateSchema } }, async (req, reply) => {
    try {
      return reply.code(201).send(await createCertificate(req.body))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message === 'Inscription not found') return reply.notFound(message)
      if (message === 'Certificate already exists for this inscription') return reply.conflict(message)
      throw err
    }
  })

  server.delete('/:id', { schema: { params: certificateParamsSchema } }, async (req, reply) => {
    try {
      await deleteCertificate(req.params.id)
      return reply.code(204).send()
    } catch {
      return reply.notFound('Certificate not found')
    }
  })
}
