import { z } from 'zod'
import { roleSchema } from './user.schema.js'

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: roleSchema,
  }),
})

export type LoginInput = z.infer<typeof loginBodySchema>
