import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { complaintService } from '@/services/complaintService';
import type { HistoryDetailAttachment } from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import { FileIcon, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppButton from '@/components/common/AppButton';

interface Props {
  historyId: number | null;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className='flex items-start justify-between gap-4 py-2 border-b border-border last:border-0'>
      <span className='text-sm text-muted-foreground shrink-0'>{label}:</span>
      <span className='text-sm text-right wrap-break-word max-w-[60%]'>{value ?? '-'}</span>
    </div>
  );
}

function AttachmentLink({ file }: { file: HistoryDetailAttachment }) {
  const handleDownload = async () => {
    const res = await complaintService.getHistoryAttachmentDownloadUrl(file.key, file.file_name);
    if (res.data?.url) {
      window.open(res.data.url, '_blank');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className='flex items-center gap-1.5 text-primary hover:underline text-sm'
    >
      <FileIcon className='w-4 h-4 shrink-0' />
      <span className='truncate max-w-45'>{file.file_name}</span>
    </button>
  );
}

export const PostOfficeHistoryDetailDialog = ({ historyId, onClose }: Props) => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['history-detail', historyId],
    queryFn: () => complaintService.getHistoryDetail(historyId!),
    select: (res) => res.data,
    enabled: historyId !== null,
  });

  return (
    <Dialog open={historyId !== null} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('detailComplaint.historyDetailTitle')}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className='flex justify-center py-8'>
            <Loader2 className='animate-spin text-primary' />
          </div>
        ) : (
          <div className='flex flex-col'>
            <DetailRow label={t('postOfficeHanding.internalContent')} value={data?.internal_note} />
            <DetailRow
              label={t('postOfficeHanding.customerReply')}
              value={data?.response_to_customer}
            />
            <DetailRow
              label={t('postOfficeHanding.feedbackCategory')}
              value={data?.complaint_category}
            />
            <DetailRow
              label={t('postOfficeHanding.processingUnit')}
              value={data?.processing_unit}
            />
            <DetailRow
              label={t('postOfficeHanding.extensionReason')}
              value={data?.extension_reason}
            />
            <DetailRow
              label={t('postOfficeHanding.extensionTime')}
              value={data?.extension_hours != null ? String(data.extension_hours) : undefined}
            />
            <DetailRow label={t('postOfficeHanding.faultUnit')} value={data?.fault_unit} />
            <DetailRow label={t('postOfficeHanding.faultPerson')} value={data?.fault_individual} />
            <DetailRow label={t('postOfficeHanding.errorCause')} value={data?.error_cause} />
            <DetailRow
              label={t('postOfficeHanding.attachedFile')}
              value={
                data?.attachments?.length ? (
                  <div className='flex flex-col gap-1 items-end'>
                    {data.attachments.map((file) => (
                      <AttachmentLink key={file.key} file={file} />
                    ))}
                  </div>
                ) : undefined
              }
            />
          </div>
        )}

        <div className='flex justify-center pt-2'>
          <AppButton className='w-full h-11' onClick={onClose}>
            {t('common.close')}
          </AppButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
