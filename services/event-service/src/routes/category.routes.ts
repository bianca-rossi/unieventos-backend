import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} from '../schemas/category.schema.js'
import {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/category.service.js'

export async function categoryRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.get('/', async (_req, reply) => reply.send(await listCategories()))

  server.get('/:id', { schema: { params: categoryParamsSchema } }, async (req, reply) => {
    try {
      return reply.send(await getCategoryById(req.params.id))
    } catch {
      return reply.notFound('Category not found')
    }
  })

  server.post('/', { schema: { body: createCategorySchema } }, async (req, reply) => {
    try {
      return reply.code(201).send(await createCategory(req.body))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      if (message === 'Slug already in use') return reply.conflict(message)
      throw err
    }
  })

  server.put(
    '/:id',
    { schema: { params: categoryParamsSchema, body: updateCategorySchema } },
    async (req, reply) => {
      try {
        return reply.send(await updateCategory(req.params.id, req.body))
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (message === 'Category not found') return reply.notFound(message)
        if (message === 'Slug already in use') return reply.conflict(message)
        throw err
      }
    },
  )

  server.delete('/:id', { schema: { params: categoryParamsSchema } }, async (req, reply) => {
    try {
      await deleteCategory(req.params.id)
      return reply.code(204).send()
    } catch {
      return reply.notFound('Category not found')
    }
  })
}
