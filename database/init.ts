import { PrismaClient } from "@prisma/client";

global.prisma = global.prisma || new PrismaClient();
export const prisma: PrismaClient = global.prisma;
