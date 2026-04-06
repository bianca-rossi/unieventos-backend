# UniEventos — Backend

Este é o núcleo do sistema **UniEventos**. O projeto está dividido em **dois domínios principais**: **Autenticação** e **Gestão de Eventos**.

## Como rodar 🚀

**Pré-requisito:** Node.js 20+ instalado.

```bash
# 1. Instalar as dependências
npm install

# 2. Verificar tipagem (sem gerar ficheiros)
npm run typecheck

# 3. Compilar (gera a pasta dist/, espelhando services/)
npm run build
```

## Estrutura de pastas

```text
backend/
├── package.json              # Scripts e dependências (TypeScript)
├── package-lock.json
├── tsconfig.json             # strict, ESM (NodeNext), rootDir/outDir
├── README.md
├── services/
│   ├── auth-service/
│   │   └── src/
│   │       └── entity.ts     # User, Profile, AccessLog + enums Auth
│   └── event-service/
│       └── src/
│           └── entity.ts     # Event, Category, Activity, … + enums Event
├── diagrams/                 # UML (draw.io) — contrato com o domínio
│   ├── auth-service-uml.drawio
│   └── event-service-uml.drawio
└── dist/                     # Criada pelo npm run build (não versionar)
```

Cada microsserviço tem **o seu** `entity.ts`: o código de domínio segue as UML em `diagrams/`, sem misturar Auth com Event no mesmo ficheiro.

## O que tem no projeto (até agora) 🛠

O foco desta etapa foi modelar a **lógica de domínio** com TypeScript 

- **Auth Service** — `User`, `Profile`, `AccessLog`. Os métodos de senha e JWT em `User` são só **estrutura por agora** (stubs), já pensando na integração real (bcrypt, JWT) na fase seguinte.

- **Event Service** — Onde está o fluxo do negócio: `Event`, `Activity`, `Speaker`, `Category`, `Inscription`, `CheckIn`, `Certificate` (da inscrição ao certificado).

- **Tipagem forte** — Enums para papéis e estados (`Role`, `AccountStatus`, `EventStatus`, `InscriptionStatus`), para não aceitar valores inválidos onde o tipo pede um conjunto fechado.

Detalhe: `Event.getAvailability()` e `Activity.isFull()` usam contadores internos iniciais até existir persistência e repositórios.
