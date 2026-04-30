import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockReset, type DeepMockProxy } from 'vitest-mock-extended'
import type { PrismaClient, User } from '@prisma/client'

vi.mock('../src/lib/prisma.js', async () => {
  const { mockDeep } = await import('vitest-mock-extended')
  return { default: mockDeep<PrismaClient>() }
})

import prisma from '../src/lib/prisma.js'
const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

const { createUser } = await import('../src/services/user.service.js')

beforeEach(() => mockReset(prismaMock))

const existingUser: User = {
  id: 'user-uuid-1',
  email: 'existing@test.com',
  passwordHash: 'hash',
  createdAt: new Date(),
  role: 'STUDENT',
  status: 'ACTIVE',
}

describe('UserService.create', () => {
  it('deve lançar erro ao criar usuário com email já existente', async () => {
    prismaMock.user.findUnique.mockResolvedValue(existingUser)

    await expect(
      createUser({
        email: 'existing@test.com',
        passwordHash: 'any-hash',
        role: 'STUDENT',
      }),
    ).rejects.toThrow('Email already in use')
  })

  it('deve criar usuário quando email é único', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null)
    prismaMock.user.create.mockResolvedValue({
      id: 'new-uuid',
      email: 'new@test.com',
      passwordHash: 'any-hash',
      createdAt: new Date(),
      role: 'STUDENT',
      status: 'ACTIVE',
    })

    const result = await createUser({
      email: 'new@test.com',
      passwordHash: 'any-hash',
      role: 'STUDENT',
    })

    expect(result.email).toBe('new@test.com')
  })
})
