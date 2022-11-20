import { useLogInState } from "./user";
import { defineHandler, SE } from "@/util";
import { bookmarkDB } from "@/database/bookmark";
import { readBody } from "h3";

export interface BookmarkCreateRequest {
  url?: string;
  title?: string;
}

export default defineHandler(async (e) => {
  let { url, title } = await readBody<BookmarkCreateRequest>(e);
  if (!url) {
    throw new SE(400, "url is required");
  }
  title = title || url;
  const { user } = await useLogInState(e);
  await bookmarkDB.create({ user, url, title });
});
