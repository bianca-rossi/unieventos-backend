import { z } from 'zod'

export const createProfileSchema = z.object({
  userId: z.string().uuid(),
  displayName: z.string().min(1),
  avatarUrl: z.string().url().optional(),
  bio: z.string().optional(),
})

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  bio: z.string().nullable().optional(),
})

export const profileUserParamsSchema = z.object({
  userId: z.string().uuid(),
})

export type CreateProfileInput = z.infer<typeof createProfileSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
