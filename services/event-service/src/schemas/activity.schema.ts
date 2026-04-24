import { z } from 'zod'

export const createActivitySchema = z.object({
  eventId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  startsAt: z.coerce.date(),
  location: z.string().min(1),
  duration: z.number().int().positive(),
  roomCapacity: z.number().int().positive(),
})

export const updateActivitySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  startsAt: z.coerce.date().optional(),
  location: z.string().min(1).optional(),
  duration: z.number().int().positive().optional(),
  roomCapacity: z.number().int().positive().optional(),
})

export const activityParamsSchema = z.object({
  id: z.string().uuid(),
})

export type CreateActivityInput = z.infer<typeof createActivitySchema>
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>
