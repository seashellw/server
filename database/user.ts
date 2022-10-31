import { UserItem } from "@/interface/lib/user";
import { Page, setTotal } from "@/interface/page";
import { prisma } from "./init";

class UserDB {
  async update(user: UserItem) {
    return await prisma.user.upsert({
      where: {
        id: user.id,
      },
      update: {
        ...user,
        authority: undefined,
      },
      create: {
        ...user,
      },
    });
  }

  /**
   * 查询
   */
  async selectById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (e) {
      return null;
    }
  }

  /**
   * 查询所有用户
   */
  async selectAll(page: Page) {
    setTotal(page, await prisma.user.count());
    return await prisma.user.findMany({
      skip: (page.current - 1) * page.pageSize,
      take: page.pageSize,
    });
  }
}

export const userDB = new UserDB();
