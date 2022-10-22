import { UserItem } from "@/interface/lib/user";
import { Page, setTotal } from "@/interface/page";
import { prisma } from "./init";

class UserDB {
  async update(user: UserItem) {
    let res = await prisma.user.upsert({
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
      include: {
        authority: true,
      },
    });
    return {
      ...res,
      authority: res?.authority?.name,
    };
  }

  /**
   * 查询
   */
  async selectById(id: string) {
    try {
      let res = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          authority: true,
        },
      });
      return {
        ...res,
        authority: res?.authority?.name,
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * 查询所有用户
   */
  async selectAll(page: Page) {
    setTotal(page, await prisma.user.count());
    let res = await prisma.user.findMany({
      skip: (page.current - 1) * page.pageSize,
      take: page.pageSize,
      include: {
        authority: true,
      },
    });
    return res.map((item) => ({
      ...item,
      authority: item.authority?.name,
    }));
  }
}

export const userDB = new UserDB();
