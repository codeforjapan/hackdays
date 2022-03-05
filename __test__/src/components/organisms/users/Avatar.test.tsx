import { render, screen } from '@testing-library/react';
import Avatar from '../../../../../src/components/organisms/users/Avatar';
import userEvent from '@testing-library/user-event';
import useAvatar from '../../../../../src/hooks/useAvatar';

describe('Avatar test', () => {
  it('should show default avatar', async () => {
    const mockedUpload = jest.fn();
    expect.assertions(1);
    render(<Avatar url='' onUpload={mockedUpload} size={150} />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Default Avatar');
  });
  it.skip('should upload new image', async () => {
    jest.mock('../../../../../src/hooks/useAvatar');
    const mockedUpload = jest.fn();
    (useAvatar as jest.Mock).mockImplementation(() => ({
      state: {
        loading: false,
        avatarUrl: '',
      },
    }));
    expect.assertions(1);
    const user = userEvent.setup();
    render(<Avatar url='' onUpload={mockedUpload} size={150} />);
    const file = new File(['hello'], '../../../../../public/images/cat.png', { type: 'image/png' });
    user.upload(screen.getByLabelText('Upload'), file);
    expect(mockedUpload).toBeCalled();
  });
});
