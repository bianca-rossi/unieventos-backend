import type { FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from '@fastify/type-provider-zod'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'
import { loginBodySchema, loginResponseSchema } from '../schemas/auth.schema.js'

export async function authRoutes(app: FastifyInstance) {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const server = app.withTypeProvider<ZodTypeProvider>()

  server.post('/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Autenticar usuário e obter JWT',
      body: loginBodySchema,
      response: { 200: loginResponseSchema },
    },
  }, async (req, reply) => {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return reply.unauthorized('Credenciais inválidas')
    if (user.status !== 'ACTIVE') return reply.forbidden('Conta suspensa ou banida')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return reply.unauthorized('Credenciais inválidas')

    const token = app.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: '7d' },
    )

    return reply.send({ token, user: { id: user.id, email: user.email, role: user.role } })
  })
}
