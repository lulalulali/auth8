import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// 扩展 DefaultSession 类型以包含 accessToken
declare module "next-auth" {
  interface Session {
    accessToken?: string; // 添加 accessToken 属性
  }
}

const authOptions = {
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
    signIn: "/login", // 自定义登录页
    error: "/auth/error", // 自定义错误页
  },

  callbacks: {
    // 在 JWT 回调中处理访问令牌
    async jwt({ token, account }: { token: any; account?: any }) {
      if (account?.access_token) {
        token.accessToken = account.access_token; // 保存访问令牌
      }
      return token;
    },

    // 在 session 回调中添加访问令牌
    async session({ session, token }: { session: Session; token: any }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken; // 将访问令牌传递到 session
      }
      return session;
    },

    // 重定向回调
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith(baseUrl)) {
        return url; // 默认情况下重定向到当前 URL
      } else {
        return baseUrl; // 如果 URL 不在基础 URL 下，重定向到主页
      }
    },
  },
};

// 处理 GET 和 POST 请求
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
