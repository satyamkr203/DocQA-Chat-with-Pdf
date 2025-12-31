import { prisma } from "../../db/prisma";

export const createUser = (data: any) =>
  prisma.user.create({ data });

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });
