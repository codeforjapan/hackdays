import { useState, useCallback } from 'react';
import { StorageService } from '../services/storage.service';

/**
 * useAvatar is a custom hook of uploading/downloading avatar images
 * @param onUpload an event handler called after uploading a new file
 * @returns
 */
export default function useAvatar({ onUpload }: { onUpload: (url: string) => void }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const state = {
    avatarUrl: avatarUrl,
    uploading: avatarUploading,
    uploadSuccess: uploadSuccess,
  };
  /**
   * download Avatar
   * @param path path of the avatar
   */
  const downloadAvatar = useCallback(async (path: string) => {
    try {
      const { data, error } = await StorageService.download('avatars', path);
      if (error) {
        throw error;
      }
      if (data == null) {
        throw new Error('data was null');
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      if (error instanceof Error) console.log('Error downloading image: ', error.message);
      throw error;
    }
  }, []);
  /**
   * upload a new Avatar
   * @param file a file to upload
   */
  const uploadAvatar = useCallback(async (file: File) => {
    return _uploadAvatar(file);
  }, []);
  async function _uploadAvatar(file: File) {
    try {
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      // @todo this path should be unique by user for avoiding unexpected override
      const filePath = `${fileName}`;

      const { error: uploadError } = await StorageService.upload('avatars', filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      onUpload(filePath);
      setUploadSuccess(true);
      return filePath;
    } catch (error) {
      if (error instanceof Error) console.log('Error uploading image: ', error.message);
      throw error;
    } finally {
      setUploading(false);
    }
  }
  /**
   * upload a new file and set new URL of uploaded file
   * @param file a file to upload
   */
  const uploadAndSetUrl = useCallback(async (file: File) => {
    _uploadAvatar(file).then((filePath: string | undefined) => {
      if (filePath) downloadAvatar(filePath);
    });
  }, []);
  return {
    state,
    downloadAvatar,
    uploadAvatar,
    uploadAndSetUrl,
  };
}
