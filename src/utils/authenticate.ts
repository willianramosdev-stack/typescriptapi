import type { FastifyReply, FastifyRequest } from "fastify"
import jwt from "jsonwebtoken";

declare module 'fastify' {
    interface FastifyRequest {
        user: { userId: string }
    }
}
export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ') || !authHeader.split(' ')[1]) {
        return reply.code(401).send({ error: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]!

    const verify = jwt.verify(token, process.env.JWT_SECRET!) as { user_id: string }

    if (!verify) {
        return reply.code(401).send({ error: 'Unauthorized' })
    }
    request.user = { userId: verify.user_id }
}