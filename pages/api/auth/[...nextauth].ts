import { db } from "database";
import { UserItem } from "interface/lib/user";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { env } from "process";

declare module "next-auth" {
  interface Session {
    user: UserItem;
  }
}

export const signOption: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  pages: {
    signIn: env.VITE_LOGIN_PATH,
  },
  callbacks: {
    async signIn({ user }: any) {
      let res = await db.user.update(user);
      return !!res;
    },
    async session(data): Promise<Session> {
      if (!data.token.sub) {
        console.error("无法获取用户id");
        return data.session;
      }
      let res = await db.user.selectById(data.token.sub);
      if (!res) {
        console.error("数据库用户信息查询异常");
      }
      return {
        ...data.session,
        user: {
          ...data.session.user,
          id: data.token.sub,
          authority: res?.authority,
        },
      };
    },
  },
};

export default NextAuth(signOption);
