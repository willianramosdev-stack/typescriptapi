import type { FastifyInstance } from "fastify";
import { prisma } from '../client'
import type { CreateUserDTO } from "../Interface/IUser";
import * as z from "zod"; 



const CreateUserSchema = z.object({
    name: z.string(),
    email: z.email(),
    idade: z.number({error:"Coloque um numero valido"}).positive()
})


export const userController = async (fastify: FastifyInstance) => {


    fastify.post<{ Body: CreateUserDTO }>('/register', async (request, reply) => {
        
        const novoUsuario = CreateUserSchema.parse(request.body)

        await prisma.user.create({ data: novoUsuario })
    }
    )

    fastify.get<{ Params: { name: string } }>('/user/:name', {
    }, async (request, reply) => {
        const user = await prisma.user.findFirst({
            where: { name: request.params?.name }
        })

        if (!user) return reply.code(404).send('Usuário não encontrado!')
        return user
    })
}