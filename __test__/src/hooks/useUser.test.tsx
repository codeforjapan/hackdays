import { renderHook, act } from '@testing-library/react-hooks';
import useUser from '../../../src/hooks/useUser';
import { supabase } from '../../../src/utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { waitFor } from '@testing-library/react';
import { UserService } from '../../../src/services/users.service';

describe('useUser', () => {
  beforeEach(() => {
    window.alert = jest.fn(); // disable alert function
  });
  it('should handle login', async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useUser());
    const mockSignIn = jest.fn().mockResolvedValue('success');
    supabase.auth.signIn = mockSignIn;

    // handle login with email
    await act(async () => {
      result.current.handleLogin('hal@example.com');
    });

    expect(mockSignIn.call.length).toEqual(1);
  });
  it('should return my profile', async () => {
    supabase.auth.user = jest.fn().mockReturnValue({ id: uuidv4() });
    UserService.getUser = jest.fn().mockResolvedValue({ data: { username: 'myusername' } });
    const { result } = renderHook(() => useUser());
    await act(async () => {
      result.current.getMyProfile();
    });
    await waitFor(() => {
      expect(result.current.user.username).toEqual('myusername');
    });
  });
  /**
   * username, website, avatar_url
   */
  it('should update profile', async () => {
    expect.assertions(1);
    supabase.auth.user = jest.fn().mockReturnValue({ id: uuidv4() });
    UserService.updateUser = jest.fn().mockResolvedValue(true);
    const { result } = renderHook(() => useUser());
    let errorResult = false;
    await act(async () => {
      await result.current
        .updateProfile({
          username: 'newuser',
          website: 'https://new.website/',
          avatar_url: 'avatar_url_data',
        })
        .catch(() => {
          errorResult = true;
        });
    });
    expect(errorResult).toEqual(false);
  });
});
