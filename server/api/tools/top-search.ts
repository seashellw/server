import { defineHandler } from "@/util/util";
import { ofetch } from "ofetch";
import destr from "destr";
import { SE, useCacheFn } from "@/util/util";

const fetchData = useCacheFn(async () => {
  let res: any = "";
  try {
    res = await ofetch("https://tenapi.cn/resou");
  } catch (e) {
    throw new SE(500, JSON.stringify(e));
  }
  let list = destr(res)?.list;
  if (!(list instanceof Array)) {
    throw new SE(500, "获取失败");
  }
  return list;
}, 1000 * 60 * 60 * 24);

export default defineHandler(async () => {
  return {
    list: await fetchData(),
  };
});
