import { ActionsList } from '@/components/common/ActionsList';
import { DataTable } from '@/components/common/data-table';
import { Card } from '@/components/ui/card';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime } from '@/lib/utils.tsx';
import { complaintService } from '@/services/complaintService';
import type { RecordItem } from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  orderCode: string;
}

const RecordsHistoryTab = ({ orderCode }: Props) => {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ['records-history-by-order', orderCode, pagination],
    queryFn: () =>
      complaintService.getRecordsByOrderCode(orderCode, {
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
      }),
    enabled: !!orderCode,
  });

  const columns: ColumnDef<RecordItem>[] = useMemo(
    () => [
      {
        id: 'stt',
        header: t('common.stt'),
        cell: ({ row }) => (
          <span>{row.index + 1 + pagination.pageIndex * pagination.pageSize}</span>
        ),
        size: 60,
      },
      {
        id: 'actions',
        header: t('common.actions'),
        cell: () => <ActionsList item={['detail']} />,
        size: 80,
      },
      {
        accessorKey: 'status',
        header: t('journeyHistory.status'),
      },
      {
        accessorKey: 'recordCode',
        header: t('journeyHistory.recordCode'),
        cell: ({ getValue }) => (
          <span className='text-primary cursor-pointer'>{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: t('journeyHistory.entryDate'),
        cell: ({ getValue }) => {
          const date = getValue<string>();
          return date ? formatDateTime(date, FORMAT_DATE.DDMMYYYY) : '—';
        },
      },
      {
        accessorKey: 'creatingPostOffice',
        header: t('journeyHistory.creatingPostOffice'),
      },
      {
        accessorKey: 'creator',
        header: t('journeyHistory.creator'),
      },
      {
        accessorKey: 'affectedPostOffice',
        header: t('journeyHistory.affectedPostOffice'),
      },
      {
        accessorKey: 'errorCode',
        header: t('journeyHistory.errorCode'),
      },
      {
        accessorKey: 'errorName',
        header: t('journeyHistory.errorName'),
      },
      {
        accessorKey: 'remainingTime',
        header: t('journeyHistory.remainingTime'),
      },
    ],
    [t, pagination]
  );

  return (
    <Card className='p-4 mt-4'>
      <DataTable
        columns={columns}
        data={data?.data?.page_data ?? []}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        manualPagination
        pageCount={data?.data?.pagination?.totalPages}
        pageSizeOptions={[5, 10, 15, 20, 50, 100]}
      />
    </Card>
  );
};

export default RecordsHistoryTab;
