import { db } from "@/database";
import { defineHandler, SE } from "@/util";

export interface BookmarkUpdateRequest {
  id?: string;
  url?: string;
  title?: string;
}

export default defineHandler(async (e) => {
  const { id, url, title } = await useBody<BookmarkUpdateRequest>(e);
  if (!id) {
    throw new SE(400, "id is required");
  }
  await db.bookmark.updateOne(id, {
    url: url || undefined,
    title: title || undefined,
  });
});
