'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // 导入 supabaseClient

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        setUser(sessionData.session.user);
      }
    };
  
    fetchSession();
  
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
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

      setUser(user);
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
