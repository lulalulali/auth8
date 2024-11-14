// src/app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div>
      <h2>登录到你的账号</h2>
      <button onClick={() => signIn("google")}>使用 Google 登录</button>
    </div>
  );
}
