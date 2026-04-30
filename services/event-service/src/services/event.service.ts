import prisma from '../lib/prisma.js'
import type { CreateEventInput, UpdateEventInput } from '../schemas/event.schema.js'

export async function listEvents() {
  return prisma.event.findMany({
    include: { category: true },
    orderBy: { startsAt: 'asc' },
  })
}

export async function getEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { category: true, activities: true },
  })
  if (!event) throw new Error('Event not found')
  return event
}

export async function createEvent(data: CreateEventInput) {
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } })
  if (!category) throw new Error('Category not found')

  return prisma.event.create({ data, include: { category: true } })
}

export async function updateEvent(id: string, data: UpdateEventInput) {
  const existing = await prisma.event.findUnique({ where: { id } })
  if (!existing) throw new Error('Event not found')

  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } })
    if (!category) throw new Error('Category not found')
  }

  return prisma.event.update({
    where: { id },
    data,
    include: { category: true },
  })
}

export async function deleteEvent(id: string) {
  const existing = await prisma.event.findUnique({ where: { id } })
  if (!existing) throw new Error('Event not found')
  await prisma.event.delete({ where: { id } })
}
