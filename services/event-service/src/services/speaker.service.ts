import prisma from '../lib/prisma.js'
import type { CreateSpeakerInput, UpdateSpeakerInput } from '../schemas/speaker.schema.js'

export async function listSpeakers() {
  return prisma.speaker.findMany({ orderBy: { fullName: 'asc' } })
}

export async function getSpeakerById(id: string) {
  const speaker = await prisma.speaker.findUnique({ where: { id } })
  if (!speaker) throw new Error('Speaker not found')
  return speaker
}

export async function createSpeaker(data: CreateSpeakerInput) {
  return prisma.speaker.create({ data })
}

export async function updateSpeaker(id: string, data: UpdateSpeakerInput) {
  const existing = await prisma.speaker.findUnique({ where: { id } })
  if (!existing) throw new Error('Speaker not found')
  return prisma.speaker.update({ where: { id }, data })
}

export async function deleteSpeaker(id: string) {
  const existing = await prisma.speaker.findUnique({ where: { id } })
  if (!existing) throw new Error('Speaker not found')
  await prisma.speaker.delete({ where: { id } })
}
