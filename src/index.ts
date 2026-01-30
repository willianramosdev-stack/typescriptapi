import Fastify from 'fastify'
import { userController } from './controller/user.controller'

const fastify = Fastify({ logger: false })

await fastify.register(userController)

await fastify.listen({ port: 3000, host: '0.0.0.0' })

