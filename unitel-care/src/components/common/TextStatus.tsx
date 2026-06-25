import { cn } from '@/lib/utils';

interface TextStatutProps {
  status?: string;
  className?: string;
  contentStatus?: string;
}

const TextStatus = ({ status, className, contentStatus }: TextStatutProps) => {
  if (!status) return <span>—</span>;

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white',
        className
      )}
    >
      {status} - {contentStatus}
    </span>
  );
};

export default TextStatus;
