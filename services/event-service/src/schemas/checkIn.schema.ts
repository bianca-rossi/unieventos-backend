import { z } from 'zod'

export const createCheckInSchema = z.object({
  inscriptionId: z.string().uuid(),
  checkedAt: z.coerce.date(),
  method: z.string().min(1),
  notes: z.string().optional(),
})

export const checkInParamsSchema = z.object({
  id: z.string().uuid(),
})

export const checkInQuerySchema = z.object({
  inscriptionId: z.string().uuid().optional(),
})

export type CreateCheckInInput = z.infer<typeof createCheckInSchema>
