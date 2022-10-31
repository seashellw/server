import { bookmarkDB } from "@/database/bookmark";
import { readBody } from "h3";
import { defineHandler, SE } from "@/util";

export interface BookmarkDeleteRequest {
  id?: string;
}

export default defineHandler(async (e) => {
  const { id } = await readBody<BookmarkDeleteRequest>(e);
  if (!id) {
    throw new SE(400, "id is required");
  }
  await bookmarkDB.delete(id);
});
