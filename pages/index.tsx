import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import Auth from '../components/Auth';
import Account from '../components/Account';
import { Session } from '@supabase/supabase-js';
import { Flex } from '@chakra-ui/react';
export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <Flex align='center' justify='center' height='100vh'>
      {!session ? <Auth /> : <Account key={session?.user?.id} session={session} />}
    </Flex>
  );
}
