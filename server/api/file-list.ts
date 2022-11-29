import { defineHandler, SE } from "@/util/util";
import { fetchFileList } from "@/util/cos";
import { getQuery } from "h3";

export default defineHandler(async (e) => {
  const { prefix } = getQuery(e);
  if (typeof prefix !== "string") {
    throw new SE(400, "必须的参数：prefix");
  }
  const list = await fetchFileList(prefix);
  return {
    list,
  };
});
