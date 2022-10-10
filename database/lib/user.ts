import { UserItem } from "interface/lib/user";
import { Page } from "interface/util";
import { prisma } from "../init";

class UserList {
  async update(user: UserItem) {
    try {
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
    } catch (e) {
      console.error(e);
      return null;
    }
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
    try {
      page.setTotal(await prisma.user.count());
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
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

export default new UserList();
