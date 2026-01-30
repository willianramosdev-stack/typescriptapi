import type { FastifyInstance } from "fastify";
import { prisma } from '../client'
import type { CreateUserDTO } from "../Interface/IUser";
import * as z from "zod";
import { request } from "node:http";



const CreateUserSchema = z.object({
    name: z.string(),
    email: z.email(),
    idade: z.number({ error: "Coloque um numero valido" }).positive()
})


export const userController = async (fastify: FastifyInstance) => {


    fastify.post<{ Body: CreateUserDTO }>('/register', async (request, reply) => {

        const novoUsuario = CreateUserSchema.parse(request.body)

        await prisma.user.create({ data: novoUsuario })
    }
    )

    fastify.put<{ Params: { id: string }, Body: { name: string, email: string } }>('/user/:id', async (request, reply) => {
        const { id } = request.params
        const { name, email } = request.body

        const emailAtualizado = await prisma.user.update({
            where: { id: Number(id) },
            data: { name, email }
        })
        return emailAtualizado
    })

    fastify.get('/users', async (request, reply) => {
        const users = await prisma.user.findMany()
        return users
    })

    fastify.get<{ Params: { name: string } }>('/user/:name', {
    }, async (request, reply) => {
        const user = await prisma.user.findFirst({
            where: { name: request.params?.name }
        })

        if (!user) return reply.code(404).send('Usuário não encontrado!')
        return user
    })
}