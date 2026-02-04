import Fastify from 'fastify'
import { userController } from './controller/user.controller'
import { transactionController } from './controller/transaction.controler'
import { authController } from './controller/auth.controller'

const fastify = Fastify({ logger: false })

await fastify.register(userController)
await fastify.register(transactionController)
await fastify.register(authController)

await fastify.listen({ port: 3000, host: '0.0.0.0' })

