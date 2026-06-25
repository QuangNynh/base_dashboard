type UploadedFile = {
  name: string;
  url?: string;
  type: string;
  path?: string;
  full_path?: string;
};

class UploadService {
  async uploadFile(file: File): Promise<UploadedFile> {
    const fakePath = `https://fake-s3-storage.example.com/uploads/${Date.now()}_${file.name}`;
    return {
      name: file.name,
      url: fakePath,
      type: file.type || 'application/octet-stream',
      path: fakePath,
      full_path: fakePath,
    };
  }
}

export const uploadService = new UploadService();
