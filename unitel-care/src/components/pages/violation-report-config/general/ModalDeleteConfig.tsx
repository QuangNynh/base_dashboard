import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModalConfirmDeleteAssignmentSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ModalDeleteConfig({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ModalConfirmDeleteAssignmentSetupProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[586px] p-0 overflow-hidden gap-0'>
        <DialogHeader className='h-12 flex items-center justify-center border-b border-[#E5E7EB] px-6'>
          <DialogTitle className='text-center text-[17px] font-semibold text-[#3D4465]'>
            {t('violationReport.generalTable.notification')}
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col items-center px-8 py-8 border-b border-[#E5E7EB]'>
          <div className='w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-6'>
            <svg
              width='40'
              height='40'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z'
                fill='white'
              />
            </svg>
          </div>

          <p className='text-center text-[17px] leading-tight font-medium text-[#3D4465]'>
            {t('violationReport.generalTable.deleteConfirm')}
          </p>
        </div>

        <div className='flex gap-4 p-4'>
          <Button
            variant='outline'
            className='flex-1 h-12 border-primary text-primary hover:bg-orange-50 hover:text-primary text-[15px] font-medium'
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            className='flex-1 h-12 bg-primary hover:bg-[#e64d00] text-white text-[15px] font-medium'
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {t('common.confirm')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
