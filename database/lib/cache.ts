import { prisma } from "../init";

class CacheList {
  /**
   * 插入
   */
  async create(
    id: string,
    data: { value: string; expiryTime: Date }
  ) {
    try {
      return await prisma.cache.create({
        data: {
          id,
          ...data,
        },
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * 删除
   */
  async delete(id: string) {
    try {
      return await prisma.cache.delete({
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
   * 更新
   */
  async update(
    id: string,
    data: { value: string; expiryTime: Date }
  ) {
    try {
      return await prisma.cache.upsert({
        where: {
          id,
        },
        update: {
          ...data,
        },
        create: {
          id,
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
  async select(id: string) {
    try {
      return await prisma.cache.findFirst({
        where: {
          id,
        },
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export default new CacheList();
