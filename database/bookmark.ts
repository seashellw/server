import { prisma } from "./init";

class BookmarkDB {
  /**
   * 插入书签
   */
  async create(data: {
    user: {
      id: string;
    };
    url: string;
    title: string;
  }) {
    return await prisma.bookmark.create({
      data: {
        url: data.url,
        title: data.title,
        user: {
          connect: {
            id: data.user.id,
          },
        },
      },
    });
  }

  /**
   * 删除书签
   */
  async delete(id: string) {
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
  async selectByUser(userId: string) {
    return await prisma.bookmark.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
}

export const bookmarkDB = new BookmarkDB();
