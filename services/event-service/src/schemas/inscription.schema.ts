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

export type CreateInscriptionInput = z.infer<typeof createInscriptionSchema>
export type UpdateInscriptionInput = z.infer<typeof updateInscriptionSchema>
