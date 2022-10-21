import { defineHandler, SE } from "@/util";

export const GITHUB_ID = process.env.GITHUB_ID;
export const REDIRECT_URL = process.env.NEXTAUTH_URL;

export default defineHandler(async (e) => {
  const { from } = useQuery(e);
  if (typeof from !== "string") {
    throw new SE(400, "参数错误");
  }
  setCookie(e, "from", from);
  let token = getCookie(e, "token");
  if (token) {
    let url = new URL(from);
    url.searchParams.set("token", token);
    await sendRedirect(e, url.toString());
    return;
  }
  let url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", GITHUB_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URL + "/handleLogIn");
  await sendRedirect(e, url.toString());
});
