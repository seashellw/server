import { db } from "@/database";
import { UserItem } from "@/interface/lib/user";
import { H3Event } from "h3";
import { jwtVerify, SignJWT } from "jose";
import { env } from "process";
import { defineHandler, SE } from "@/util";
import { TextEncoder } from "util";

const privateKey = new TextEncoder().encode(env.NEXTAUTH_SECRET);

export interface JwtPayload {
  [key: string]: string | number | boolean;
  id: string;
  time: number;
}

export const getJwt = (e: H3Event) => {
  let jwt = getHeader(e, "authorization");
  jwt = jwt?.split(" ")[1];
  if (!jwt) throw new SE(401, "未登录");
  return jwt;
};

export const getPayloadFromJwt = async (
  jwt: string
): Promise<JwtPayload | undefined> => {
  let { payload } = await jwtVerify(jwt, privateKey);
  if (typeof payload?.id !== "string") {
    throw new Error("令牌解析异常，令牌无效");
  }
  return payload as JwtPayload;
};

export interface LogInState {
  user: UserItem;
  jwt: string;
}

export const getLogInState: (e: H3Event) => Promise<LogInState> = async (e) => {
  const jwt = getJwt(e);
  const payload = await getPayloadFromJwt(jwt);
  const res = await db.cache.get(payload.id);
  if (!res) throw new SE(401, "登录状态已过期");
  let state = JSON.parse(res);
  if (state.jwt !== jwt) {
    throw new SE(401, "登录状态已过期");
  }
  return state;
};

export const createJwtFromUser = async (user: UserItem) => {
  const payload: JwtPayload = {
    id: user.id,
    time: Date.now(),
  };
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .sign(privateKey);
  return jwt;
};

export default defineHandler(async (e) => {
  let { user } = await getLogInState(e);

  if (user) {
    return { user };
  }
});
