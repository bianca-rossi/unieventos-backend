import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'
import type { CreateUserInput, UpdateUserInput } from '../schemas/user.schema.js'

export async function listUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  })
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  })
  if (!user) throw new Error('User not found')
  return user
}

export async function createUser(data: CreateUserInput) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw new Error('Email already in use')

  const passwordHash = await bcrypt.hash(data.password, 10)

  return prisma.user.create({
    data: { email: data.email, passwordHash, role: data.role },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  })
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) throw new Error('User not found')

  if (data.email && data.email !== existing.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email: data.email } })
    if (emailTaken) throw new Error('Email already in use')
  }

  const { password, ...rest } = data
  const passwordHash = password ? await bcrypt.hash(password, 10) : undefined

  return prisma.user.update({
    where: { id },
    data: { ...rest, ...(passwordHash && { passwordHash }) },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  })
}

export async function deleteUser(id: string) {
  const existing = await prisma.user.findUnique({ where: { id } })
  if (!existing) throw new Error('User not found')
  await prisma.user.delete({ where: { id } })
}
