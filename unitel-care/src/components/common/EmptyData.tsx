import React from 'react';
import { FileSearch } from 'lucide-react';

interface Props {
  title: string;
  icon?: React.ReactNode;
}

export const EmptyData: React.FC<Props> = ({ title, icon }) => {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-8'>
      {icon ?? <FileSearch className='text-gray-500' size={50} />}
      <p className='text-gray-500 text-base font-medium'>{title}</p>
    </div>
  );
};
