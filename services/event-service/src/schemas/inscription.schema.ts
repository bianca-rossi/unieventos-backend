import { z } from 'zod'

export const inscriptionStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'WAITLISTED'])

export const createInscriptionSchema = z.object({
  eventId: z.string().uuid(),
  participantUserId: z.string().uuid(),
})

export const updateInscriptionSchema = z.object({
  status: inscriptionStatusSchema,
})

export const inscriptionParamsSchema = z.object({
  id: z.string().uuid(),
})

export const inscriptionQuerySchema = z.object({
  eventId: z.string().uuid().optional(),
  participantUserId: z.string().uuid().optional(),
})

export const inscriptionResponseSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  participantUserId: z.string().uuid(),
  createdAt: z.date(),
  status: inscriptionStatusSchema,
})

export type CreateInscriptionInput = z.infer<typeof createInscriptionSchema>
export type UpdateInscriptionInput = z.infer<typeof updateInscriptionSchema>
