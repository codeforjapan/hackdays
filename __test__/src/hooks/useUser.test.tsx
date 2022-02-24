import { renderHook, act } from '@testing-library/react-hooks';
import useUser from '../../../src/hooks/useUser';
import { supabase } from '../../../src/utils/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../../../src/services/users.service';

describe('useUser', () => {
  beforeEach(() => {
    window.alert = jest.fn(); // disable alert function
  });
  it('should call auth.signin with GitHub', () => {
    expect.assertions(1);
    const { result } = renderHook(() => useUser());
    supabase.auth.signIn = jest.fn();
    act(() => {
      result.current.signInWithGithub();
    });
    expect(supabase.auth.signIn).toBeCalledWith({ provider: 'github' });
  });
  it('should call signout method', () => {
    expect.assertions(1);
    const { result } = renderHook(() => useUser());
    supabase.auth.signOut = jest.fn();
    act(() => {
      result.current.signOut();
    });
    expect(supabase.auth.signOut).toBeCalled();
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
  it('should return error when the user does not logged in', async () => {
    // mock function for error return
    supabase.auth.user = jest.fn().mockReturnValue(null);
    const { result } = renderHook(() => useUser());
    let errorResult = false;
    await act(async () => {
      try {
        // this method should be failed
        await result.current.getMyProfile();
      } catch {
        errorResult = true;
      }
    });
    expect(supabase.auth.user.call.length).toEqual(1);
    expect(errorResult).toEqual(true);
  });

  it('should return my profile', async () => {
    expect.assertions(1);
    // generate logged in user
    supabase.auth.user = jest.fn().mockReturnValue({ id: uuidv4() });
    // mock function returning dummy user
    UserService.getUser = jest.fn().mockResolvedValue({
      username: 'myusername',
      website: 'https://test.com',
      avatar_url: 'https://avatar.com/',
    });
    const { result } = renderHook(() => useUser());
    await act(async () => {
      // get my profile
      await result.current.getMyProfile();
      expect(result.current.userState.user.username).toEqual('myusername');
    });
  });
  it('should return specific profile', async () => {
    expect.assertions(1);
    const uuid = uuidv4();
    const { result } = renderHook(() => useUser());
    // dummy function returning fake user
    UserService.getUser = jest.fn().mockResolvedValue({
      username: 'myusername',
      website: 'https://test.com',
      avatar_url: 'https://avatar.com/',
    });
    await act(async () => {
      // get speficic user by id
      await result.current.getProfile(uuid);
      expect(result.current.userState.user).toEqual({
        username: 'myusername',
        website: 'https://test.com',
        avatar_url: 'https://avatar.com/',
      });
    });
  });
  it('should raise Error when user is not found', async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useUser());
    // dummy function returning fake user
    UserService.getUser = jest.fn().mockRejectedValue('user not found');
    let errorResult = false;
    await act(async () => {
      // get speficic user by id
      try {
        await result.current.getProfile('nodata');
      } catch {
        errorResult = true;
      }
      expect(errorResult).toBe(true);
    });
  });

  it('should update profile', async () => {
    expect.assertions(1);
    supabase.auth.user = jest.fn().mockReturnValue({ id: uuidv4() });
    // dummy function updating user
    UserService.updateUser = jest.fn().mockResolvedValue(true);
    const { result } = renderHook(() => useUser());
    let errorResult = false;
    await act(async () => {
      // run update hook
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
    // update should not be failed
    expect(errorResult).toEqual(false);
  });
  it('should raise Error when user update failed', async () => {
    expect.assertions(1);
    const { result } = renderHook(() => useUser());
    // dummy function returning fake user
    UserService.updateUser = jest.fn().mockRejectedValue('update failed');
    let errorResult = false;
    await act(async () => {
      // get speficic user by id
      try {
        await result.current.updateProfile({
          username: 'bad user',
          website: 'https://new.website/',
          avatar_url: 'avatar_url_data',
        });
      } catch {
        errorResult = true;
      }
      expect(errorResult).toBe(true);
    });
  });
});
