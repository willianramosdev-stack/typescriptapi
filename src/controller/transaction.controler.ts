import type { FastifyInstance } from "fastify";
import { prisma } from "../client";

export const transactionController = async (fastify: FastifyInstance) => {

    fastify.post<{ Body: { user_id: number, nomeProduto: string, quantidade: number, preco: number } }>('/transaction', async (request, reply) => {
        const { user_id, nomeProduto, quantidade, preco } = request.body
        const transacao = await prisma.transactions.create(
            {
                data: request.body
            }
        )
        return transacao
    })
}