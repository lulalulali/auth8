"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isSessionReady, setIsSessionReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      setIsSessionReady(true);
    }
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || !isSessionReady) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <h1>欢迎，{session?.user?.name}!</h1>
      <p>这是一个受保护的页面。</p>
    </div>
  );
}
