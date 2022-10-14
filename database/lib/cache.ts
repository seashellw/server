import { prisma } from "../init";

class CacheList {
  constructor() {
    setInterval(() => {
      this.clear().then(() => {
        console.log("clear cache");
      });
    }, 1000 * 60 * 60 * 24);
  }

  /**
   * 插入
   */
  async create(id: string, data: { value: string; expiryTime: Date }) {
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
  async update(id: string, data: { value: string; expiryTime: Date }) {
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
      return null;
    }
  }

  /**
   * 查询
   */
  async select(id: string) {
    try {
      return await prisma.cache.findUnique({
        where: {
          id,
        },
      });
    } catch (e) {
      return null;
    }
  }

  /**
   * 清理过期的字段
   */
  async clear() {
    try {
      return await prisma.cache.deleteMany({
        where: {
          expiryTime: {
            lt: new Date(),
          },
        },
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export default new CacheList();
