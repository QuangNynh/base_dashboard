import { DialogCustom } from '@/components/common/DialogCustom';
import { Button } from '@/components/ui/button';
import { Bell, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DialogConfirmCreateMinutesAutoClose = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
}: Props) => {
  const { t } = useTranslation();

  return (
    <DialogCustom
      open={open}
      onclose={onClose}
      title={t('violationReportConclude.dialogNotice')}
      className='!w-[586px] !max-w-[90vw] h-fit'
    >
      <div className='flex flex-col items-center gap-4 py-4'>
        <div className='flex items-center justify-center w-20 h-20 rounded-full bg-primary'>
          <Bell className='w-9 h-9 text-white' strokeWidth={1.8} />
        </div>

        <div className='flex flex-col items-center gap-2 text-center px-2'>
          <p className='font-semibold text-base text-foreground'>
            {t('violationReportConclude.dialogCreateMinutesAutoCloseLabel')}
          </p>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            {t('violationReportConclude.dialogCreateMinutesAutoCloseDesc')}
          </p>
        </div>

        <div className='grid grid-cols-2 gap-4 w-full pt-2'>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className='w-4 h-4 animate-spin mr-2' />}
            {t('common.confirm')}
          </Button>
        </div>
      </div>
    </DialogCustom>
  );
};

export default DialogConfirmCreateMinutesAutoClose;
