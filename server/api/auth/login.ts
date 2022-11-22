import { tokenDB } from "@/database/token";
import { defineHandler, SE } from "@/util";
import { getCookie, getQuery, sendRedirect, setCookie } from "h3";

export const GITHUB_ID = process.env.GITHUB_ID;
export const REDIRECT_URL = process.env.NEXTAUTH_URL;

export default defineHandler(async (e) => {
  const { from } = getQuery(e);
  if (typeof from !== "string") {
    throw new SE(400, "参数错误");
  }
  setCookie(e, "from", from);
  let token = getCookie(e, "token");
  if (token) {
    let item = await tokenDB.selectById(token);
    if (item) {
      let url = new URL(from);
      url.searchParams.set("token", token);
      await sendRedirect(e, url.toString());
      return;
    }
  }
  let url = new URL("https://github.com/login/oauth/authorize");
  if (!GITHUB_ID) throw new SE(500, "未配置 GITHUB_ID");
  url.searchParams.set("client_id", GITHUB_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URL + "/handle-login");
  await sendRedirect(e, url.toString());
});
