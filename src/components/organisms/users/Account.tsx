import { useState, useEffect } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { Box, Stack, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { PrimaryButton } from '../../atoms/button/PrimaryButton';
import Avatar from './Avatar';
import useUser, { UpdateUserParam } from '../../../hooks/useUser';

export default function Account({ session }: { session: Session }) {
  // const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const { getMyProfile, updateProfile, loading, user } = useUser();
  useEffect(() => {
    getMyProfile();
  }, [session]);
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setWebsite(user.website);
      if (user.avatar_url) {
        setAvatarUrl(user.avatar_url);
      }
    }
  }, [user]);
  function clickUpdate(data: UpdateUserParam) {
    updateProfile(data).catch((error: Error) => {
      alert(error);
    });
  }

  return (
    <Box shadow='md'>
      <Stack spacing={4} py={4} px={10}>
        <Avatar
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url);
            updateProfile({ username, website, avatar_url: url });
          }}
        />
        <FormControl>
          <FormLabel htmlFor='email'>Email:</FormLabel>
          <Input id='email' type='text' value={session?.user?.email} disabled />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor='username'>Name:</FormLabel>
          <Input id='username' type='text' value={username || ''} onChange={(e) => setUsername(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor='website'>Website:</FormLabel>
          <Input id='website' type='website' value={website || ''} onChange={(e) => setWebsite(e.target.value)} />
        </FormControl>
        <PrimaryButton onClick={() => clickUpdate({ username, website, avatar_url })} disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </PrimaryButton>
        <Button className='button block' onClick={() => supabase.auth.signOut()}>
          Sign Out
        </Button>
      </Stack>
    </Box>
  );
}
