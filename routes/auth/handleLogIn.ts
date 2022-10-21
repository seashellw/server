import { db } from "@/database";
import { defineHandler, SE } from "@/util";
import { createJwtFromUser, LogInState } from "../user";
import { GITHUB_ID } from "./logIn";

const GITHUB_SECRET = process.env.GITHUB_SECRET;

export default defineHandler(async (e) => {
  const { code } = useQuery(e);
  if (!code) {
    throw new SE(400, "参数错误");
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
  ).then((res) => res.json());

  const result = await fetch(`https://api.github.com/user`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `token ${accessToken}`,
    },
  }).then((res) => res.json());

  if (!result.login) {
    throw new Error(JSON.stringify(result));
  }

  const user = await db.user.update({
    email: `${result.email}`,
    id: `${result.id}`,
    image: result.avatar_url,
    name: result.login,
  });

  let from = getCookie(e, "from");
  if (!from) {
    throw new SE(400, "cookie 中不存在 form");
  }
  let jwt = await createJwtFromUser(user);
  const state: LogInState = {
    user,
    jwt,
  };
  await db.cache.set(user.id, {
    value: JSON.stringify(state),
    expiryTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
  });

  setCookie(e, "token", jwt);
  const url = new URL(from);
  url.searchParams.set("token", jwt);
  await sendRedirect(e, url.toString());
});
