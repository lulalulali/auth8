// src/app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react"; // 只导入 useSession
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Session } from "next-auth"; // 从 next-auth 导入 Session 类型

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSessionReady, setIsSessionReady] = useState(false);

  // 明确指定 session 的类型
  useEffect(() => {
    if (status === "authenticated") {
      setIsSessionReady(true);
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !isSessionReady) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <h1>欢迎，{(session as Session)?.user?.name}!</h1> {/* 使用类型断言 */}
      <p>这是一个受保护的页面。</p>
    </div>
  );
}
