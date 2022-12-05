import { AsyncReturnType } from "@/interface/util";
import { PrismaClient } from "@prisma/client";

const getPrisma = () => {
  const g: any = global;
  g.prisma = g.prisma || new PrismaClient();
  return g.prisma;
};

export const prisma: PrismaClient = getPrisma();

export const downloadDatabase = async () => {
  return {
    bookmark: await prisma.bookmark.findMany(),
    cache: await prisma.cache.findMany(),
    token: await prisma.token.findMany(),
    user: await prisma.user.findMany(),
  };
};

export const uploadDatabase = async (
  data: AsyncReturnType<typeof downloadDatabase>
) => {
  await prisma.bookmark.createMany({
    data: data.bookmark,
  });
  await prisma.cache.createMany({
    data: data.cache,
  });
  await prisma.token.createMany({
    data: data.token,
  });
  await prisma.user.createMany({
    data: data.user,
  });
};
