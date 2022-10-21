import { UserItem } from "../../interface/lib/user";
import { prisma } from "../init";

class BookmarkList {
  /**
   * 插入书签
   */
  async create(data: { userId: string; url: string; title: string }) {
    return await prisma.bookmark.create({
      data: {
        url: data.url,
        title: data.title,
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
  }

  /**
   * 删除书签
   */
  async deleteOne(id: string) {
    return await prisma.bookmark.delete({
      where: {
        id,
      },
    });
  }

  /**
   * 更新书签
   */
  async updateOne(id: string, data: { title?: string; url?: string }) {
    return await prisma.bookmark.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  /**
   * 查询
   */
  async selectByOwner(userId: string) {
    return await prisma.bookmark.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}

export default new BookmarkList();
