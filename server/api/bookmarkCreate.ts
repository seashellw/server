import { useLogInState } from "./user";
import { defineHandler, SE } from "@/util";
import { bookmarkDB } from "@/database/bookmark";

export interface BookmarkCreateRequest {
  url?: string;
  title?: string;
}

export default defineHandler(async (e) => {
  let { url, title } = await useBody<BookmarkCreateRequest>(e);
  if (!url) {
    throw newError(400, "url is required");
  }
  title = title || url;
  const { user } = await useLogInState(e);
  await bookmarkDB.create({ user, url, title });
});
