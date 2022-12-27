import { bookmarkDB } from "@/database/bookmark";
import { readBody } from "h3";
import { defineHandler, SE } from "@/util/util";

export interface BookmarkUpdateRequest {
  id?: string;
  url?: string;
  title?: string;
}

export default defineHandler(async (e) => {
  const test = await readBody<BookmarkUpdateRequest>(e);
  console.log(test);
  if (!test.id) {
    throw new SE(400, "id is required");
  }
  await bookmarkDB.updateOne(test.id, { url: test.url, title: test.title });
});
