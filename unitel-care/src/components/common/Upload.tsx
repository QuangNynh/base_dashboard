import CloudIcon from '@/assets/icons/CloudIcon';
import { cn } from '@/lib/utils';
import { FileIcon, Trash2 } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { TooltipCustom } from './TooltipCustom';

export interface UploadedFile {
  fileName: string;
  url: string;
  fileType: string;
}

export type UploadItem = File | UploadedFile;

function isUploadedFile(item: UploadItem): item is UploadedFile {
  return !(item instanceof File);
}

interface UploadPropsBase {
  className?: string;
  accept?: string;
  disabled?: boolean;
  maxFiles?: number;
  maxSize?: number; // bytes
}

interface UploadPropsSingle extends UploadPropsBase {
  multiple?: false;
  value?: UploadItem | null;
  onChange?: (file: UploadItem | null) => void;
}

interface UploadPropsMultiple extends UploadPropsBase {
  multiple: true;
  value?: UploadItem[];
  onChange?: (files: UploadItem[]) => void;
}

type UploadProps = UploadPropsSingle | UploadPropsMultiple;

const Upload: React.FC<UploadProps> = ({
  value,
  onChange,
  className,
  accept = '*/*',
  disabled = false,
  multiple = false,
  maxFiles = 10,
  maxSize,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const currentFiles: UploadItem[] = multiple
    ? ((value as UploadItem[] | undefined) ?? [])
    : value
      ? [value as UploadItem]
      : [];

  const handleFileSelect = (files: FileList) => {
    if (!files.length || disabled) return;

    const incoming = Array.from(files);

    // Check file format validation
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map((type) => type.trim());
      const invalidFile = incoming.find((file) => {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const mimeType = file.type;

        return !acceptedTypes.some((acceptType) => {
          if (acceptType.startsWith('.')) {
            return fileExtension === acceptType.toLowerCase();
          } else if (acceptType.includes('*')) {
            const baseType = acceptType.split('/')[0];
            return mimeType.startsWith(baseType);
          } else {
            return mimeType === acceptType;
          }
        });
      });

      if (invalidFile) {
        toast.error(
          t('common.uploadInvalidFormat', {
            format: acceptedTypes.map((type) => type.replace('.', '')).join(', '),
          })
        );
        return;
      }
    }

    if (maxSize !== undefined) {
      const oversized = incoming.find((f) => f.size > maxSize);
      if (oversized) {
        const mb = (maxSize / (1024 * 1024)).toFixed(0);
        toast.error(t('common.uploadMaxSize', { max: mb }));
        return;
      }
    }

    // ✅ SINGLE
    if (!multiple) {
      (onChange as UploadPropsSingle['onChange'])?.(incoming[0]); // giữ nguyên File
      return;
    }

    // ✅ MULTIPLE
    if (maxFiles !== undefined) {
      const total = currentFiles.length + incoming.length;
      if (total > maxFiles) {
        toast.error(t('common.uploadMaxFiles', { max: maxFiles }));
        return;
      }
    }

    (onChange as UploadPropsMultiple['onChange'])?.([...currentFiles, ...incoming]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFileSelect(e.target.files);
      e.target.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleRemove = (index: number) => {
    if (!multiple) {
      (onChange as UploadPropsSingle['onChange'])?.(null);
      return;
    }

    const updated = (currentFiles as UploadItem[]).filter((_, i) => i !== index);
    (onChange as UploadPropsMultiple['onChange'])?.(updated);
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const getFileName = (item: UploadItem) => (item instanceof File ? item.name : item.fileName);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <button
        type='button'
        onClick={handleClick}
        disabled={disabled || currentFiles.length >= maxFiles}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'inline-flex w-fit items-center gap-2 px-4 py-2 rounded-md border border-dashed border-primary',
          'text-primary text-sm font-medium bg-transparent',
          'hover:bg-primary/5 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isDragging && 'bg-primary/10'
        )}
      >
        <CloudIcon className='w-4 h-4' />
        {t('common.uploadFile')}
      </button>

      <input
        ref={fileInputRef}
        type='file'
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className='hidden'
        disabled={disabled}
      />

      {currentFiles.length > 0 && (
        <ul className='flex flex-col gap-1'>
          {currentFiles.map((file, index) => (
            <li key={index} className='flex items-center gap-2 text-sm text-gray-600'>
              {isUploadedFile(file) && file.url ? (
                <a
                  href={file.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 flex-1 min-w-0 hover:underline'
                >
                  <FileIcon className='w-4 h-4 shrink-0 text-gray-400' />
                  <TooltipCustom content={getFileName(file)}>
                    <span className='line-clamp-1'>{getFileName(file)}</span>
                  </TooltipCustom>
                </a>
              ) : (
                <>
                  <FileIcon className='w-4 h-4 shrink-0 text-gray-400' />
                  <TooltipCustom content={getFileName(file)}>
                    <span className='flex-1 line-clamp-1'>{getFileName(file)}</span>
                  </TooltipCustom>
                </>
              )}

              <Button
                variant={'icon'}
                type='button'
                onClick={() => handleRemove(index)}
                disabled={disabled}
              >
                <Trash2 className='w-4 h-4 text-destructive' />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Upload;
