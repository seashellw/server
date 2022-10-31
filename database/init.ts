import { PrismaClient } from "@prisma/client";

const getPrisma = () => {
  global.prisma = global.prisma || new PrismaClient();
  return global.prisma;
};

export const prisma: PrismaClient = getPrisma();
