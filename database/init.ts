import { PrismaClient } from "@prisma/client";

const getPrisma = () => {
  const g: any = global;
  g.prisma = g.prisma || new PrismaClient();
  return g.prisma;
};

export const prisma: PrismaClient = getPrisma();
