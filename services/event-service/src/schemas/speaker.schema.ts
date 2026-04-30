import { z } from 'zod'

export const createSpeakerSchema = z.object({
  fullName: z.string().min(1),
  bio: z.string().min(1),
  affiliation: z.string().min(1),
})

export const updateSpeakerSchema = z.object({
  fullName: z.string().min(1).optional(),
  bio: z.string().min(1).optional(),
  affiliation: z.string().min(1).optional(),
})

export const speakerParamsSchema = z.object({
  id: z.string().uuid(),
})

export const speakerResponseSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string(),
  bio: z.string(),
  affiliation: z.string(),
})

export type CreateSpeakerInput = z.infer<typeof createSpeakerSchema>
export type UpdateSpeakerInput = z.infer<typeof updateSpeakerSchema>
