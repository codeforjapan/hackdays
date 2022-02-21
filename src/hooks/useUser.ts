import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { debug } from '../utils/commonTools';
import { supabase } from '../utils/supabaseClient';

export type UserData = {
  username: string;
  website: string;
  avatar_url: string;
} | null;
export type UpdateUserParam = {
  username: string | null;
  website: string | null;
  avatar_url: string | null;
};
export default function useUser() {
  const [session, setSession] = useState<Session>();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserData>(null);
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

  async function getMyProfile() {
    const user = supabase.auth.user();
    if (user) {
      return getProfile(user?.id);
    } else {
      throw new Error('not logged in');
    }
  }
  async function getProfile(id: string) {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', id)
        .single();

      if (error && status !== 406) {
        throw error;
      }
      debug('got user data: ', data);
      setUser(data);
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url }: UpdateUserParam) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates: {
        id: string | undefined;
        username: string | null;
        website: string | null;
        avatar_url: string | null;
        updated_at: Date;
      } = {
        id: user?.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    loading,
    session,
    handleLogin,
    signInWithGithub,
    signOut,
    getMyProfile,
    updateProfile,
  };
}
