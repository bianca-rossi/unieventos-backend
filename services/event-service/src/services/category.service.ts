import prisma from '../lib/prisma.js'
import type { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema.js'

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) throw new Error('Category not found')
  return category
}

export async function createCategory(data: CreateCategoryInput) {
  const existing = await prisma.category.findUnique({ where: { slug: data.slug } })
  if (existing) throw new Error('Slug already in use')
  return prisma.category.create({ data })
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) throw new Error('Category not found')

  if (data.slug && data.slug !== existing.slug) {
    const slugTaken = await prisma.category.findUnique({ where: { slug: data.slug } })
    if (slugTaken) throw new Error('Slug already in use')
  }

  return prisma.category.update({ where: { id }, data })
}

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) throw new Error('Category not found')
  await prisma.category.delete({ where: { id } })
}
