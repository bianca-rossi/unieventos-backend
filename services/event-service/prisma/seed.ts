import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// UUIDs fixos (v4 válidos) que espelham os usuários criados no auth-service (sem FK cruzada)
const UUID_ORGANIZER = "00000000-0000-4000-8000-000000000002";
const UUID_STUDENT   = "00000000-0000-4000-8000-000000000003";

async function main() {
  // Limpeza idempotente — ordem inversa de dependência
  // Certificate e CheckIn dependem de Inscription → deletar primeiro
  await prisma.certificate.deleteMany();
  await prisma.checkIn.deleteMany();
  await prisma.inscription.deleteMany();
  // ActivitySpeaker depende de Activity e Speaker → deletar antes dos pais
  await prisma.activitySpeaker.deleteMany();
  await prisma.activity.deleteMany();
  // Event depende de Category; Category não tem cascade → deletar Event antes
  await prisma.event.deleteMany();
  await prisma.category.deleteMany();
  await prisma.speaker.deleteMany();

  // Category
  const category = await prisma.category.create({
    data: {
      name: "Tecnologia",
      slug: "tecnologia",
    },
  });

  // Event
  const event = await prisma.event.create({
    data: {
      organizerUserId: UUID_ORGANIZER,
      categoryId: category.id,
      title: "Semana Acadêmica de Engenharia de Software 2026",
      description: "Evento anual com palestras, workshops e hackathon voltados para estudantes de computação.",
      venueOrLink: "Auditório Principal — UNIFEI Itajubá",
      startsAt: new Date("2026-05-12T08:00:00Z"),
      endsAt: new Date("2026-05-16T18:00:00Z"),
      eventMaxCapacity: 300,
      status: "PUBLISHED",
    },
  });

  // Speaker
  const speaker = await prisma.speaker.create({
    data: {
      fullName: "Dr. Alan Turing",
      bio: "Matemático e cientista da computação, pai da computação moderna.",
      affiliation: "Universidade de Manchester",
    },
  });

  // Activity
  const activity = await prisma.activity.create({
    data: {
      eventId: event.id,
      title: "Palestra: IA no Campus — do laboratório à aplicação real",
      description: "Apresentação sobre aplicações práticas de inteligência artificial no ambiente universitário.",
      startsAt: new Date("2026-05-13T10:00:00Z"),
      location: "Auditório Principal — Bloco A",
      duration: 90,
      roomCapacity: 150,
    },
  });

  // ActivitySpeaker (N:N — Speaker vinculado à Activity)
  await prisma.activitySpeaker.create({
    data: {
      activityId: activity.id,
      speakerId: speaker.id,
    },
  });

  // Inscription #1 — PENDING
  await prisma.inscription.create({
    data: {
      eventId: event.id,
      participantUserId: UUID_STUDENT,
      status: "PENDING",
    },
  });

  // Inscription #2 — CONFIRMED (com CheckIn e Certificate na cadeia)
  const confirmedInscription = await prisma.inscription.create({
    data: {
      eventId: event.id,
      participantUserId: UUID_STUDENT,
      status: "CONFIRMED",
    },
  });

  // CheckIn — final da cadeia, depende de Inscription CONFIRMED
  await prisma.checkIn.create({
    data: {
      inscriptionId: confirmedInscription.id,
      checkedAt: new Date("2026-05-13T09:45:00Z"),
      method: "QR_CODE",
    },
  });

  // Certificate — final da cadeia, depende de Inscription CONFIRMED
  await prisma.certificate.create({
    data: {
      inscriptionId: confirmedInscription.id,
      issueDate: new Date("2026-05-16T18:00:00Z"),
      verificationCode: "UNIEV-2026-CERT-000001",
    },
  });

  console.log(
    "event-service seed concluído: Category, Event, Speaker, Activity, ActivitySpeaker, " +
    "2x Inscription (PENDING + CONFIRMED), CheckIn, Certificate."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
