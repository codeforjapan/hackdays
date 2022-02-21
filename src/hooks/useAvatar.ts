import { useState, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function useAvatar({ onUpload }: { onUpload: (url: string) => void }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setUploading] = useState(false);
  const downloadAvatar = useCallback(async (path: string) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
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
    }
  }, []);

  const uploadAvatar = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      onUpload(filePath);
      downloadAvatar(filePath);
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    } finally {
      setUploading(false);
    }
  }, []);
  return {
    avatarUploading,
    avatarUrl,
    downloadAvatar,
    uploadAvatar,
  };
}
