import { db } from "@/database";
import { defineHandler, SE } from "@/util";
import { getLogInState } from "./user";

export interface BookmarkListResponse {
  list?: {
    id: string;
    url: string;
    title: string;
    createTime: string;
  }[];
}

export default defineHandler(async (e) => {
  const { user } = await getLogInState(e);
  let list = await db.bookmark.selectByOwner(user.id);
  let res: BookmarkListResponse = {
    list: list.map((item) => {
      return {
        ...item,
        createTime: `${item.createTime.getTime()}`,
      };
    }),
  };
  return res;
});
