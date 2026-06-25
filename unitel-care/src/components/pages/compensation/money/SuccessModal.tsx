import CloudIcon from '@/assets/icons/CloudIcon';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Bell, Loader2, Paperclip, Trash2, X } from 'lucide-react';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SuccessModalProps {
  open: boolean;
  compensationCode?: string;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (files: File[]) => void | Promise<void>;
}

const SuccessModal = ({
  open,
  compensationCode,
  isSubmitting = false,
  onOpenChange,
  onConfirm,
}: SuccessModalProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [showError, setShowError] = useState(false);

  const handlePickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const pickedFiles = Array.from(event.target.files ?? []);
    if (!pickedFiles.length) return;
    setFiles((prev) => [...prev, ...pickedFiles]);
    event.target.value = '';
  };

  const handleClose = () => {
    onOpenChange(false);
    setFiles([]);
    setShowError(false);
  };

  const handleConfirm = () => {
    if (!files.length) {
      setShowError(true);
      return;
    }
    onConfirm(files);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
  };

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setShowError(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='!max-w-[780px] p-0 gap-0 overflow-hidden rounded-2xl border-0'
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className='relative flex h-[72px] items-center justify-center bg-[#EEF0F5] px-6'>
          <DialogTitle className='text-[17px] leading-none font-semibold text-[#44494D]'>
            {t('compensation.moneyModal.title')}
          </DialogTitle>
          <button
            type='button'
            onClick={handleClose}
            className='absolute right-6 top-1/2 -translate-y-1/2 text-[#8F9294] hover:opacity-80'
            aria-label='Close'
          >
            <X className='h-8 w-8' />
          </button>
          <DialogDescription className='sr-only'>
            {t('compensation.moneyModal.successDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className='px-6 pt-5 pb-6'>
          <div className='mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-primary'>
            <Bell className='h-12 w-12 text-white' strokeWidth={2} />
          </div>

          <p className='text-center text-[15px] leading-[22px] text-[#44494D]'>
            {t('compensation.moneyModal.confirmPaid')} <br />
            <span className='font-semibold'>{compensationCode || '--'}</span>?
          </p>
          <p className='mt-1 text-center text-[15px] leading-[22px] text-[#44494D]'>
            {t('compensation.moneyModal.confirmPaidNote')}
          </p>

          <button
            type='button'
            onClick={() => inputRef.current?.click()}
            className={cn(
              'mt-6 w-full h-[190px] rounded-md border border-dashed border-primary bg-[#F8F3E4]',
              'flex flex-col items-center justify-center gap-3 transition-colors hover:bg-[#F5EFD8]'
            )}
          >
            <CloudIcon className='h-20 w-20 text-primary' />
            <span className='text-[15px] leading-none font-semibold text-[#1F1F1F]'>
              {t('compensation.moneyModal.uploadSignedFile')}
            </span>
          </button>
          {showError && !files?.length && (
            <p className='mt-1 text-xs text-destructive'>
              {t('compensation.moneyModal.successFileRequired')}
            </p>
          )}

          <input
            ref={inputRef}
            type='file'
            multiple
            accept='.xlsx,.xls,.pdf,.doc,.docx'
            className='hidden'
            onChange={handlePickFile}
          />

          {files.length > 0 && (
            <div className='mt-5 space-y-2 max-h-64 overflow-y-auto'>
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${file.size}-${index}`}
                  className='flex items-center justify-between gap-3 text-[15px] leading-none text-[#565B60]'
                >
                  <div className='flex items-center gap-2 min-w-0'>
                    <Paperclip className='h-5 w-5 text-[#8f9294] shrink-0' />
                    <span className='line-clamp-1'>{file.name}</span>
                  </div>
                  <button
                    type='button'
                    onClick={() => handleRemoveFile(index)}
                    className='shrink-0'
                  >
                    <Trash2 className='h-6 w-6 text-[#f1003e]' />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className='grid grid-cols-2 gap-4 px-6 pb-6 pt-1'>
          <Button
            variant='outline'
            className='h-14 rounded-xl border-primary text-primary hover:text-primary text-[15px] font-semibold'
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button
            className='h-14 rounded-xl bg-primary hover:bg-primary/90 text-white text-[15px] font-semibold'
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {t('common.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
