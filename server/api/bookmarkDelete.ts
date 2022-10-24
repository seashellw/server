import { bookmarkDB } from "@/database/bookmark";
import { defineHandler, SE } from "@/util";

export interface BookmarkDeleteRequest {
  id?: string;
}

export default defineHandler(async (e) => {
  const { id } = await useBody<BookmarkDeleteRequest>(e);
  if (!id) {
    throw newError(400, "id is required");
  }
  await bookmarkDB.delete(id);
});
