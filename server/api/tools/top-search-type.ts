import { topSearchDB } from "@/database/topSearch";
import { defineHandler } from "@/util/util";

export default defineHandler(async () => {
  return topSearchDB.selectType();
});
