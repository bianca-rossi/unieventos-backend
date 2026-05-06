import { z } from 'zod'

export const roleSchema = z.enum(['STUDENT', 'ORGANIZER', 'ADMIN'])
export const accountStatusSchema = z.enum(['ACTIVE', 'SUSPENDED', 'BANNED'])

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: roleSchema.default('STUDENT'),
})

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: roleSchema.optional(),
  status: accountStatusSchema.optional(),
})

export const userParamsSchema = z.object({
  id: z.string().uuid(),
})

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: roleSchema,
  status: accountStatusSchema,
  createdAt: z.date(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

