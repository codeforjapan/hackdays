import { ApiError } from 'next/dist/server/api-utils';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import React, { MouseEvent } from 'react';

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
      if (error instanceof ApiError) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header"> Supabase + Next.js </h1>
        <p className="description">
          {' '}
          Sign in via magic link with your email below{' '}
        </p>
        <div>
          <input
            className="inputField"
            type="email"
            placeholder="Your email"
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
            className="button block"
            disabled={loading}
          >
            <span>{loading ? 'Loading' : 'Send magic link'} </span>
          </button>
        </div>
      </div>
    </div>
  );
}
