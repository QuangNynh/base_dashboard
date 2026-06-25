import { FileDownloadLink } from '@/components/common/FileDownloadLink';
import type { MinutesDetailFile } from '@/types/violation-report-management';

interface Props {
  files: MinutesDetailFile[];
}

export function MinutesFileList({ files }: Props) {
  if (!files.length) return <span>--</span>;
  return (
    <div className='flex flex-col gap-1'>
      {files.map((f, i) => (
        <FileDownloadLink key={i} fileName={f.fileName} url={f.url} />
      ))}
    </div>
  );
}
