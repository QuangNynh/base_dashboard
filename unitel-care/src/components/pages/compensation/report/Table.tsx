import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import type { OnChangeFn, PaginationState } from '@tanstack/react-table';
import type { CompensationReportItem } from '@/types/compensation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyData } from '@/components/common/EmptyData';
import SkeletonTable from '@/components/common/SkeletonTable';
import { TablePagination } from './Pagination';

interface Props {
  data: CompensationReportItem[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  pageCount?: number;
  isLoading?: boolean;
}

const CompensationReportTable = ({
  data,
  pagination,
  setPagination,
  pageCount,
  isLoading,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Card className='p-6'>
      <div className='flex flex-col gap-4'>
        <div className='relative'>
          <div className='overflow-auto scrollbar-custom'>
            <Table className='border-b min-w-max'>
              <TableHeader className='bg-sidebar-primary'>
                <TableRow>
                  <TableHead
                    rowSpan={2}
                    className='text-primary text-center border-r px-3 w-[56px]'
                  >
                    {t('common.stt')}
                  </TableHead>
                  <TableHead rowSpan={2} className='text-primary text-center border-r px-3'>
                    {t('compensation.report.colRegion')}
                  </TableHead>
                  <TableHead rowSpan={2} className='text-primary text-center border-r px-3'>
                    {t('compensation.report.branch')}
                  </TableHead>
                  <TableHead rowSpan={2} className='text-primary text-center border-r px-3'>
                    {t('complaintManagement.postOffice')}
                  </TableHead>
                  <TableHead colSpan={3} className='text-primary text-center px-3'>
                    {t('compensation.report.colGroupByStatus')}
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead className='text-primary text-center border-r px-3'>
                    {t('compensation.report.statusInProgress')}
                  </TableHead>
                  <TableHead className='text-primary text-center border-r px-3'>
                    {t('compensation.report.statusCompensating')}
                  </TableHead>
                  <TableHead className='text-primary text-center px-3'>
                    {t('compensation.report.statusCompensated')}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading && <SkeletonTable rows={pagination?.pageSize || 5} columns={7} />}
                {!isLoading &&
                  data?.length > 0 &&
                  data.map((item, index) => (
                    <TableRow key={index} className='even:bg-table-even'>
                      <TableCell className='text-center px-3'>
                        {index + 1 + pagination.pageIndex * pagination.pageSize}
                      </TableCell>
                      <TableCell className='text-center px-3'></TableCell>
                      <TableCell className='text-center px-3'>{item.branchName}</TableCell>
                      <TableCell className='text-center px-3'>{item.postOfficeCode}</TableCell>
                      <TableCell className='text-center px-3'>{item.completing}</TableCell>
                      <TableCell className='text-center px-3'>{item.paymentProcessing}</TableCell>
                      <TableCell className='text-center px-3'>{item.paymentDone}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {!isLoading && !data?.length && (
            <div className='flex items-center justify-center pointer-events-none'>
              <EmptyData title={t('violationReportConclude.noData')} />
            </div>
          )}
        </div>
        <div className='flex xl:flex-row flex-col items-center justify-between px-2'>
          <div className='flex-1 text-sm text-muted-foreground'></div>
          <div className='flex items-center gap-6 lg:gap-8'>
            <TablePagination
              pageSizeOptions={[5, 10, 20, 50, 100]}
              currentPage={pagination?.pageIndex + 1}
              pageSize={pagination?.pageSize}
              setPageIndex={(page) => setPagination({ ...pagination, pageIndex: page })}
              setPageSize={(size) => setPagination({ ...pagination, pageSize: size })}
              totalPages={pageCount || 1}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CompensationReportTable;
