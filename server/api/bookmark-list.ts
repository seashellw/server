import { bookmarkDB } from "@/database/bookmark";
import { defineHandler } from "@/util/util";
import { useLogInState } from "./user";

export interface BookmarkListResponse {
  list?: {
    id: string;
    url: string;
    title: string;
    createTime: string;
  }[];
}

export default defineHandler(async (e) => {
  const { user } = await useLogInState(e);
  const list = await bookmarkDB.selectByUser(user.id);
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
