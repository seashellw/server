import { Page, setTotal } from "@/interface/page";
import { defineHandler, useCacheFn } from "@/util/util";
import destr from "destr";
import { request } from "undici";

const fetchData = async (url: string) => {
  let res = await request(url, {
    maxRedirections: 10,
  }).then((res) => res.body.text());
  return res;
};

const getTopSearch = useCacheFn(async () => {
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
}, 1000 * 60 * 60 * 24);

export default defineHandler(async (e) => {
  let list = await getTopSearch();
  const { current, pageSize } = getQuery(e);
  if (current) {
    let page: Page = {
      current: parseInt(`${current}`) || 1,
      pageSize: parseInt(`${pageSize}`) || 10,
    };
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
    return {
      list,
    };
  }
});
