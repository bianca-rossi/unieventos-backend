import { z } from 'zod'

export const eventStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'])

export const createEventSchema = z.object({
  organizerUserId: z.string().uuid(),
  categoryId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  venueOrLink: z.string().min(1),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  eventMaxCapacity: z.number().int().positive(),
  status: eventStatusSchema.default('DRAFT'),
})

export const updateEventSchema = z.object({
  organizerUserId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  venueOrLink: z.string().min(1).optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  eventMaxCapacity: z.number().int().positive().optional(),
  status: eventStatusSchema.optional(),
})

export const eventParamsSchema = z.object({
  id: z.string().uuid(),
})

export const eventResponseSchema = z.object({
  id: z.string().uuid(),
  organizerUserId: z.string().uuid(),
  categoryId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  venueOrLink: z.string(),
  startsAt: z.date(),
  endsAt: z.date(),
  eventMaxCapacity: z.number().int(),
  createdAt: z.date(),
  status: eventStatusSchema,
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
