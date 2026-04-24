import prisma from '../lib/prisma.js'
import type { CreateAccessLogInput } from '../schemas/accessLog.schema.js'

export async function listAccessLogs(userId?: string) {
  return prisma.accessLog.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { occurredAt: 'desc' },
  })
}

export async function getAccessLogById(id: string) {
  const log = await prisma.accessLog.findUnique({ where: { id } })
  if (!log) throw new Error('Access log not found')
  return log
}

export async function createAccessLog(data: CreateAccessLogInput) {
  const userExists = await prisma.user.findUnique({ where: { id: data.userId } })
  if (!userExists) throw new Error('User not found')

  return prisma.accessLog.create({ data })
}

export async function deleteAccessLog(id: string) {
  const existing = await prisma.accessLog.findUnique({ where: { id } })
  if (!existing) throw new Error('Access log not found')
  await prisma.accessLog.delete({ where: { id } })
}
