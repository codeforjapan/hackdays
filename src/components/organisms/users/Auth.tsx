import { useState } from 'react';
import React from 'react';
import { Box, Heading, Stack, Text, Input } from '@chakra-ui/react';
import { PrimaryButton } from '../../atoms/button/PrimaryButton';
import useUser from '../../../hooks/useUser';
import { t } from '../../../utils/commonTools';
export default function Auth() {
  const [email, setEmail] = useState('');
  const { signInWithGithub, handleLogin, loading } = useUser();

  const onClickLogin = () => {
    handleLogin(email);
  };
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
