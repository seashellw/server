import { db } from "database";
import { APIHandler } from "util/tool";
import { getUserFromJWT } from "./user";

export interface BookmarkCreateRequest {
  url?: string;
  title?: string;
}

export default APIHandler<BookmarkCreateRequest, {}>({
  method: "POST",
  handler: async (ctx) => {
    let {
      data: { url, title },
    } = ctx;

    if (!url) {
      ctx.setStatus(400);
      return "请求参数错误";
    }

    title = title || url;
    const { user } = await getUserFromJWT(ctx);
    if (!user) {
      ctx.setStatus(401);
      return "用户未登录";
    }
    const bookmark = await db.bookmark.create(user, url, title);
    if (!bookmark) {
      ctx.setStatus(500);
      return "创建书签失败，可能有重复书签";
    }
  },
});
