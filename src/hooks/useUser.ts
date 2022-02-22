import { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { UpdateUserServiceParam, UserService } from '../services/users.service';
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
  const handleLogin = useCallback(async (email: string) => {
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
  }, []);

  const signInWithGithub = useCallback(() => {
    supabase.auth.signIn({ provider: 'github' });
  }, []);

  function signOut() {
    supabase.auth.signOut();
  }

  const getMyProfile = useCallback(async () => {
    const user = supabase.auth.user();
    if (user) {
      return getProfile(user?.id);
    } else {
      throw new Error('not logged in');
    }
  }, []);

  const getProfile = useCallback(async (id: string) => {
    try {
      setLoading(true);

      const { data, error, status } = await UserService.getUser(id);

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
  }, []);

  const updateProfile = useCallback(async ({ username, website, avatar_url }: UpdateUserParam) => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates: UpdateUserServiceParam = {
        id: user?.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await UserService.updateUser(updates);

      if (error) {
        throw error;
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
