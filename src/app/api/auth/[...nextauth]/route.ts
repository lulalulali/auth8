import NextAuth, { DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

// 扩展 DefaultSession 类型以包含 accessToken
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string; // 添加 accessToken 属性
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: any }) {
      if (account) {
        token.accessToken = account.access_token; // 保存访问令牌
      }
      return token;
    },

    // 使用 DefaultSession 类型
    async session({
      session,
      token,
      user,
      newSession,
      trigger,
    }: {
      session: Session; // 使用 Session 类型
      token: JWT;
      user: User;
      newSession: any;
      trigger: "update";
    }) {
      session.accessToken = token.accessToken as string | undefined;
      return session; // 返回 session 时，不需要手动指定类型
    },

    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith(baseUrl)) {
        return url; // 保持默认重定向到 Next.js 路由
      } else {
        return baseUrl; // 如果 `url` 不在基础 URL 下，重定向到主页
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
