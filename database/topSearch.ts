import { prisma } from "./init";
import destr from "destr";
import { request } from "undici";
import { Page, setTotal } from "@/interface/page";

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

class TopSearchDB {
  constructor() {
    this.fetch();
    setInterval(() => {
      this.fetch();
    }, 1000 * 60 * 60 * 24);
  }

  async fetch() {
    let count = await prisma.topSearch.count({
      where: {
        updateTime: {
          gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 23),
        },
      },
    });
    if (!count) {
      let res = await getTopSearch();
      await prisma.topSearch.createMany({
        data: res.map((item) => ({
          ...item,
        })),
      });
    }
  }

  async select(where: { type?: string; current?: number; pageSize?: number }) {
    if (where.current && where.pageSize) {
      const page: Page = {
        current: where.current || 1,
        pageSize: where.pageSize || 10,
      };
      let list = await prisma.topSearch.findMany({
        where: {
          type: where.type,
          updateTime: {
            gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
          },
        },
      });
      setTotal(page, list.length);
      list = list.slice(
        (page.current - 1) * page.pageSize,
        page.current * page.pageSize
      );
      return {
        list,
        ...page,
      };
    } else {
      let list = await prisma.topSearch.findMany({
        where: {
          type: where.type,
          updateTime: {
            gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
          },
        },
      });
      return {
        list,
      };
    }
  }
}

export const topSearchDB = new TopSearchDB();
