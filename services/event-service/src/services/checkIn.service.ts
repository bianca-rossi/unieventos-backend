import prisma from '../lib/prisma.js'
import type { CreateCheckInInput } from '../schemas/checkIn.schema.js'

export async function listCheckIns(inscriptionId?: string) {
  return prisma.checkIn.findMany({
    where: inscriptionId ? { inscriptionId } : undefined,
    orderBy: { checkedAt: 'desc' },
  })
}

export async function getCheckInById(id: string) {
  const checkIn = await prisma.checkIn.findUnique({ where: { id } })
  if (!checkIn) throw new Error('CheckIn not found')
  return checkIn
}

export async function createCheckIn(data: CreateCheckInInput) {
  const inscription = await prisma.inscription.findUnique({
    where: { id: data.inscriptionId },
  })
  if (!inscription) throw new Error('Inscription not found')

  const existing = await prisma.checkIn.findUnique({
    where: { inscriptionId: data.inscriptionId },
  })
  if (existing) throw new Error('CheckIn already exists for this inscription')

  return prisma.checkIn.create({ data })
}

export async function deleteCheckIn(id: string) {
  const existing = await prisma.checkIn.findUnique({ where: { id } })
  if (!existing) throw new Error('CheckIn not found')
  await prisma.checkIn.delete({ where: { id } })
}
