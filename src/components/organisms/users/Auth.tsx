import React from 'react';
import { Box, Heading, Stack, Text, Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { PrimaryButton } from '../../atoms/button/PrimaryButton';
import useUser from '../../../hooks/useUser';
import { useT } from '@transifex/react';
import { useForm, SubmitHandler } from 'react-hook-form';

export default function Auth() {
  const t = useT();
  const { userState, signInWithGithub, handleLogin } = useUser();
  type Inputs = {
    email: string;
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    handleLogin(data.email);
  };

  return (
    <Box shadow='md' w='sm'>
      <Heading as='h1' size='lg' textAlign='center'>
        {t('Find wonderful projects')}
      </Heading>
      <Stack spacing={6} py={4} px={10}>
        <PrimaryButton onClick={signInWithGithub} loading={userState.loading}>
          {t('Login with GitHub')}
        </PrimaryButton>
        <Text> {t('Sign in via magic link with your email below')} </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={errors.email != null}>
            <FormLabel htmlFor='email'>{t('Your email')}</FormLabel>
            <Input
              id='email'
              placeholder='hoge@example.com'
              {...register('email', { required: t('This is required') })}
            />
            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
            <PrimaryButton loading={isSubmitting} type='submit' disabled={isSubmitting}>
              {t('Send magic link')}
            </PrimaryButton>
          </FormControl>
        </form>
      </Stack>
    </Box>
  );
}
