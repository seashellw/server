import { db } from "database";
import { APIHandler } from "util/tool";

export interface BookmarkUpdateRequest {
  id?: string;
  url?: string;
  title?: string;
}

export interface BookmarkUpdateResponse {}

export default APIHandler<BookmarkUpdateRequest, BookmarkUpdateResponse>({
  method: "POST",
  handler: async (ctx) => {
    let { url, title, id } = ctx.data;
    if (!id) {
      ctx.setStatus(400);
      return "id为必须";
    }
    url = url || undefined;
    title = title || undefined;
    const bookmark = await db.bookmark.updateOne(id, {
      url,
      title,
    });
    if (!bookmark) {
      ctx.setStatus(500);
      return "更新异常";
    }
  },
});
