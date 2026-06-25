import { DataTable } from '@/components/common/data-table';
import { DialogCustom } from '@/components/common/DialogCustom';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime, truncate } from '@/lib/utils';
import { complaintService } from '@/services/complaintService';
import type { ExtensionReason, UserInfo } from '@/types/complaint-management';
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
    data: historyExtensionReasonData,
    isLoading: isLoadingHistoryErrorCauses,
    refetch,
  } = useQuery({
    queryKey: ['extension-reasons-history-list', pagination, id],
    queryFn: () =>
      complaintService.getHistoryExtensionReason(
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

  const columns: ColumnDef<ExtensionReason>[] = [
    {
      id: 'stt',
      header: t('common.stt'),
      meta: { align: 'center' },
      cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
      size: 10,
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
      accessorKey: 'reason',
      size: 200,
      header: t('settingComplaint.extensionReason.reasonName'),
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
      accessorKey: 'max_hours',
      meta: { align: 'center' },
      size: 100,
      header: t('settingComplaint.extensionReason.maxHours'),
      cell: ({ getValue }) => getValue<number>(),
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
        // TODO 260419: Tester required change - MTM-10553
        return createdBy?.fullName || '';
      },
    },
  ];
  return (
    <DialogCustom
      open={open}
      onclose={onclose}
      title={t('settingComplaint.extensionReason.historyTitleErrorDialog')}
    >
      <div className='px-6 overflow-auto'>
        <DataTable
          columns={columns}
          data={historyExtensionReasonData?.data?.page_data || []}
          pageSizeOptions={[5, 10, 15, 20, 50, 100]}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoadingHistoryErrorCauses}
          manualPagination={true}
          pageCount={historyExtensionReasonData?.data?.pagination?.totalPages}
        />
      </div>
    </DialogCustom>
  );
};
