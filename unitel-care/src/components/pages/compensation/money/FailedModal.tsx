import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FailedModalProps {
  open: boolean;
  compensationCode?: string;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void | Promise<void>;
}

const FailedModal = ({
  open,
  compensationCode,
  isSubmitting = false,
  onOpenChange,
  onConfirm,
}: FailedModalProps) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (!open) {
      setReason('');
      setShowError(false);
    }
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setShowError(true);
      return;
    }
    onConfirm(trimmedReason);
  };

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
            {t('compensation.moneyModal.failedDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className='px-6 pt-5 pb-6'>
          <div className='mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-primary'>
            <Bell className='h-12 w-12 text-white' strokeWidth={2} />
          </div>

          <p className='text-center text-[15px] leading-[22px] text-[#44494D]'>
            {t('compensation.moneyModal.confirmPaidFailed')} <br />
            <span className='font-semibold'>{compensationCode || '--'}</span>?
          </p>
          <p className='mt-1 text-center text-[15px] leading-[22px] text-[#44494D]'>
            {t('compensation.moneyModal.confirmPaidFailedNote')}
          </p>

          <div className='mt-4'>
            <label className='mb-2 block text-[15px] leading-none text-[#44494D]'>
              {t('compensation.moneyModal.failedReasonLabel')}{' '}
              <span className='text-destructive'>*</span>
            </label>
            <Textarea
              value={reason}
              onChange={(event) => {
                setReason(event.target.value);
                if (showError) setShowError(false);
              }}
              placeholder={t('compensation.moneyModal.failedReasonPlaceholder')}
              className='min-h-[74px] text-[15px] border-[#D7D9DF] shadow-none focus-visible:ring-0 focus-visible:border-primary'
            />
            {showError && (
              <p className='mt-1 text-xs text-destructive'>
                {t('compensation.moneyModal.failedReasonRequired')}
              </p>
            )}
          </div>
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

export default FailedModal;
