import { topSearchDB } from "@/database/topSearch";
import { defineHandler } from "@/util/util";

export default defineHandler(async (e) => {
  const { current, pageSize, type } = getQuery(e);
  return topSearchDB.select({
    type: type && typeof type === "string" ? type : undefined,
    current: parseInt(`${current}`) || undefined,
    pageSize: parseInt(`${pageSize}`) || undefined,
  });
});
