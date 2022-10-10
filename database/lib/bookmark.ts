import { UserItem } from "interface/lib/user";
import { prisma } from "../init";

class BookmarkList {
  /**
   * 插入书签
   */
  async create(user: UserItem, url: string, title: string) {
    try {
      return await prisma.bookmark.create({
        data: {
          url,
          title,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * 删除书签
   */
  async deleteOne(id: string) {
    try {
      return await prisma.bookmark.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * 更新书签
   */
  async updateOne(
    id: string,
    data: { title?: string; url?: string }
  ) {
    try {
      return await prisma.bookmark.update({
        where: {
          id,
        },
        data: {
          ...data,
        },
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * 查询
   */
  async selectByOwner(user: UserItem) {
    try {
      return await prisma.bookmark.findMany({
        where: {
          user: {
            id: user.id,
          },
        },
      });
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

export default new BookmarkList();
