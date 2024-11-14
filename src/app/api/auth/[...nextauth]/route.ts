import NextAuth, { Session, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`, // 确保与控制台中配置的 URI 匹配
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, account }: { token: any; account?: any }) {
      // 如果账户存在并且包含 access_token，则存储它
      if (account?.access_token) {
        token.accessToken = account.access_token; // 保存访问令牌
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: any }) {
      session.accessToken = token.accessToken as string | undefined;
      return session;
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
