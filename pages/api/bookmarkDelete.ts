import { APIHandler } from "util/tool";
import { db } from "database";
import {
  BookmarkDeleteRequest,
  BookmarkDeleteResponse,
} from "interface";

export default APIHandler<
  BookmarkDeleteRequest,
  BookmarkDeleteResponse
>(
  async ({ data: { id } }) => {
    if (!id) {
      return { ok: false };
    }
    const bookmark = await db.bookmark.deleteOne(id);
    if (!bookmark) {
      return { ok: false };
    }
    return { ok: true };
  },
  {
    method: "POST",
  }
);
