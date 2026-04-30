import prisma from '../lib/prisma.js'
import type { CreateCertificateInput } from '../schemas/certificate.schema.js'

export async function listCertificates(inscriptionId?: string) {
  return prisma.certificate.findMany({
    where: inscriptionId ? { inscriptionId } : undefined,
    orderBy: { issueDate: 'desc' },
  })
}

export async function getCertificateById(id: string) {
  const cert = await prisma.certificate.findUnique({ where: { id } })
  if (!cert) throw new Error('Certificate not found')
  return cert
}

export async function createCertificate(data: CreateCertificateInput) {
  const inscription = await prisma.inscription.findUnique({
    where: { id: data.inscriptionId },
  })
  if (!inscription) throw new Error('Inscription not found')

  const existing = await prisma.certificate.findUnique({
    where: { inscriptionId: data.inscriptionId },
  })
  if (existing) throw new Error('Certificate already exists for this inscription')

  return prisma.certificate.create({ data })
}

export async function deleteCertificate(id: string) {
  const existing = await prisma.certificate.findUnique({ where: { id } })
  if (!existing) throw new Error('Certificate not found')
  await prisma.certificate.delete({ where: { id } })
}
