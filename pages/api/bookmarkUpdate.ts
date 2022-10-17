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
      return { ok: false };
    }
    url = url || undefined;
    title = title || undefined;
    const bookmark = await db.bookmark.updateOne(id, {
      url,
      title,
    });
    if (!bookmark) {
      return { ok: false };
    }
    return { ok: true };
  },
});
