import type { User } from "../../generated/prisma/browser";

export type CreateUserDTO = Pick<User, "email" | "idade" | "name" | "senha">


