import { db } from "database";
import { APIHandler } from "util/tool";
import { getUserFromJWT } from "./user";

export interface BookmarkListResponse {
  list?: {
    id: string;
    url: string;
    title: string;
    createTime: string;
  }[];
}

export default APIHandler<{}, BookmarkListResponse>({
  method: "GET",
  handler: async (ctx) => {
    const { user } = await getUserFromJWT(ctx);
    if (!user) {
      ctx.setStatus(401);
      return "用户未登录或令牌不正确";
    }
    let list = await db.bookmark.selectByOwner(user);
    if (!list) {
      ctx.setStatus(500);
      return "查询异常";
    }
    return {
      list: list.map((item) => {
        return {
          ...item,
          createTime: `${item.createTime.getTime()}`,
        };
      }),
    };
  },
});
