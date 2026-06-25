import { DataTable } from '@/components/common/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime } from '@/lib/utils';
import { complaintService } from '@/services/complaintService';
import type { PostOfficeActionStatus, PostOfficeHistoryItem } from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { EyeIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PostOfficeHistoryDetailDialog } from './PostOfficeHistoryDetailDialog';
import { STATUS_CONFIG } from '@/constants/status';

interface Props {
  id?: string;
  onDetail?: (id: string) => void;
}

const PostOfficeHistoryTab = ({ id, onDetail }: Props) => {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null);

  const { data: dataPostOfficeHistory, isLoading: isLoadingPostOfficeHistory } = useQuery({
    queryKey: ['post-office-history', id, pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      complaintService.getHistoryPostOfficeComplaint(
        {
          page: pagination.pageIndex + 1,
          size: pagination.pageSize,
        },
        id!
      ),
    refetchOnWindowFocus: false,
    enabled: !!id,
    staleTime: 0,
  });

  const pageCount = dataPostOfficeHistory?.data?.pagination?.totalPages || 0;

  const handlePaginationChange = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState)
  ) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    setPagination(next);
  };

  const columns: ColumnDef<PostOfficeHistoryItem>[] = useMemo(() => {
    const baseColumns: ColumnDef<PostOfficeHistoryItem>[] = [
      {
        accessorKey: 'updatedAt',
        header: t('detailComplaint.actionDate'),
        size: 200,
        cell: ({ getValue }) => {
          const updatedAt = getValue<string>();
          return updatedAt ? formatDateTime(updatedAt, FORMAT_DATE.FULL_DATE_TIME) : '';
        },
      },
      {
        accessorKey: 'actionUnitPostcode',
        size: 250,
        meta: { ellipsis: true },
        header: t('detailComplaint.actionUnit'),
        cell: ({ row }) => {
          const item = row.original;
          return item.actionUnitPostcode || item.actionUnitPostname
            ? `${item.actionUnitPostcode} - ${item.actionUnitPostname}`
            : '';
        },
      },
      {
        accessorKey: 'actionPerson',
        size: 200,
        meta: { ellipsis: true },
        header: t('detailComplaint.actionPerson'),
        cell: ({ row }) => {
          const item = row.original;
          return item.createdBy.fullName;
        },
      },
      {
        accessorKey: 'processingPostOffice',
        size: 300,
        meta: { ellipsis: true },
        header: t('detailComplaint.processingUnit'),
        cell: ({ row }) => {
          const item = row.original;
          return item.processingPostcode || item.processingPostOffice
            ? `${item.processingPostcode} - ${item.processingPostOffice}`
            : '';
        },
      },
      {
        accessorKey: 'handlerFullName',
        size: 300,
        meta: { ellipsis: true },
        header: t('detailComplaint.personalProcess'),
        cell: ({ getValue }) => {
          const handlerFullName = getValue<string>();
          return handlerFullName || '';
        },
      },
      {
        accessorKey: 'categoryName',
        size: 200,
        meta: { ellipsis: true },
        header: t('detailComplaint.feedbackCategory'),
      },
      {
        accessorKey: 'status',
        header: t('detailComplaint.status'),
        cell: ({ getValue }) => {
          const status = getValue<PostOfficeActionStatus>();
          const config = STATUS_CONFIG[status];
          if (!config) return null;
          return (
            <Badge variant='outline' className={config.className}>
              {t(config.label)}
            </Badge>
          );
        },
      },
      {
        id: 'extended',
        header: t('detailComplaint.isLate'),
        size: 120,
        cell: ({ row }) => {
          const { extended } = row.original;
          if (extended === null || extended === undefined) return null;
          return extended ? t('common.yes') : t('common.no');
        },
      },
      {
        size: 200,
        accessorKey: 'internalNote',
        meta: { ellipsis: true },
        header: t('detailComplaint.actionContent'),
      },
      {
        size: 300,
        accessorKey: 'responseToCustomer',
        meta: { ellipsis: true },
        header: t('detailComplaint.responseToCustomer'),
      },
    ];

    baseColumns.unshift({
      id: 'actionDetail',
      header: t('common.actions'),
      size: 80,
      meta: { align: 'center' },
      cell: ({ row }) => (
        <Button
          variant='icon'
          onClick={() => {
            setSelectedHistoryId(row.original.id);
            onDetail?.(row.id);
          }}
        >
          <EyeIcon />
        </Button>
      ),
    });

    return baseColumns;
  }, [onDetail, setSelectedHistoryId, t]);

  return (
    <>
      <DataTable
        columns={columns}
        data={dataPostOfficeHistory?.data?.page_data || []}
        pageSizeOptions={[100, 50, 20, 10, 5]}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        pageCount={pageCount}
        manualPagination={true}
        isLoading={isLoadingPostOfficeHistory}
      />
      <PostOfficeHistoryDetailDialog
        historyId={selectedHistoryId}
        onClose={() => setSelectedHistoryId(null)}
      />
    </>
  );
};

export default PostOfficeHistoryTab;
