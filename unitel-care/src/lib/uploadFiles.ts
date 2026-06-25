import i18n from '@/i18n';
import { uploadService } from '@/services/uploadService';

export type UploadedFileType = {
  name: string;
  url?: string;
  type: string;
  path?: string;
  full_path?: string;
};

const isFile = (item: unknown): item is File => {
  return typeof File !== 'undefined' && item instanceof File;
};

export function uploadFiles(input: (File | UploadedFileType)[]): Promise<UploadedFileType[]>;
export function uploadFiles(input: File | UploadedFileType): Promise<UploadedFileType>;
export async function uploadFiles(
  input: File | UploadedFileType | (File | UploadedFileType)[]
): Promise<UploadedFileType | UploadedFileType[]> {
  const isArray = Array.isArray(input);
  const list = isArray ? input : [input];

  const results = await Promise.all(
    list.map(async (item) => {
      if (isFile(item)) {
        try {
          const res = await uploadService.uploadFile(item);
          return res as UploadedFileType;
        } catch {
          throw new Error(
            i18n.t('common.uploadFailed', {
              fileName: item.name,
            })
          );
        }
      }

      return item as UploadedFileType;
    })
  );

  return isArray ? results : results[0];
}
