import type { FastifyInstance } from "fastify";
import { prisma } from '../client'
import type { CreateUserDTO } from "../Interface/IUser";
import * as z from "zod";
import { request } from "node:http";



const CreateUserSchema = z.object({
    name: z.string(),
    email: z.email(),
    idade: z.number({ error: "Coloque um numero valido" }).positive(),
    senha: z.string()
})


export const userController = async (fastify: FastifyInstance) => {

    //Endpoint para criar usuario
    fastify.post<{ Body: CreateUserDTO }>('/register', async (request, reply) => {

        const novoUsuario = CreateUserSchema.parse(request.body)

        await prisma.user.create({ data: novoUsuario })
    })
    //Endpoint para deletar usuario
    fastify.delete<{ Params: { id: string } }>('/user/:id', {
    }, async (request, reply) => {
        const user = await prisma.user.delete({
            where: { id: Number(request.params.id) }
        })
        return "Usuario " + user.name + " deletado com sucesso!"
    })

    //Endpoint para login
    fastify.post<{ Body: { email: string, senha: string } }>('/users/login', async (request, reply) => {

        const { email, senha } = request.body

        const usuario = await prisma.user.findFirst({
            where: { email, senha }
        })
        if (usuario) {
            return usuario
        }
        return reply.statusCode = 404;
    })
    //Endpoint para atualizar usuario
    fastify.put<{ Params: { id: string }, Body: { name: string, email: string } }>('/user/:id', async (request, reply) => {
        const { id } = request.params
        const { name, email } = request.body

        const emailAtualizado = await prisma.user.update({
            where: { id: Number(id) },
            data: { name, email }
        })
        return emailAtualizado
    })

    //Endpoint para listar usuarios
    fastify.get('/users', async (request, reply) => {
        const users = await prisma.user.findMany()
        return users
    })


    //Endpoint para buscar usuario usando o nome
    fastify.get<{ Params: { name: string } }>('/user/:name', {
    }, async (request, reply) => {
        const user = await prisma.user.findFirst({
            where: { name: request.params?.name }
        })

        return user
    })

}