import { Card } from '@/components/ui/card';

interface Props {
  title: string;
  children: React.ReactNode;
}

export function MinutesTableSection({ title, children }: Props) {
  return (
    <Card className='p-0'>
      <div className='bg-[#F8F8FA] px-4 py-3 rounded-t-md'>
        <h3 className='text-primary font-semibold'>{title}</h3>
      </div>
      <div className='px-4 pb-6'>{children}</div>
    </Card>
  );
}
