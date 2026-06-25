import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type DeleteType = 'detail' | 'group';

interface ModalDeleteDetailErrorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (type: DeleteType) => void;
  isLoading?: boolean;
  defaultType?: DeleteType;
}

export default function ModalDeleteDetailError({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  defaultType = 'detail',
}: ModalDeleteDetailErrorProps) {
  const { t } = useTranslation();
  const [deleteType, setDeleteType] = useState<DeleteType>(defaultType);

  const options: Array<{ value: DeleteType; label: string }> = [
    { value: 'detail', label: t('violationReport.errorDetail.delete.detailOption') },
    { value: 'group', label: t('violationReport.errorDetail.delete.groupOption') },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) setDeleteType(defaultType);
      }}
    >
      <DialogContent
        className='max-w-[760px] p-0 gap-0 overflow-hidden rounded-2xl border-0'
        showCloseButton={false}
      >
        <DialogHeader className='relative flex h-[72px] items-center justify-center bg-[#EEF0F5] px-6'>
          <DialogTitle className='text-[17px] leading-none font-semibold text-[#44494D]'>
            {t('violationReport.errorDetail.delete.title')}
          </DialogTitle>
          <button
            type='button'
            onClick={() => onOpenChange(false)}
            className='absolute right-6 top-1/2 -translate-y-1/2 text-[#8F9294] hover:opacity-80'
            aria-label={t('common.close')}
          >
            <X className='h-8 w-8' />
          </button>
        </DialogHeader>

        <div className='px-6 pt-5 pb-8 space-y-2'>
          {options.map((option) => {
            const active = deleteType === option.value;

            return (
              <button
                key={option.value}
                type='button'
                onClick={() => setDeleteType(option.value)}
                className='flex items-center gap-4 text-left'
              >
                <span
                  className={cn(
                    'inline-flex h-4 w-4 items-center justify-center rounded-full border-2',
                    active ? 'border-primary' : 'border-[#A8ABB2]'
                  )}
                >
                  {active && <span className='h-2.5 w-2.5 rounded-full bg-primary' />}
                </span>
                <span className='text-[15px] leading-none text-[#44494D]'>{option.label}</span>
              </button>
            );
          })}
        </div>

        <div className='grid grid-cols-2 gap-4 px-6 pb-6'>
          <Button
            type='button'
            variant='outline'
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className='h-14 rounded-xl border-primary text-primary hover:text-primary text-[15px] font-semibold'
          >
            {t('common.cancel')}
          </Button>
          <Button
            type='button'
            disabled={isLoading}
            onClick={() => onConfirm(deleteType)}
            className='h-14 rounded-xl bg-primary hover:bg-primary/90 text-white text-[15px] font-semibold'
          >
            {t('violationReport.errorDetail.delete.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
