import { APIHandler } from "util/tool";
import { db } from "database";

export interface BookmarkDeleteRequest {
  id?: string;
}

export interface BookmarkDeleteResponse {}

export default APIHandler<BookmarkDeleteRequest, BookmarkDeleteResponse>({
  method: "POST",
  handler: async ({ data: { id }, setStatus }) => {
    if (!id) {
      setStatus(400);
      return "id is required";
    }
    const bookmark = await db.bookmark.deleteOne(id);
    if (!bookmark) {
      setStatus(404);
      return;
    }
    return;
  },
});
