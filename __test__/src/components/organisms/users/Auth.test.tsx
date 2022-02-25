import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import Auth from '../../../../../src/components/organisms/users/Auth';
import useUser from '../../../../../src/hooks/useUser';
jest.mock('../../../../../src/hooks/useUser');

describe('Auth component', () => {
  beforeEach(() => {
    window.alert = jest.fn(); // disable alert function
  });
  it('should call login method with email address', async () => {
    const user = userEvent.setup();
    const email = 'hal@example.com';
    expect.assertions(2);
    // mock login method
    const mockedLogin = jest.fn().mockResolvedValue(true);
    // mock useUser hook
    (useUser as jest.Mock).mockImplementation(() => ({
      userState: {
        loading: false,
        user: null,
        session: null,
      },
      handleLogin: mockedLogin,
    }));
    render(<Auth />);
    // welcome message should be displayed
    expect(screen.getByText('Find wonderful projects')).toBeInTheDocument();
    // enter email and click login
    await user.type(screen.getByRole('textbox'), email);
    await user.click(screen.getByText('Send magic link'));
    expect(mockedLogin).toBeCalledWith(email);
  });
  it('should call signInWithGitHub method', async () => {
    const user = userEvent.setup();
    expect.assertions(1);
    // mock login method
    // mock useUser hook
    const mockedLogin = jest.fn().mockResolvedValue(true);
    (useUser as jest.Mock).mockImplementation(() => ({
      userState: {
        loading: false,
        user: null,
        session: null,
      },
      signInWithGithub: mockedLogin,
    }));
    render(<Auth />);
    // click GitHub login
    await user.click(screen.getByText('Login with GitHub'));
    expect(mockedLogin).toBeCalled();
  });
});
