import { z } from 'zod'

export const createAccessLogSchema = z.object({
  userId: z.string().uuid(),
  action: z.string().min(1),
  ipAddress: z.string().min(1),
  userAgent: z.string().min(1),
  failureReason: z.string().optional(),
})

export const accessLogParamsSchema = z.object({
  id: z.string().uuid(),
})

export const accessLogQuerySchema = z.object({
  userId: z.string().uuid().optional(),
})

export type CreateAccessLogInput = z.infer<typeof createAccessLogSchema>
