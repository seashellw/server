import { getLogInState } from "./user";
import { defineHandler, SE } from "@/util";
import { db } from "@/database";

export interface BookmarkCreateRequest {
  url?: string;
  title?: string;
}

export default defineHandler(async (e) => {
  let { url, title } = await useBody<BookmarkCreateRequest>(e);
  if (!url) {
    throw new SE(400, "url is required");
  }
  title = title || url;
  const { user } = await getLogInState(e);
  await db.bookmark.create({
    userId: user.id,
    url,
    title,
  });
});
