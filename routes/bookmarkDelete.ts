import { db } from "@/database";
import { defineHandler, SE } from "@/util";

export interface BookmarkDeleteRequest {
  id?: string;
}

export default defineHandler(async (e) => {
  const { id } = await useBody<BookmarkDeleteRequest>(e);
  if (!id) {
    throw new SE(400, "id is required");
  }
  await db.bookmark.deleteOne(id);
});
