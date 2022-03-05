import React from 'react';
import { render, screen } from '@testing-library/react';
import Account from '../../../../components/organisms/users/Account';
import useUser from '../../../../hooks/useUser';
import { supabase } from '../../../../utils/supabaseClient';
import userEvent from '@testing-library/user-event';
jest.mock('../../../../hooks/useUser');
describe('Account component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.fn().mockRestore();
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
    // @ts-expect-error below line has expected ts compiling error but works.
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
    // restore spy method
    useStateSpy.mockRestore();
  });
  it('should call updateProfile with input data', async () => {
    expect.assertions(1);
    const user = userEvent.setup();
    // mock login method
    const mockedUpdateProfile = jest.fn().mockResolvedValue(true);
    (useUser as jest.Mock).mockImplementation(() => ({
      userState: {
        loading: false,
        user: null,
        session: null,
      },
      updateProfile: mockedUpdateProfile,
      getMyProfile: jest.fn(),
    }));
    supabase.auth.session = jest.fn();
    const session = supabase.auth.session();
    render(<Account session={session} />);
    await user.type(screen.getByLabelText('Name:'), 'Great Contributor');
    await user.type(screen.getByLabelText('Website:'), 'https://my.website/');
    await user.click(screen.getByText('Update'));
    expect(mockedUpdateProfile).toBeCalledWith({
      username: 'Great Contributor',
      website: 'https://my.website/',
      avatar_url: null,
    });
  });
});
