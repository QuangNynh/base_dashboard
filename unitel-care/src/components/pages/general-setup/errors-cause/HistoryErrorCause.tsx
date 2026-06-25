import { DataTable } from '@/components/common/data-table';
import { DialogCustom } from '@/components/common/DialogCustom';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime, truncate } from '@/lib/utils';
import { complaintService } from '@/services/complaintService';
import type { ErrorCause, UserInfo } from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
interface props {
  open: boolean;
  onclose: () => void;
  id?: number | null;
}

export const HistoryErrorCauseDialog = ({ open, onclose, id }: props) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { t } = useTranslation();
  const {
    data: historyErrorCausesData,
    isLoading: isLoadingHistoryErrorCauses,
    refetch,
  } = useQuery({
    queryKey: ['error-causes-history-list', pagination, id],
    queryFn: () =>
      complaintService.getHistoryErrorCause(
        {
          page: pagination.pageIndex + 1,
          size: pagination.pageSize,
        },
        id!
      ),
    enabled: !!id && open,
  });

  useEffect(() => {
    if (open && id) refetch();
  }, [open, id, refetch]);

  const columns: ColumnDef<ErrorCause>[] = [
    {
      id: 'stt',
      header: t('common.stt'),
      meta: { align: 'center' },
      cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
      size: 30,
    },

    {
      accessorKey: 'is_deleted',
      meta: { align: 'center' },
      size: 120,
      header: t('settingComplaint.extensionReason.status'),
      cell: ({ getValue }) => {
        const status = getValue<boolean>();
        return <StatusBadge status={status || false ? 'INACTIVE' : 'ACTIVE'} />;
      },
    },

    {
      accessorKey: 'code',
      header: t('settingComplaint.extensionReason.errorCauseCode'),
    },

    {
      accessorKey: 'description',
      header: t('settingComplaint.extensionReason.errorCauseName'),
      cell: ({ getValue }) => {
        const value = getValue<string>();

        return (
          <div>
            <TooltipCustom content={value.length && value}>
              <span> {truncate(value)}</span>
            </TooltipCustom>
          </div>
        );
      },
    },
    {
      accessorKey: 'updated_at',
      header: t('settingComplaint.extensionReason.errorTime'),
      cell: ({ getValue }) => {
        const updatedAt = getValue<string>();
        return updatedAt ? formatDateTime(updatedAt, FORMAT_DATE.FULL_DATE_TIME) : '';
      },
    },
    {
      accessorKey: 'created_by',
      header: t('settingComplaint.extensionReason.createdBy'),
      cell: ({ getValue }) => {
        const createdBy = getValue<UserInfo>();
        return createdBy?.fullName || '';
      },
    },
  ];
  return (
    <DialogCustom
      open={open}
      onclose={onclose}
      title={t('settingComplaint.extensionReason.historyTitleDialog')}
    >
      <div className='px-6 overflow-auto'>
        <DataTable
          columns={columns}
          data={historyErrorCausesData?.data.page_data || []}
          pageSizeOptions={[5, 10, 15, 20, 50, 100]}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoadingHistoryErrorCauses}
          manualPagination={true}
          pageCount={historyErrorCausesData?.data?.pagination?.totalPages}
        />
      </div>
    </DialogCustom>
  );
};
