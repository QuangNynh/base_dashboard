import { Loader2 } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { complaintService } from '@/services/complaintService';
import { cn } from '@/lib/utils';
import { orDash } from '../pages/violation-report-conclude/useMinutesColumns';

interface FileDownloadLinkProps {
  fileName: string;
  /** Storage key used to fetch the pre-signed download URL. Button is disabled when empty. */
  url: string;
  className?: string;
}

export function FileDownloadLink({ fileName, url, className }: FileDownloadLinkProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  // Ref guard prevents double-click from firing two API calls before re-render
  const pendingRef = useRef(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (pendingRef.current) return;
      pendingRef.current = true;
      setIsLoading(true);
      try {
        const res = await complaintService.getHistoryAttachmentDownloadUrl(url, fileName);
        const prelink = res?.data?.url;

        if (!prelink) throw new Error('empty_url');

        // Tạo thẻ a để download
        const link = document.createElement('a');
        link.href = prelink;

        // nếu API không set header download thì set thêm attribute này
        link.setAttribute('download', fileName || 'download');

        // tránh ảnh hưởng UI
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // cleanup
        document.body.removeChild(link);
      } catch {
        toast.error(t('common.downloadError'));
      } finally {
        pendingRef.current = false;
        setIsLoading(false);
      }
    },
    [url, fileName, t]
  );

  const isDisabled = !url || isLoading;

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center gap-1 text-[#3B7CEC] underline text-left',
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80',
        className
      )}
    >
      {isLoading && <Loader2 className='w-3 h-3 shrink-0 animate-spin' />}
      <span className='break-all'>{orDash(fileName)}</span>
    </button>
  );
}
