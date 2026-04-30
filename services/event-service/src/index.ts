import Fastify from 'fastify'
import sensible from '@fastify/sensible'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { categoryRoutes } from './routes/category.routes.js'
import { eventRoutes } from './routes/event.routes.js'
import { speakerRoutes } from './routes/speaker.routes.js'
import { activityRoutes } from './routes/activity.routes.js'
import { activitySpeakerRoutes } from './routes/activitySpeaker.routes.js'
import { inscriptionRoutes } from './routes/inscription.routes.js'
import { checkInRoutes } from './routes/checkIn.routes.js'
import { certificateRoutes } from './routes/certificate.routes.js'

const app = Fastify({ logger: true })

await app.register(sensible)

await app.register(swagger, {
  openapi: {
    info: {
      title: 'Event Service',
      description: 'API de gestão de eventos acadêmicos do UniEventos',
      version: '0.1.0',
    },
    tags: [
      { name: 'Categories', description: 'Categorias de eventos' },
      { name: 'Events', description: 'Gerenciamento de eventos' },
      { name: 'Speakers', description: 'Palestrantes' },
      { name: 'Activities', description: 'Atividades de um evento' },
      { name: 'Inscriptions', description: 'Inscrições em eventos' },
      { name: 'Check-ins', description: 'Check-in de participantes' },
      { name: 'Certificates', description: 'Certificados de participação' },
    ],
  },
})

await app.register(swaggerUi, { routePrefix: '/docs' })

await app.register(categoryRoutes, { prefix: '/categories' })
await app.register(eventRoutes, { prefix: '/events' })
await app.register(speakerRoutes, { prefix: '/speakers' })
await app.register(activityRoutes, { prefix: '/activities' })
await app.register(activitySpeakerRoutes, { prefix: '/activities' })
await app.register(inscriptionRoutes, { prefix: '/inscriptions' })
await app.register(checkInRoutes, { prefix: '/check-ins' })
await app.register(certificateRoutes, { prefix: '/certificates' })

const port = Number(process.env.PORT ?? 3002)
const host = process.env.HOST ?? '0.0.0.0'

try {
  await app.listen({ port, host })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
