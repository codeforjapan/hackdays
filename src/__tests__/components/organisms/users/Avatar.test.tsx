import { render, screen } from '@testing-library/react';
import Avatar from '../../../../components/organisms/users/Avatar';
import userEvent from '@testing-library/user-event';
import useAvatar from '../../../../hooks/useAvatar';
jest.mock('../../../..//hooks/useAvatar');

describe('Avatar test', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.fn().mockRestore();
  });
  it('should show default avatar', async () => {
    const mockedUpload = jest.fn();
    (useAvatar as jest.Mock).mockImplementation(() => ({
      state: {
        uploading: false,
        avatarUrl: '',
      },
    }));
    expect.assertions(1);
    render(<Avatar url='' onUpload={mockedUpload} size={150} />);
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Default Avatar');
  });
  it('should upload new image', async () => {
    const mockedUpload = jest.fn();
    (useAvatar as jest.Mock).mockImplementation(() => ({
      state: {
        uploading: false,
        avatarUrl: '',
      },
      uploadAvatar: mockedUpload,
    }));
    expect.assertions(1);
    const user = userEvent.setup();
    render(<Avatar url='' onUpload={mockedUpload} size={150} />);
    const file = new File(['hello'], '../../../../../public/images/cat.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Upload'), file);
    expect(mockedUpload).toBeCalled();
  });
});
