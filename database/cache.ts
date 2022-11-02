import { prisma } from "./init";
import destr from "destr";

class CacheDB {
  constructor() {
    setInterval(() => {
      this.clear().then(() => {
        console.log("clear cache");
      });
    }, 1000 * 60 * 60 * 24);
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
    let res = await prisma.cache.findUnique({
      where: { id: key },
    });
    if (!res) {
      return null;
    }
    if ((res.expiryTime || 0) < new Date()) {
      return null;
    }
    return destr(res.value);
  }

  async set(id: string, data: { value: Object; expiryTime?: Date }) {
    data.expiryTime ||= new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    const value = JSON.stringify(data.value);
    return await prisma.cache.upsert({
      where: {
        id,
      },
      update: {
        ...data,
        value,
      },
      create: {
        id,
        ...data,
        value,
      },
    });
  }
}

export const cacheDB = new CacheDB();
