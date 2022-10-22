import { prisma } from "./init";

class CacheDB {
  constructor() {
    setInterval(() => {
      this.clear().then(() => {
        console.log("clear cache");
      });
    }, 1000 * 60 * 60 * 24);
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
  async upsert(id: string, data: { value: string; expiryTime: Date }) {
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
    return await prisma.cache.deleteMany({
      where: {
        expiryTime: {
          lt: new Date(),
        },
      },
    });
  }

  async get(key: string) {
    let res = await this.select(key);
    if (!res) {
      return null;
    }
    if ((res.expiryTime || 0) < new Date()) {
      return null;
    }
    return res.value;
  }

  async set(id: string, data: { value: string; expiryTime?: Date }) {
    return await this.upsert(id, {
      ...data,
      expiryTime:
        data.expiryTime || new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
    });
  }
}

export const cacheDB = new CacheDB();
