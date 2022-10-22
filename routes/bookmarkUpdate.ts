import { bookmarkDB } from "@/database/bookmark";
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
  await bookmarkDB.updateOne(id, { url, title });
});
