import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function useUser() {
  const [session, setSession] = useState<Session>();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session != null)
          setSession(session);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  function signInWithGithub() {
    supabase.auth.signIn({ provider: "github" });
  }

  function signOut() {
    supabase.auth.signOut();
  }

  return {
    session,
    signInWithGithub,
    signOut,
  };
}
