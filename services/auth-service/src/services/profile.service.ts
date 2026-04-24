import prisma from '../lib/prisma.js'
import type { CreateProfileInput, UpdateProfileInput } from '../schemas/profile.schema.js'

export async function getProfileByUserId(userId: string) {
  const profile = await prisma.profile.findUnique({ where: { userId } })
  if (!profile) throw new Error('Profile not found')
  return profile
}

export async function createProfile(data: CreateProfileInput) {
  const userExists = await prisma.user.findUnique({ where: { id: data.userId } })
  if (!userExists) throw new Error('User not found')

  const existing = await prisma.profile.findUnique({ where: { userId: data.userId } })
  if (existing) throw new Error('Profile already exists for this user')

  return prisma.profile.create({ data })
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const existing = await prisma.profile.findUnique({ where: { userId } })
  if (!existing) throw new Error('Profile not found')

  return prisma.profile.update({ where: { userId }, data })
}

export async function deleteProfile(userId: string) {
  const existing = await prisma.profile.findUnique({ where: { userId } })
  if (!existing) throw new Error('Profile not found')
  await prisma.profile.delete({ where: { userId } })
}
