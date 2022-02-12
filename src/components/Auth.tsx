import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import React, { MouseEvent } from 'react';
import { Box, Heading } from '@chakra-ui/react';

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

  return (
    <Box shadow='md' w='sm'>
      <Heading as='h1' size='lg' textAlign='center'>
        Supabase + Next.js
      </Heading>
      <p className='description'> Sign in via magic link with your email below </p>
      <div className='col-6 form-widget'>
        <div>
          <input
            className='inputField'
            type='email'
            placeholder='Your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleLogin(email);
            }}
            className='button block'
            disabled={loading}
          >
            <span>{loading ? 'Loading' : 'Send magic link'} </span>
          </button>
        </div>
      </div>
    </Box>
  );
}
