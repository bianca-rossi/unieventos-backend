# UniEventos — Backend

Backend do **UniEventos**: plataforma para gestão e divulgação de eventos acadêmicos. O código está organizado em **microsserviços** no mesmo repositório (**monorepo**), com **banco de dados isolado por serviço** (PostgreSQL).

| Microsserviço   | Responsabilidade                          | Schema Prisma                          |
|-----------------|-------------------------------------------|----------------------------------------|
| **auth-service** | Utilizadores, perfis, registo de acessos | `services/auth-service/prisma/`        |
| **event-service** | Eventos, categorias, atividades, inscrições, check-in, certificados | `services/event-service/prisma/` |

## Pré-requisitos

- **Node.js** 20 ou superior  
- **Docker** e **Docker Compose** (para subir os dois PostgreSQL de desenvolvimento)

## Bases de dados (Docker Compose)

Na raiz do repositório (`backend/`), os dois contentores Postgres usam **volumes** e **healthchecks** separados:

| Serviço no Compose | Base de dados      | Porta no *host* | Utilizador / senha (apenas dev) |
|--------------------|--------------------|-----------------|----------------------------------|
| `auth-db`          | `auth_service_db`  | **5431**        | `admin` / `password`             |
| `event-db`         | `event_service_db` | **5433**        | `admin` / `password`             |

```bash
docker compose up -d
```

Para parar e remover os contentores (os dados persistem nos volumes nomeados):

```bash
docker compose down
```

> **Nota:** As credenciais acima são para **ambiente local de desenvolvimento**. Em produção use segredos fortes, rede privada e **não** exponha o Postgres publicamente.

## Configuração (`.env`)

Cada microsserviço lê `DATABASE_URL` a partir de um ficheiro **`.env`** na sua pasta (não versionado).

1. Copie o exemplo e ajuste se necessário:

   ```bash
   cp services/auth-service/.env.example services/auth-service/.env
   cp services/event-service/.env.example services/event-service/.env
   ```

2. Com o Docker Compose a correr, as URLs devem apontar para as portas do *host* **5431** (auth) e **5433** (event), como nos ficheiros `.env.example`.

## Como desenvolver (por microsserviço)

Não existe `package.json` na raiz: instale dependências **dentro** de cada serviço.

### Auth Service

```bash
cd services/auth-service
npm install
npm run prisma:generate
npm run prisma:migrate   # aplica migrações em desenvolvimento
npm run typecheck
npm run build
```

### Event Service

```bash
cd services/event-service
npm install
npm run prisma:generate
npm run prisma:migrate
npm run typecheck
npm run build
```

### Scripts úteis (npm)

| Script            | Descrição                          |
|-------------------|------------------------------------|
| `typecheck`       | Verifica tipos TypeScript (`tsc --noEmit`) |
| `build`           | Compila para `dist/`               |
| `prisma:generate` | Gera o Prisma Client               |
| `prisma:migrate`  | Migrações em desenvolvimento       |
| `prisma:deploy`   | Migrações em CI/produção           |
| `prisma:studio`   | Interface visual para a base       |

## Estrutura de pastas

```text
backend/
├── docker-compose.yml          # Dois Postgres (auth-db + event-db)
├── README.md
├── services/
│   ├── auth-service/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   └── entity.ts       # Domínio em TypeScript (alinhado à UML)
│   │   ├── .env.example
│   │   └── package.json
│   └── event-service/
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       ├── src/
│       │   └── entity.ts
│       ├── .env.example
│       └── package.json
└── diagrams/                   # UML (draw.io)
    ├── auth-service-uml.drawio
    └── event-service-uml.drawio
```

## O que há no projeto

- **Domínio em TypeScript** — `entity.ts` em cada serviço, alinhado aos diagramas em `diagrams/`, sem misturar Auth com Event no mesmo ficheiro.
- **Persistência com Prisma** — modelos e migrações por microsserviço; referências entre serviços apenas por **UUID** (ex.: `organizerUserId`, `participantUserId` no event-service), sem FK cruzada entre bases.
- **Tipagem forte** — enums para papéis e estados (`Role`, `AccountStatus`, `EventStatus`, `InscriptionStatus`, etc.).

## Git e segredos

- O ficheiro **`.env`** está no `.gitignore`; **não** faça commit de senhas ou URLs de produção.
- O `docker-compose.yml` e os `.env.example` podem ser versionados como referência de **desenvolvimento local**; trate credenciais de produção em variáveis seguras no provedor onde for fazer deploy.
