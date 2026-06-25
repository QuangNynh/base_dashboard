import React from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Điều chỉnh theo thư viện của bạn
import { TableCell } from '../ui/table';
import { TableRow } from '../ui/table';

interface SkeletonTableProps {
  rows: number; // Số lượng hàng
  columns: number; // Số lượng cột (không tính cột hành động)
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows, columns }) => {
  const rowArray = Array.from({ length: rows }, (_, index) => index);
  const columnArray = Array.from({ length: columns }, (_, index) => index);

  return (
    <>
      {rowArray.map((row) => (
        <TableRow key={row}>
          {columnArray.map((col) => (
            <TableCell key={col} className='text-center'>
              <div className='w-full h-[40px] flex items-center justify-center'>
                <Skeleton className='w-full h-[20px] rounded-md' />
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default SkeletonTable;
