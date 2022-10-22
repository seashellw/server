import { UserItem } from "@/interface/lib/user";
import { prisma } from "./init";

interface TokenItem {
  id: string;
  user: UserItem;
  updateTime: Date;
  expiryTime: Date;
}

class TokenDB {
  constructor() {
    setInterval(() => {
      this.clear().then(() => {
        console.log("clear token");
      });
    }, 1000 * 60 * 60 * 24);
  }

  /**
   * 清理过期的字段
   */
  async clear() {
    return await prisma.token.deleteMany({
      where: {
        expiryTime: {
          lt: new Date(),
        },
      },
    });
  }

  async update(token: TokenItem) {
    return await prisma.token.upsert({
      where: {
        id: token.id,
      },
      update: {
        ...token,
        user: {
          connect: {
            id: token.user.id,
          },
        },
      },
      create: {
        ...token,
        user: {
          connect: {
            id: token.user.id,
          },
        },
      },
      include: {
        user: true,
      },
    });
  }

  /**
   * 查询
   */
  async selectById(id: string) {
    try {
      let res = await prisma.token.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });
      return res;
    } catch (e) {
      return null;
    }
  }

  async selectByUser(userId: string) {
    try {
      let res = await prisma.token.findMany({
        where: {
          userId,
        },
        include: {
          user: true,
        },
      });
      return res;
    } catch (e) {
      return [];
    }
  }

  async delete(id: string) {
    try {
      return await prisma.token.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      return null;
    }
  }
}

export const tokenDB = new TokenDB();
