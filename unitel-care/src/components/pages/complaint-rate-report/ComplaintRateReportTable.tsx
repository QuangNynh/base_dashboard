import { DataTable } from '@/components/common/data-table';
import { Card } from '@/components/ui/card';
import type { ComplaintRateReportItem } from '@/types/complaint-management';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface Props {
  data: ComplaintRateReportItem[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  pageCount?: number;
}
export interface ComplaintTableRef {
  exportExcel: () => void;
}

export const ComplaintRateReportTable = ({
  data: DataInit,
  pagination,
  setPagination,
  isLoading,
  pageCount,
}: Props) => {
  const { t } = useTranslation();

  const columns: ColumnDef<ComplaintRateReportItem>[] = [
    {
      id: 'stt',
      size: 80,
      meta: { align: 'center' },
      header: t('common.stt'),
      cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
    },
    {
      id: 'branchNameGroup',
      size: 250,
      accessorKey: 'branchName',
      header: t('complaintRateReport.branchName'),
      meta: { ellipsis: true },
    },
    {
      id: 'postOfficeNameGroup',
      size: 300,
      accessorKey: 'postOfficeName',
      header: t('complaintRateReport.postOfficeName'),
      meta: { ellipsis: true },
    },
    {
      id: 'overdueComplaints',
      size: 200,
      accessorKey: 'overdueComplaints',
      header: t('complaintRateReport.overdueBacklog'),
      meta: { align: 'center' },
    },
    {
      id: 'processedGroup',
      header: () => (
        <div className='w-full h-full flex items-center justify-center bg-table-error text-table-text-error'>
          {t('complaintRateReport.totalProcessed')}
        </div>
      ),
      columns: [
        {
          id: 'processedOverdue',
          accessorKey: 'processedOverdue',
          meta: { align: 'center' },
          header: () => (
            <div className='w-full h-full flex items-center justify-center bg-table-error text-table-text-error'>
              {t('complaintRateReport.processedOverdue')}
            </div>
          ),
        },
        {
          id: 'processedOnTimeGroup',
          accessorKey: 'processedOnTime',
          meta: { align: 'center' },
          header: () => (
            <div className='w-full h-full flex items-center justify-center bg-table-error text-table-text-error'>
              {t('complaintRateReport.processedOnTime')}
            </div>
          ),
        },
        {
          id: 'totalProcessedGroup',
          accessorKey: 'totalProcessed',
          meta: { align: 'center' },
          header: () => (
            <div className='w-full h-full flex items-center justify-center bg-table-error text-table-text-error'>
              {t('complaintRateReport.totalProcessedCount')}
            </div>
          ),
        },
      ],
    },
    {
      id: 'withinDeadlineGroup',
      accessorKey: 'pendingInDeadline',
      meta: { align: 'center' },
      header: () => (
        <span className='text-center w-full h-full flex items-center justify-center'>
          {t('complaintRateReport.withinDeadline')}
        </span>
      ),
    },
    {
      id: 'resolutionRateGroup',
      header: () => (
        <div className='w-full h-full flex items-center justify-center bg-table-error text-table-text-error'>
          {t('complaintRateReport.resolutionRate')}
        </div>
      ),
      columns: [
        {
          id: 'totalMustProcess',
          accessorKey: 'totalMustProcess',
          meta: { align: 'center' },
          size: 200,
          header: () => (
            <div className='w-full h-full flex items-center justify-center bg-table-error text-table-text-error'>
              {t('complaintRateReport.totalMustProcess')}
            </div>
          ),
        },
        {
          id: 'onTimeResolutionRate',
          accessorKey: 'onTimeResolutionRate',
          meta: { align: 'center' },
          size: 280,
          header: () => (
            <div className='w-full h-full flex items-center justify-center bg-table-error text-table-text-error'>
              {t('complaintRateReport.pendingInDeadline')}
            </div>
          ),
        },
        {
          id: 'successResolutionRate',
          accessorKey: 'successResolutionRate',
          meta: { align: 'center' },
          size: 280,
          header: () => (
            <div className='w-full h-full flex items-center justify-center bg-table-error text-table-text-error'>
              {t('complaintRateReport.successResolutionRate')}
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <div>
      <Card className='px-6'>
        <DataTable
          columns={columns}
          data={DataInit}
          pageSizeOptions={[5, 10, 15, 20, 50, 100]}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoading}
          manualPagination={true}
          pageCount={pageCount}
        />
      </Card>
    </div>
  );
};
