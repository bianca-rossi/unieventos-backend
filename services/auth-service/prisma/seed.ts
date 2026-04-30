import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// UUIDs fixos (v4 válidos) para que o event-service possa referenciá-los sem FK cruzada
const UUID_ADMIN     = "00000000-0000-4000-8000-000000000001";
const UUID_ORGANIZER = "00000000-0000-4000-8000-000000000002";
const UUID_STUDENT   = "00000000-0000-4000-8000-000000000003";

async function main() {
  // Limpeza idempotente — ordem inversa de dependência
  await prisma.accessLog.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // ADMIN
  await prisma.user.create({
    data: {
      id: UUID_ADMIN,
      email: "admin@unieventos.dev",
      passwordHash: "$2b$10$placeholderHashForAdminUser000000000000000000000000000",
      role: "ADMIN",
      status: "ACTIVE",
      profile: {
        create: {
          displayName: "Administrador UniEventos",
          avatarUrl: "https://ui-avatars.com/api/?name=Admin",
          bio: "Administrador da plataforma UniEventos.",
        },
      },
      logs: {
        create: {
          action: "LOGIN_SUCCESS",
          ipAddress: "127.0.0.1",
          userAgent: "seed/1.0",
        },
      },
    },
  });

  // ORGANIZER
  await prisma.user.create({
    data: {
      id: UUID_ORGANIZER,
      email: "org@unieventos.dev",
      passwordHash: "$2b$10$placeholderHashForOrganizerUser00000000000000000000000",
      role: "ORGANIZER",
      status: "ACTIVE",
      profile: {
        create: {
          displayName: "Prof. Ada Lovelace",
          avatarUrl: "https://ui-avatars.com/api/?name=Ada+Lovelace",
          bio: "Professora de Ciência da Computação e organizadora de eventos acadêmicos.",
        },
      },
      logs: {
        create: {
          action: "LOGIN_SUCCESS",
          ipAddress: "192.168.0.10",
          userAgent: "seed/1.0",
        },
      },
    },
  });

  // STUDENT
  await prisma.user.create({
    data: {
      id: UUID_STUDENT,
      email: "aluno@unieventos.dev",
      passwordHash: "$2b$10$placeholderHashForStudentUser000000000000000000000000",
      role: "STUDENT",
      status: "ACTIVE",
      profile: {
        create: {
          displayName: "Bianca Rossi",
          avatarUrl: "https://ui-avatars.com/api/?name=Bianca+Rossi",
          bio: "Estudante de Engenharia de Software — UNIFEI.",
        },
      },
      logs: {
        create: {
          action: "LOGIN_FAILURE",
          ipAddress: "10.0.0.5",
          userAgent: "seed/1.0",
          failureReason: "Senha incorreta (simulação para seed).",
        },
      },
    },
  });

  console.log("auth-service seed concluído: 3 usuários, 3 perfis, 3 logs de acesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
