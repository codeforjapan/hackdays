import { renderHook, act } from '@testing-library/react-hooks';
import useAvatar from '../../hooks/useAvatar';
import { StorageService } from '../../services/storage.service';

describe('useAvatar test', () => {
  it('should upload a new image', async () => {
    expect.assertions(2);
    // load test file
    const file = new File(['hello'], '../../../../../public/images/cat.png', { type: 'image/png' });
    // create mocking function for uploading file
    const mockedUpload = jest.fn().mockResolvedValue({
      data: {
        key: 'file',
      },
    });
    // create onUpload event handler
    const mockedOnUpload = jest.fn();
    // custom hook object
    const { result } = renderHook(() => useAvatar({ onUpload: mockedOnUpload }));
    // set mocked function
    StorageService.upload = mockedUpload;
    // call uploadAvatar
    await act(async () => {
      result.current.uploadAvatar(file);
    });
    expect(mockedUpload).toBeCalled();
    expect(result.current.state.uploadSuccess).toBe(true);
  });
  it('should download specified image', async () => {
    expect.assertions(1);
    // mock downaload function
    const mockedDownload = jest.fn();
    // custom hook
    const { result } = renderHook(() => useAvatar({ onUpload: jest.fn() }));
    // set mocked function
    StorageService.download = mockedDownload;
    // call downloadAvatar
    await act(async () => {
      result.current.downloadAvatar('test/avatar.png');
    });
    // download method should be called
    expect(mockedDownload).toBeCalled();
  });
  it('should upload a new image and set a new URL of the image', async () => {
    expect.assertions(2);
    // load file
    const file = new File(['hello'], '../../../../../public/images/cat.png', { type: 'image/png' });
    // blob data of the file
    const blob = new Blob(['testing'], { type: 'image/png' });
    // mock upload function
    const mockedUpload = jest.fn().mockResolvedValue({
      data: {
        key: 'file',
      },
    });
    // onUpload handler
    const mockedOnUpload = jest.fn();
    // mock URL.createObjectURL because it is failed on test
    URL.createObjectURL = jest.fn().mockReturnValue('myobjecturl');
    // custom hook
    const { result } = renderHook(() => useAvatar({ onUpload: mockedOnUpload }));
    // set mocked function
    StorageService.upload = mockedUpload;
    // mock download function
    StorageService.download = jest.fn().mockResolvedValue({ data: blob });
    // call uploadAndSetUrl
    await act(async () => {
      result.current.uploadAndSetUrl(file);
    });
    // mockUpload hander should be called
    expect(mockedUpload).toBeCalled();
    // avatarURL should be set
    expect(result.current.state.avatarUrl).toBe('myobjecturl');
  });
});
