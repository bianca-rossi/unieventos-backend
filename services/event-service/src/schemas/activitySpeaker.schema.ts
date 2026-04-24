import { z } from 'zod'

export const activitySpeakerParamsSchema = z.object({
  activityId: z.string().uuid(),
})

export const addSpeakerToActivitySchema = z.object({
  speakerId: z.string().uuid(),
})

export const removeSpeakerFromActivityParamsSchema = z.object({
  activityId: z.string().uuid(),
  speakerId: z.string().uuid(),
})

export type AddSpeakerToActivityInput = z.infer<typeof addSpeakerToActivitySchema>
