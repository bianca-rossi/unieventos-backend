import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with hyphens'),
})

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
})

export const categoryParamsSchema = z.object({
  id: z.string().uuid(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
