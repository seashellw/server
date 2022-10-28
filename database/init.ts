import { PrismaClient } from "@prisma/client";

global.prisma = global.prisma || new PrismaClient();
export const prisma = global.prisma;
