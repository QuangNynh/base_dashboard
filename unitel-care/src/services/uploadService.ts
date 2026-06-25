import api from '@/config/axios';
import axios, { AxiosError } from 'axios';

type UploadedFile = {
  name: string;
  url?: string;
  type: string;
  path?: string;
  full_path?: string;
};
class UploadService {
  async uploadFile(file: File): Promise<UploadedFile> {
    // 1. Lấy presigned URL
    const { data } = await api.get<UploadedFile>(
      `${import.meta.env.VITE_APP_BASE_URL_TMS}/global-storage/api/v1/storage/upload/presigned-url`,
      {
        params: {
          file_name: file.name,
          content_type: file.type || 'application/octet-stream',
        },
      }
    );

    if (!data?.url) throw new Error('Không lấy được presigned URL');
    try {
      await axios.put(data.url, file, {
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*',
        },
      });
      return data;
    } catch (err: unknown) {
      const error = err as AxiosError;

      // ❗ CORS / Network (không có response)
      if (!error.response) {
        throw new Error('S3_NETWORK_ERROR');
      }

      // ❗ Có response nhưng fail
      throw new Error(`S3_UPLOAD_FAILED_${error.response.status}`);
    }
  }
}

export const uploadService = new UploadService();
