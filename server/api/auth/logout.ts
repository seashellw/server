import { tokenDB } from "@/database/token";
import { defineHandler, SE } from "@/util/util";
import { deleteCookie, getCookie, getQuery, sendRedirect } from "h3";

export default defineHandler(async (e) => {
  const { from } = getQuery(e);
  if (typeof from !== "string") {
    throw new SE(400, "未提供回调地址");
  }
  const url = new URL(from);
  let token = getCookie(e, "token");
  if (!token) {
    await sendRedirect(e, url.toString());
    return;
  }
  deleteCookie(e, "token");
  await tokenDB.delete(token);
  await sendRedirect(e, url.toString());
});
