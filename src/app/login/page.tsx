'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // 导入 supabaseClient

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (sessionData?.session) {
        setUser(sessionData.session.user); // 设置当前用户
      }
      if (error) {
        console.error(error);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null); // 监听认证状态变化
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;

      // 在这里，data 只包含一个 url 和 provider 信息
      // 我们需要确保获取到 OAuth 登录后返回的 session 信息
      const session = await supabase.auth.getSession(); // 获取当前 session
      if (session.data?.session?.user) {
        setUser(session.data.session.user); // 从 session 中获取用户信息
      }
      
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div>
      {!user ? (
        <button onClick={handleLogin} disabled={loading}>
          {loading ? '正在登录...' : '通过 Google 登录'}
        </button>
      ) : (
        <div>
          <h3>欢迎，{user.email}</h3>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
            }}
          >
            登出
          </button>
        </div>
      )}
    </div>
  );
}
