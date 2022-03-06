import { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useState } from 'react';
import { UpdateUserServiceParam, UserService } from '../services/users.service';
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
export type UserState = {
  loading: boolean;
  user: UserData;
  session: Session | null;
};
export default function useUser() {
  const [user, setUser] = useState<UserData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [session, setSession] = useState<Session>();
  const userState = {
    loading,
    user,
    session,
  };

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
      // @todo implement login success flow
      alert('Check your email for the login link!');
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
      const result = await UserService.getUser(id);
      setUser(result);
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
    userState,
    handleLogin,
    signInWithGithub,
    signOut,
    getMyProfile,
    getProfile,
    updateProfile,
  };
}
