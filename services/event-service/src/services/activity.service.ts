import prisma from '../lib/prisma.js'
import type { CreateActivityInput, UpdateActivityInput } from '../schemas/activity.schema.js'

export async function listActivities(eventId?: string) {
  return prisma.activity.findMany({
    where: eventId ? { eventId } : undefined,
    include: { activitySpeakers: { include: { speaker: true } } },
    orderBy: { startsAt: 'asc' },
  })
}

export async function getActivityById(id: string) {
  const activity = await prisma.activity.findUnique({
    where: { id },
    include: { activitySpeakers: { include: { speaker: true } } },
  })
  if (!activity) throw new Error('Activity not found')
  return activity
}

export async function createActivity(data: CreateActivityInput) {
  const event = await prisma.event.findUnique({ where: { id: data.eventId } })
  if (!event) throw new Error('Event not found')
  return prisma.activity.create({
    data,
    include: { activitySpeakers: { include: { speaker: true } } },
  })
}

export async function updateActivity(id: string, data: UpdateActivityInput) {
  const existing = await prisma.activity.findUnique({ where: { id } })
  if (!existing) throw new Error('Activity not found')
  return prisma.activity.update({
    where: { id },
    data,
    include: { activitySpeakers: { include: { speaker: true } } },
  })
}

export async function deleteActivity(id: string) {
  const existing = await prisma.activity.findUnique({ where: { id } })
  if (!existing) throw new Error('Activity not found')
  await prisma.activity.delete({ where: { id } })
}
