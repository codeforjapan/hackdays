import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import React from 'react';
import { Box, Heading, Stack, Text, Input } from '@chakra-ui/react';
import { PrimaryButton } from './atoms/button/PrimaryButton';
import { useT } from '@transifex/react';
import useUser from '../hooks/useUser';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { signInWithGithub } = useUser();

  const handleLogin = async (email: string) => {
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
  };
  const onClickLogin = () => {
    handleLogin(email);
  };
  const t = useT();
  return (
    <Box shadow='md' w='sm'>
      <Heading as='h1' size='lg' textAlign='center'>
        {t('Find wonderful projects')}
      </Heading>
      <Stack spacing={6} py={4} px={10}>
        <PrimaryButton onClick={signInWithGithub} loading={loading}>
          Login with GitHub
        </PrimaryButton>
      </Stack>
      <Text textAlign='center'> {t('Sign in via magic link with your email below')} </Text>
      <Stack spacing={6} py={4} px={10}>
        <Input
          className='inputField'
          type='email'
          placeholder={t('Your email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PrimaryButton onClick={onClickLogin} loading={loading}>
          {t('Send magic link')}
        </PrimaryButton>
      </Stack>
    </Box>
  );
}
