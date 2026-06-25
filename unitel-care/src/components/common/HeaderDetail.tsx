import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/card';

interface Props {
  title: string | null;
  link?: string;
}

export const HeaderDetail = ({ title = '', link }: Props) => {
  const navigate = useNavigate();
  return (
    <Card className='py-2 px-4'>
      <div className='flex items-center gap-2'>
        <div
          className='bg-primary p-0.5 rounded-full text-background cursor-pointer'
          onClick={() => (link ? navigate(link) : navigate(-1))}
        >
          <ChevronLeft className='w-4 h-4' />
        </div>
        <div>
          <h1 className='font-semibold'>{title}</h1>
        </div>
      </div>
    </Card>
  );
};
