import { setTotal } from "@/interface/page";
import destr from "destr";
import { request } from "undici";
import { cacheDB } from "./cache";
import { prisma } from "./init";

const fetchData = async (url: string) => {
  let res = await request(url, {
    maxRedirections: 10,
  }).then((res) => res.body.text());
  return res;
};

const getTopSearch = async () => {
  let res: {
    title: string;
    url: string;
    type: string;
  }[] = [];
  await Promise.all([
    (async () => {
      let text = await fetchData("https://tenapi.cn/resou");
      let list = destr(text)?.list;
      if (list?.length) {
        res.push(
          ...list.map((item: any) => ({
            title: item.name,
            url: item.url,
            type: "微博",
          }))
        );
      }
    })(),
    (async () => {
      let text = await fetchData("https://tenapi.cn/baiduhot");
      let list = destr(text)?.list;
      if (list?.length) {
        res.push(
          ...list.map((item: any) => ({
            title: item.name,
            url: item.url,
            type: "百度",
          }))
        );
      }
    })(),
    (async () => {
      let text = await fetchData("https://tenapi.cn/bilihot");
      let list = destr(text)?.list;
      if (list?.length) {
        res.push(
          ...list.map((item: any) => ({
            title: item.showname,
            url: item.url,
            type: "哔哩哔哩",
          }))
        );
      }
    })(),
    (async () => {
      let text = await fetchData("https://tenapi.cn/zhihuresou");
      let list = destr(text)?.list;
      if (list?.length) {
        res.push(
          ...list.map((item: any) => ({
            title: item.query,
            url: item.url,
            type: "知乎",
          }))
        );
      }
    })(),
  ]);
  return res;
};

export const time24 = 1000 * 60 * 60 * 24;

class TopSearchDB {
  constructor() {
    cacheDB.get("top-search-update-time").then((res) => {
      let time = parseInt(res?.time) || 0;
      time = new Date().getTime() - time;
      if (time > time24) {
        this.fetch();
        setInterval(() => this.fetch(), time24);
      } else {
        setTimeout(() => {
          setInterval(() => this.fetch(), time24);
        }, time24 - time);
      }
    });
  }

  async fetch() {
    cacheDB.set("top-search-update-time", {
      time: new Date().getTime(),
    });
    let res = await getTopSearch();
    for (let item of res) {
      let old = await prisma.topSearch.findFirst({
        where: {
          title: item.title,
          type: item.type,
        },
      });
      if (old) {
        await prisma.topSearch.update({
          where: {
            id: old.id,
          },
          data: {
            ...item,
            updateTime: new Date(),
          },
        });
      } else {
        await prisma.topSearch.create({
          data: {
            ...item,
          },
        });
      }
    }
  }

  async select(where: { type?: string; current?: number; pageSize?: number }) {
    let { type, current, pageSize } = where;
    type = type || undefined;
    current = current || 1;
    pageSize = pageSize || 100;
    let total = await prisma.topSearch.count({
      where: {
        type,
      },
    });
    let page = setTotal({ current, pageSize }, total);
    let list = await prisma.topSearch.findMany({
      where: {
        type: where.type,
      },
      orderBy: {
        updateTime: "desc",
      },
      skip: (page.current - 1) * page.pageSize,
      take: page.pageSize,
    });
    return {
      list: list.map((item) => ({
        ...item,
        updateTime: `${item.updateTime.getTime()}`,
      })),
      ...page,
    };
  }
}

export const topSearchDB = new TopSearchDB();
