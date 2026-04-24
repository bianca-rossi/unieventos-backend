import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockReset, type DeepMockProxy } from 'vitest-mock-extended'
import type { PrismaClient, Event } from '@prisma/client'

vi.mock('../src/lib/prisma.js', async () => {
  const { mockDeep } = await import('vitest-mock-extended')
  return { default: mockDeep<PrismaClient>() }
})

import prisma from '../src/lib/prisma.js'
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

const { createInscription } = await import('../src/services/inscription.service.js')

beforeEach(() => mockReset(prismaMock))

const baseEvent: Event = {
  id: 'event-uuid-1',
  organizerUserId: 'organizer-uuid',
  categoryId: 'category-uuid',
  title: 'Tech Talk',
  description: 'Descrição',
  venueOrLink: 'Sala 101',
  startsAt: new Date('2026-06-01T10:00:00Z'),
  endsAt: new Date('2026-06-01T12:00:00Z'),
  eventMaxCapacity: 100,
  status: 'PUBLISHED',
}

describe('InscriptionService.create', () => {
  it('deve lançar erro ao inscrever em evento com status diferente de PUBLISHED', async () => {
    prismaMock.event.findUnique.mockResolvedValue({
      ...baseEvent,
      status: 'DRAFT',
    })

    await expect(
      createInscription({
        eventId: 'event-uuid-1',
        participantUserId: 'user-uuid-1',
      }),
    ).rejects.toThrow('Event is not published')
  })

  it('deve lançar erro ao inscrever em evento CANCELLED', async () => {
    prismaMock.event.findUnique.mockResolvedValue({
      ...baseEvent,
      status: 'CANCELLED',
    })

    await expect(
      createInscription({
        eventId: 'event-uuid-1',
        participantUserId: 'user-uuid-1',
      }),
    ).rejects.toThrow('Event is not published')
  })

  it('deve criar inscrição quando evento está PUBLISHED', async () => {
    prismaMock.event.findUnique.mockResolvedValue(baseEvent)
    prismaMock.inscription.create.mockResolvedValue({
      id: 'inscription-uuid-1',
      eventId: 'event-uuid-1',
      participantUserId: 'user-uuid-1',
      createdAt: new Date(),
      status: 'PENDING' as const,
    })

    const result = await createInscription({
      eventId: 'event-uuid-1',
      participantUserId: 'user-uuid-1',
    })

    expect(result.status).toBe('PENDING')
  })
})
