import { Card } from '@/components/ui/card';

export interface DetailFieldProps {
  label: string;
  value?: string | null;
  children?: React.ReactNode;
  className?: string;
}

export const DetailField = ({ label, value, children, className }: DetailFieldProps) => (
  <div className='flex flex-col gap-1 text-sm text-[#44494D]'>
    <span className='font-semibold'>{label}</span>
    <div className={`border rounded  px-3 py-2 min-h-[38px] ${className ?? 'bg-white'}`}>
      {children ?? value ?? '—'}
    </div>
  </div>
);

export interface SectionPanelProps {
  title: string;
  children: React.ReactNode;
}

export const SectionPanel = ({ title, children }: SectionPanelProps) => (
  <Card className='p-0 gap-0'>
    <div className='bg-[#F8F8FA] px-4 py-3 rounded-t-md'>
      <h3 className='text-primary font-semibold'>{title}</h3>
    </div>
    <div className='p-4'>{children}</div>
  </Card>
);
