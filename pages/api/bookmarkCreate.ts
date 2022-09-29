import { db } from "database";
import { BookmarkCreateRequest, BookmarkCreateResponse } from "interface";
import { APIHandler } from "util/tool";
import { useUserFromJWT } from "./user";

export default APIHandler<BookmarkCreateRequest, BookmarkCreateResponse>(
  async (ctx) => {
    let {
      data: { url, title },
    } = ctx;

    if (!url) {
      return { ok: false };
    }

    title = title || url;
    const { user } = await useUserFromJWT(ctx);
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
