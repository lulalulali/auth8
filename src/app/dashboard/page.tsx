// src/app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div>加载中...</div>;

  if (!session) {
    // 如果用户没有登录，重定向到登录页
    router.push("/login");
    return null;
  }

  return (
    <div>
      <h1>欢迎，{session.user?.name}!</h1>
      <p>这是一个受保护的页面。</p>
    </div>
  );
}
