import { db } from "database";
import { BasicResponse } from "interface/util";
import { APIHandler } from "util/tool";
import { useUserFromJWT } from "./user";

export interface BookmarkListResponse extends BasicResponse {
  list?: {
    id: string;
    url: string;
    title: string;
    createTime: string;
  }[];
}

export default APIHandler<{}, BookmarkListResponse>(
  async (ctx) => {
    const { user } = await useUserFromJWT(ctx);
    if (!user) {
      return { ok: false };
    }
    let list = await db.bookmark.selectByOwner(user);
    if (!list) {
      return { ok: false };
    }
    return {
      ok: true,
      list: list.map((item) => {
        return {
          ...item,
          createTime: `${item.createTime.getTime()}`,
        };
      }),
    };
  },
  {
    method: "GET",
  }
);
