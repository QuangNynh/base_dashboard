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

export function ModalConfirmDeleteAssignmentSetup({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ModalConfirmDeleteAssignmentSetupProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[586px] p-0 overflow-hidden'>
        <DialogHeader className='bg-[#F6F8FF] px-6 py-4'>
          <DialogTitle className='text-center text-base font-semibold '>
            {t('settingComplaint.assignmentSetup.deleteTooltip')}
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col items-center gap-4 px-8 pt-6 pb-8'>
          <div className='w-20 h-20 rounded-full bg-[#F97316] flex items-center justify-center'>
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

          <p className='text-center text-base font-semibold text-gray-900'>
            {t('settingComplaint.assignmentSetup.deleteConfirmTitle')}
          </p>

          <p className='text-center text-sm text-gray-500'>
            {t('settingComplaint.assignmentSetup.deleteConfirmDesc')}
          </p>

          <div className='flex gap-4 w-full mt-2'>
            <Button
              variant='outline'
              className='flex-1 border-[#F97316] text-[#F97316] hover:bg-orange-50 hover:text-[#F97316]'
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              className='flex-1 bg-[#F97316] hover:bg-orange-600 text-white'
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {t('common.confirm')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
