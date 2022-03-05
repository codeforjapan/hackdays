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
    expect.assertions(1);
    const mockedUpload = jest.fn();
    // mock useAvatar hook
    (useAvatar as jest.Mock).mockImplementation(() => ({
      state: {
        uploading: false,
        avatarUrl: '',
      },
    }));
    render(<Avatar url='' onUpload={mockedUpload} size={150} />);
    // the profile image should be default
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Default Avatar');
  });
  it('should upload new image', async () => {
    expect.assertions(1);
    const mockedUpload = jest.fn();
    // mock the custom hook
    (useAvatar as jest.Mock).mockImplementation(() => ({
      state: {
        uploading: false,
        avatarUrl: '',
      },
      uploadAndSetUrl: mockedUpload,
    }));
    const user = userEvent.setup();
    render(<Avatar url='' onUpload={mockedUpload} size={150} />);
    // upload a new avatar
    const file = new File(['hello'], '../../../../../public/images/cat.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Upload'), file);
    expect(mockedUpload).toBeCalled();
  });
});
