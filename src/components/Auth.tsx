import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import React from 'react';
import { Box, Heading, Stack, Text, Input } from '@chakra-ui/react';
import { PrimaryButton } from './atoms/button/PrimaryButton';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

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
  return (
    <Box shadow='md' w='sm'>
      <Heading as='h1' size='lg' textAlign='center'>
        Supabase + Next.js
      </Heading>
      <Text textAlign='center'> Sign in via magic link with your email below </Text>
      <Stack spacing={6} py={4} px={10}>
        <Input
          className='inputField'
          type='email'
          placeholder='Your email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PrimaryButton onClick={onClickLogin} loading={loading}>
          Send magic link
        </PrimaryButton>
      </Stack>
    </Box>
  );
}
