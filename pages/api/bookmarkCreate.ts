import { db } from "database";
import { BasicResponse } from "interface/util";
import { APIHandler } from "util/tool";
import { getUserFromJWT } from "./user";

export interface BookmarkCreateRequest {
  url?: string;
  title?: string;
}

export interface BookmarkCreateResponse extends BasicResponse {}

export default APIHandler<BookmarkCreateRequest, BookmarkCreateResponse>(
  async (ctx) => {
    let {
      data: { url, title },
    } = ctx;

    if (!url) {
      return { ok: false };
    }

    title = title || url;
    const { user } = await getUserFromJWT(ctx);
    if (!user) {
      return { ok: false };
    }
    const bookmark = await db.bookmark.create(user, url, title);
    if (!bookmark) {
      return { ok: false };
    }
    return { ok: true };
  },
  {
    method: "POST",
  }
);
