import type { InscriptionStatus } from '@prisma/client'
import prisma from '../lib/prisma.js'
import type { CreateInscriptionInput, UpdateInscriptionInput } from '../schemas/inscription.schema.js'

export async function listInscriptions(eventId?: string, participantUserId?: string) {
  return prisma.inscription.findMany({
    where: {
      ...(eventId ? { eventId } : {}),
      ...(participantUserId ? { participantUserId } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getInscriptionById(id: string) {
  const inscription = await prisma.inscription.findUnique({
    where: { id },
    include: { checkIn: true, certificate: true },
  })
  if (!inscription) throw new Error('Inscription not found')
  return inscription
}

export async function createInscription(data: CreateInscriptionInput) {
  const event = await prisma.event.findUnique({ where: { id: data.eventId } })
  if (!event) throw new Error('Event not found')
  if (event.status !== 'PUBLISHED') throw new Error('Event is not published')

  return prisma.inscription.create({ data })
}

export async function updateInscription(id: string, data: UpdateInscriptionInput) {
  const existing = await prisma.inscription.findUnique({ where: { id } })
  if (!existing) throw new Error('Inscription not found')
  return prisma.inscription.update({
    where: { id },
    data: { status: data.status as InscriptionStatus },
  })
}

export async function deleteInscription(id: string) {
  const existing = await prisma.inscription.findUnique({ where: { id } })
  if (!existing) throw new Error('Inscription not found')
  await prisma.inscription.delete({ where: { id } })
}
