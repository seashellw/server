import { UserItem, UserResponse } from "interface/lib/user";
import { jwtVerify, SignJWT } from "jose";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { env } from "process";
import { TextEncoder } from "util";
import { APIHandler } from "util/tool";
import { signOption } from "./auth/[...nextauth]";

const privateKey = new TextEncoder().encode(env.NEXTAUTH_SECRET);

export const getUserFromJWT = async (ctx: {
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

export const getUserFromSession = async (ctx: {
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

export default APIHandler<{}, UserResponse>({
  method: "GET",
  handler: async (ctx) => {
    let { user, jwt } = await getUserFromJWT(ctx);

    if (user) {
      return { ok: true, user, jwt };
    }

    ({ user } = await getUserFromSession(ctx));

    if (!user) {
      ctx.setStatus(401).end("用户未登录或令牌不正确");
      return;
    }

    if (!privateKey) {
      ctx.setStatus(500).end("服务器未配置私钥");
      return;
    }

    jwt = await new SignJWT(user)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .sign(privateKey);

    return { user: user, jwt };
  },
});
