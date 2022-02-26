import React, { Dispatch } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Account from '../../../../../src/components/organisms/users/Account';
import useUser from '../../../../../src/hooks/useUser';
import { supabase } from '../../../../../src/utils/supabaseClient';
jest.mock('../../../../../src/hooks/useUser');
describe('Account component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should call getMyProfile', async () => {
    expect.assertions(1);
    // mock login method
    const mockedGetMyProfile = jest.fn().mockResolvedValue(true);
    (useUser as jest.Mock).mockImplementation(() => ({
      userState: {
        loading: false,
        user: null,
        session: null,
      },
      getMyProfile: mockedGetMyProfile,
    }));
    supabase.auth.session = jest.fn();
    const session = supabase.auth.session();
    render(<Account session={session} />);
    expect(mockedGetMyProfile).toBeCalled();
    // welcome message should be displayed
    // expect(screen.getByText('Find wonderful projects')).toBeInTheDocument();
  });
  it('should display retrieved profile', async () => {
    expect.assertions(4);
    // mock login method
    const mockedGetMyProfile = jest.fn().mockResolvedValue(true);
    // return dummy userState
    (useUser as jest.Mock).mockImplementation(() => ({
      userState: {
        loading: false,
        user: {
          username: 'hoge',
          website: 'https://example.com',
        },
        session: null,
      },
      getMyProfile: mockedGetMyProfile,
    }));
    supabase.auth.session = jest.fn().mockReturnValue({
      user: { email: 'hal@example.com' },
    });
    const session = supabase.auth.session();
    render(<Account session={session} />);
    expect(mockedGetMyProfile).toBeCalled();
    // user's properties should be displayed
    expect(screen.getByLabelText('Email:')).toHaveValue('hal@example.com');
    expect(screen.getByLabelText('Name:')).toHaveValue('hoge');
    expect(screen.getByLabelText('Website:')).toHaveValue('https://example.com');
  });
  it('should set Avatar url', async () => {
    const setState = jest.fn();
    const useStateSpy = jest.spyOn(React, 'useState');
    useStateSpy.mockImplementation((initialState) => [initialState, setState]);
    expect.assertions(2);
    // mock login method
    const mockedGetMyProfile = jest.fn().mockResolvedValue(true);
    // return dummy userState
    (useUser as jest.Mock).mockImplementation(() => ({
      userState: {
        loading: false,
        user: {
          username: 'hoge',
          website: 'https://example.com',
          avatar_url: 'https://avatar_url/',
        },
        session: null,
      },
      getMyProfile: mockedGetMyProfile,
    }));
    supabase.auth.session = jest.fn().mockReturnValue({
      user: { email: 'hal@example.com' },
    });
    const session = supabase.auth.session();
    render(<Account session={session} />);
    expect(useStateSpy).toBeCalled();
    expect(setState).toBeCalledWith('https://avatar_url/');
  });
});
