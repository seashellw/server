import { db } from "database";
import { BookmarkListResponse } from "interface";
import { APIHandler } from "util/tool";
import { useUserFromJWT } from "./user";

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
