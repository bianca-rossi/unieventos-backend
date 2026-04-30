import { z } from 'zod'
import { speakerResponseSchema } from './speaker.schema.js'

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

export const activitySpeakerResponseSchema = z.object({
  activityId: z.string().uuid(),
  speakerId: z.string().uuid(),
  speaker: speakerResponseSchema,
})

export type AddSpeakerToActivityInput = z.infer<typeof addSpeakerToActivitySchema>
