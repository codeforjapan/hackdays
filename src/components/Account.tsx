import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Box, Stack, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Button } from '@chakra-ui/react';
import { PrimaryButton } from './atoms/button/PrimaryButton';

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
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
      if (error instanceof Error) alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box shadow='md'>
      <Stack spacing={4} py={4} px={10}>
        <FormControl>
          <FormLabel htmlFor='email'>Email</FormLabel>
          <Input id='email' type='text' value={session?.user?.email} disabled />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor='username'>Name</FormLabel>
          <Input id='username' type='text' value={username || ''} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor='website'>Website</FormLabel>
          <Input id='website' type='website' value={website || ''} onChange={(e) => setWebsite(e.target.value)} />
        </FormControl>

        <PrimaryButton onClick={() => updateProfile({ username, website, avatar_url })} disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </PrimaryButton>

        <Button className='button block' onClick={() => supabase.auth.signOut()}>
          Sign Out
        </Button>
      </Stack>
    </Box>
  );
}
