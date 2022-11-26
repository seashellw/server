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
    let res = await prisma.cache.findFirst({
      where: { label: key },
      orderBy: { updateTime: "desc" },
    });
    if (!res) return null;
    return destr(res.value);
  }

  async getList(key: string) {
    let res = await prisma.cache.findMany({
      where: { label: key },
      orderBy: { updateTime: "desc" },
    });
    return res.map((item) => {
      return {
        ...item,
        value: destr(item.value),
      };
    });
  }

  async set(key: string, data: { value: Object; expiryTime?: Date }) {
    data.expiryTime ||= new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    const value = JSON.stringify(data.value);
    return await prisma.cache.create({
      data: {
        label: key,
        value,
        updateTime: new Date(),
        expiryTime: data.expiryTime,
      },
    });
  }
}

export const cacheDB = new CacheDB();
