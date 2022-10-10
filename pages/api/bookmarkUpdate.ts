import { db } from "database";
import { BasicResponse } from "interface/util";
import { APIHandler } from "util/tool";

export interface BookmarkUpdateRequest {
  id?: string;
  url?: string;
  title?: string;
}

export interface BookmarkUpdateResponse extends BasicResponse {}

export default APIHandler<
  BookmarkUpdateRequest,
  BookmarkUpdateResponse
>(
  async (req) => {
    let { url, title, id } = req.data;
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
  {
    method: "POST",
  }
);
