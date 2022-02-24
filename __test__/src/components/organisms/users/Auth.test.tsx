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
  it('should handle login', async () => {
    const user = userEvent.setup();
    const email = 'hal@example.com';
    //expect.assertions(2);
    const mockedLogin = jest.fn().mockResolvedValue(true);
    (useUser as jest.Mock).mockImplementation(() => ({
      userState: {
        loading: false,
        user: null,
        session: null,
      },
      handleLogin: mockedLogin,
    }));
    render(<Auth />);
    expect(screen.getByText('Find wonderful projects')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox'), email);
    await user.click(screen.getByText('Send magic link'));
    expect(mockedLogin).toBeCalledWith(email);
  });
});
