import { DataTable } from '@/components/common/data-table';
import { DialogCustom } from '@/components/common/DialogCustom';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime, truncate } from '@/lib/utils';
import { complaintService } from '@/services/complaintService';
import type { FeedbackLevel, UserInfo } from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
interface props {
  open: boolean;
  onclose: () => void;
  id?: number | null;
}

export const HistoryFeedbackLevel1Dialog = ({ open, onclose, id }: props) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { t } = useTranslation();
  const {
    data: historyFeedbackLevel1Data,
    isLoading: isLoadingHistoryFeedbackLevel1,
    refetch,
  } = useQuery({
    queryKey: ['feedback-level-1-history-list', pagination, id],
    queryFn: () =>
      complaintService.getHistoryFeedbackLevel1(
        {
          page: pagination.pageIndex + 1,
          size: pagination.pageSize,
        },
        id!
      ),
    enabled: !!id && open,
    staleTime: 0,
  });

  useEffect(() => {
    if (open && id) {
      refetch();
    }
  }, [open, id, refetch]);

  const columns: ColumnDef<FeedbackLevel>[] = [
    {
      id: 'stt',
      header: t('common.stt'),
      meta: { align: 'center' },
      cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
      size: 50,
    },

    {
      accessorKey: 'is_deleted',
      header: t('settingComplaint.extensionReason.status'),
      cell: ({ getValue }) => {
        const status = getValue<boolean>();
        return <StatusBadge status={status || false ? 'INACTIVE' : 'ACTIVE'} />;
      },
    },

    {
      accessorKey: 'name',
      header: t('settingComplaint.feedbackCategorySetup.feedbackLevel1Name'),
      cell: ({ getValue }) => {
        const value = getValue<string>();

        return (
          <TooltipCustom content={value.length && value}>
            <span> {truncate(value)}</span>
          </TooltipCustom>
        );
      },
    },

    {
      accessorKey: 'updated_at',
      header: t('settingComplaint.feedbackCategorySetup.createdAt'),
      cell: ({ getValue }) => {
        const updatedAt = getValue<string>();
        return updatedAt ? formatDateTime(updatedAt, FORMAT_DATE.FULL_DATE_TIME) : '';
      },
    },
    {
      accessorKey: 'created_by',
      header: t('settingComplaint.feedbackCategorySetup.createdBy'),
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
      title={t('settingComplaint.feedbackCategorySetup.historyTitleDialog')}
    >
      <div className='px-6 overflow-auto'>
        <DataTable
          columns={columns}
          data={historyFeedbackLevel1Data?.data.page_data || []}
          pageSizeOptions={[5, 10, 15, 20, 50]}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoadingHistoryFeedbackLevel1}
          manualPagination={true}
          pageCount={historyFeedbackLevel1Data?.data?.pagination?.totalPages}
        />
      </div>
    </DialogCustom>
  );
};
