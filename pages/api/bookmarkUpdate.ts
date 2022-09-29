import { db } from "database";
import {
  BookmarkUpdateRequest,
  BookmarkUpdateResponse,
} from "interface";
import { APIHandler } from "util/tool";

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
