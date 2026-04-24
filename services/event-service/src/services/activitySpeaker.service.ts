import prisma from '../lib/prisma.js'

export async function listSpeakersForActivity(activityId: string) {
  const activity = await prisma.activity.findUnique({ where: { id: activityId } })
  if (!activity) throw new Error('Activity not found')

  return prisma.activitySpeaker.findMany({
    where: { activityId },
    include: { speaker: true },
  })
}

export async function addSpeakerToActivity(activityId: string, speakerId: string) {
  const activity = await prisma.activity.findUnique({ where: { id: activityId } })
  if (!activity) throw new Error('Activity not found')

  const speaker = await prisma.speaker.findUnique({ where: { id: speakerId } })
  if (!speaker) throw new Error('Speaker not found')

  const existing = await prisma.activitySpeaker.findUnique({
    where: { activityId_speakerId: { activityId, speakerId } },
  })
  if (existing) throw new Error('Speaker already assigned to this activity')

  return prisma.activitySpeaker.create({
    data: { activityId, speakerId },
    include: { speaker: true },
  })
}

export async function removeSpeakerFromActivity(activityId: string, speakerId: string) {
  const existing = await prisma.activitySpeaker.findUnique({
    where: { activityId_speakerId: { activityId, speakerId } },
  })
  if (!existing) throw new Error('ActivitySpeaker not found')
  await prisma.activitySpeaker.delete({
    where: { activityId_speakerId: { activityId, speakerId } },
  })
}
