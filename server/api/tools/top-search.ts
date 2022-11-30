import { defineHandler } from "@/util/util";
import destr from "destr";
import { SE, useCacheFn } from "@/util/util";
import { get } from "https";

const getTopSearch = async (url = "https://tenapi.cn/resou") => {
  return new Promise<string>((resolve) => {
    let text = "";
    get(url, (res) => {
      if (res.headers.location?.startsWith("https")) {
        getTopSearch(res.headers.location).then((data) => resolve(data));
        return;
      }
      res.on("data", (d) => {
        text += d;
      });
      res.on("end", () => {
        resolve(text);
      });
    });
  });
};

const fetchData = useCacheFn(async () => {
  let res = "";
  try {
    res = await getTopSearch();
  } catch (e) {
    console.log(e);
    throw new SE(500, `${e}`);
  }
  let list = destr(res)?.list;
  if (!(list instanceof Array)) {
    throw new SE(500, `${list}`);
  }
  return list;
}, 1000 * 60 * 60 * 24);

export default defineHandler(async () => {
  return {
    list: await fetchData(),
  };
});
