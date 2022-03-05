import { supabase } from '../utils/supabaseClient';

export const StorageService = {
  upload,
  download,
};
/**
 * Downloads a file from specified bucket and path
 * @param bucket The bucket name that contains the file to be downloaded.
 * @param path  The file path to be downloaded, including the path and file name. For example folder/image.png
 * @returns
 */
async function download(bucket: string, path: string) {
  return supabase.storage.from(bucket).download(path);
}
/**
 * Uploads a file to specified bucket and path
 * @param bucket The bucket name that the file will be uploaded.
 * @param path The relative file path. Should be of the format folder/subfolder/filename.png. The bucket must already exist before attempting to upload.
 * @param fileBody — The body of the file to be stored in the bucket.
 * @returns
 */
async function upload(
  bucket: string,
  path: string,
  fileBody: string | File | Blob | ArrayBuffer | ArrayBufferView | Buffer | FormData | NodeJS.ReadableStream,
) {
  return supabase.storage.from(bucket).upload(path, fileBody);
}
