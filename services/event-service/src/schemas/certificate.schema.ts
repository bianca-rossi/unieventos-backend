import { z } from 'zod'

export const createCertificateSchema = z.object({
  inscriptionId: z.string().uuid(),
  issueDate: z.coerce.date(),
  verificationCode: z.string().min(1),
  performanceScore: z.number().optional(),
})

export const certificateParamsSchema = z.object({
  id: z.string().uuid(),
})

export const certificateQuerySchema = z.object({
  inscriptionId: z.string().uuid().optional(),
})

export type CreateCertificateInput = z.infer<typeof createCertificateSchema>
