import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function useUser() {
  const [session, setSession] = useState<Session>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session != null) setSession(session);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);
  async function handleLogin(email: string) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({
        email,
      });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  function signInWithGithub() {
    supabase.auth.signIn({ provider: 'github' });
  }

  function signOut() {
    supabase.auth.signOut();
  }

  return {
    loading,
    session,
    handleLogin,
    signInWithGithub,
    signOut,
  };
}
