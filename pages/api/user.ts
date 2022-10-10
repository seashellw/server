import { UserItem, UserResponse } from "interface/lib/user";
import { jwtVerify, SignJWT } from "jose";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { env } from "process";
import { TextEncoder } from "util";
import { APIHandler } from "util/tool";
import { signOption } from "./auth/[...nextauth]";

const privateKey = new TextEncoder().encode(env.NEXTAUTH_SECRET);

export const useUserFromJWT = async (ctx: {
  req: NextApiRequest;
}): Promise<{
  user?: UserItem;
  jwt?: string;
}> => {
  let jwt = ctx.req.headers.authorization?.split(" ")[1];
  if (!jwt) {
    return {};
  }
  try {
    let { payload } = await jwtVerify(jwt, privateKey);
    if (payload.id && payload.name) {
      return {
        user: payload as UserItem,
        jwt,
      };
    }
    return {};
  } catch (e) {
    return {};
  }
};

export const useUserFromSession = async (ctx: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<{
  user?: UserItem;
}> => {
  let session = await unstable_getServerSession(ctx.req, ctx.res, signOption);
  if (!session?.user.id) {
    return {};
  }
  return { user: session.user };
};

export default APIHandler<{}, UserResponse>(
  async (ctx) => {
    let { user, jwt } = await useUserFromJWT(ctx);

    if (user) {
      return { ok: true, user, jwt };
    }

    ({ user } = await useUserFromSession(ctx));

    if (!user) {
      ctx.res.status(401);
      return {
        ok: false,
      };
    }

    if (!privateKey) {
      ctx.res.status(500);
      return {
        ok: false,
        msg: "服务器未配置私钥",
      };
    }

    jwt = await new SignJWT(user)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .sign(privateKey);

    return { ok: true, user: user, jwt };
  },
  { method: "GET" }
);
