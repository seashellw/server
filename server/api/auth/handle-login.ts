import { tokenDB } from "@/database/token";
import { userDB } from "@/database/user";
import { defineHandler, getId, SE } from "@/util/util";
import { fetch } from "undici";
import { GITHUB_ID } from "./login";
import { getCookie, getQuery, sendRedirect, setCookie } from "h3";

const GITHUB_SECRET = process.env.GITHUB_SECRET;

export default defineHandler(async (e) => {
  const { code } = getQuery(e);
  if (!code) {
    throw new SE(400, "code is required");
  }

  const { access_token: accessToken } = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${GITHUB_ID}&client_secret=${GITHUB_SECRET}&code=${code}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  ).then((res) => res.json() as any);

  const result = await fetch(`https://api.github.com/user`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `token ${accessToken}`,
    },
  }).then((res) => res.json() as any);

  if (!result.login) {
    throw new Error(JSON.stringify(result));
  }

  const user = await userDB.update({
    email: `${result.email}`,
    id: `${result.id}`,
    image: result.avatar_url,
    name: result.login,
  });

  let from = getCookie(e, "from");
  if (!from) {
    throw new SE(400, "no from in cookie");
  }
  let tokenItem = await tokenDB.update({
    user: {
      ...user,
      authority: user.authority || undefined,
    },
    expiryTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    id: getId(),
    updateTime: new Date(),
  });
  setCookie(e, "token", tokenItem.id);
  const url = new URL(from);
  url.searchParams.set("token", tokenItem.id);
  await sendRedirect(e, url.toString());
});
