import { db } from "@/database";
import { defineHandler, SE } from "@/util";
import { getPayloadFromJwt } from "../user";

export default defineHandler(async (e) => {
  const { from } = useQuery(e);
  if (typeof from !== "string") {
    throw new SE(400, "参数错误");
  }
  const url = new URL(from);
  let jwt = getCookie(e, "token");
  if (!jwt) {
    await sendRedirect(e, url.toString());
    return;
  }
  deleteCookie(e, "token");
  const { id } = await getPayloadFromJwt(jwt);
  await db.cache.delete(id);
  await sendRedirect(e, url.toString());
});
