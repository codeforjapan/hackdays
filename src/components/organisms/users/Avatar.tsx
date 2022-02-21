import { useEffect } from 'react';
import Image from 'next/image';
import useAvatar from '../../../hooks/useAvatar';

export default function Avatar({
  url,
  size,
  onUpload,
}: {
  url: string | null;
  size: number;
  onUpload: (url: string) => void;
}) {
  const { avatarUrl, avatarUploading, uploadAvatar, downloadAvatar } = useAvatar({ onUpload });
  useEffect(() => {
    if (url) downloadAvatar(url);
  }, [url]);
  function fileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      throw new Error('You must select an image to upload.');
    }

    uploadAvatar(event.target.files[0]);
  }
  return (
    <div>
      {avatarUrl ? (
        <Image src={avatarUrl} alt='Avatar' className='avatar image' width={size} height={size} />
      ) : (
        <Image src='/images/cat.png' className='avatar no-image' height={size} width={size} />
      )}
      <div style={{ width: size }}>
        <label className='button primary block' htmlFor='single'>
          {avatarUploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type='file'
          id='single'
          accept='image/*'
          onChange={fileUpload}
          disabled={avatarUploading}
        />
      </div>
    </div>
  );
}
