import type { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { request } from "node:http";
import { authenticate } from "../utils/authenticate";

const RegisterSchema = z.object({
    name: z.string(),
    email: z.email(),
    age: z.number().positive(),
    password: z.string().min(8)
});

const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(8)
});


export const authController = async (fastify: FastifyInstance) => {
    fastify.post<{ Body: z.infer<typeof RegisterSchema> }>('/register', async (request, reply) => {
        const payload = RegisterSchema.parse(request.body);
        const hashedPassword = await bcrypt.hash(payload.password, 10)
        const user = await prisma.user.create({
            data: {
                ...payload,
                password: hashedPassword
            }
        })
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1d" })

        return reply.status(201).send({
            user: {
                ...user,
                password: undefined
            },
            token

        })

    })

    fastify.post<{ Body: z.infer<typeof LoginSchema> }>('/login', async (request, reply) => {
        const payload = LoginSchema.parse(request.body)
        const user = await prisma.user.findFirst({
            where: { email: payload.email }
        })
        if (!user) {
            return reply.status(401).send("Email ou senha inválida!")
        }
        const passVerify = await bcrypt.compare(payload.password, user.password)

        if (!passVerify) {
            return reply.status(401).send("Email ou senha inválida!")
        }

        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1d" })

        return reply.status(201).send({
            token
        })

    })

    fastify.get('/me', {preHandler: authenticate}, async (request, reply) => {
        const user = await prisma.user.findFirst({
            where: {id: request.user.userId}
        })

        return reply.status(200).send({
            ...user,
            password: undefined
        })
    })
}