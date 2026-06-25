import AgendaIcon from '@/assets/icons/AgendaIcon';
import EditIcon from '@/assets/icons/EditIcon';
import { DataTable } from '@/components/common/data-table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { Button } from '@/components/ui/button';
import { PostOfficeType, PostOfficeTypeLabelKey } from '@/constants/post-office';
import { truncate } from '@/lib/utils';
import type { FeedbackLevel } from '@/types/complaint-management';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface Props {
  data: FeedbackLevel[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  pageCount?: number;
  onEdit: (data: FeedbackLevel) => void;
  onHistory: (data: FeedbackLevel) => void;
  errorMessage?: string;
}

export const FeedbackLevel2Table = ({
  data: DataInit,
  pagination,
  setPagination,
  isLoading,
  pageCount,
  onEdit,
  onHistory,
  errorMessage,
}: Props) => {
  const { t } = useTranslation();

  const columns: ColumnDef<FeedbackLevel>[] = [
    {
      id: 'stt',
      size: 10,
      header: t('common.stt'),
      meta: { align: 'center' },
      cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
    },
    {
      id: 'actions',
      header: t('common.actions'),
      size: 80,
      meta: { align: 'center' },
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className='flex gap-1 items-center justify-center'>
            <TooltipCustom content={t('common.edit')}>
              <Button size='sm' variant='icon' onClick={() => onEdit(item)}>
                <EditIcon className='w-5.5! h-5.5!' />
              </Button>
            </TooltipCustom>

            <TooltipCustom content={t('settingComplaint.extensionReason.history')}>
              <Button size='sm' variant='icon' onClick={() => onHistory(item)}>
                <AgendaIcon className='w-4.5! h-4.5!' />
              </Button>
            </TooltipCustom>
          </div>
        );
      },
    },
    {
      accessorKey: 'is_deleted',
      header: t('settingComplaint.feedbackCategorySetup.status'),
      cell: ({ getValue }) => {
        const status = getValue<boolean>();
        return <StatusBadge status={status || false ? 'INACTIVE' : 'ACTIVE'} />;
      },
    },

    {
      accessorKey: 'parent_code',
      header: t('settingComplaint.feedbackCategorySetup.feedbackLevel1Code'),
    },
    {
      accessorKey: 'code',
      header: t('settingComplaint.feedbackCategorySetup.feedbackLevel2Code'),
    },

    {
      accessorKey: 'name',
      header: t('settingComplaint.feedbackCategorySetup.addPLLevel2'),
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <TooltipCustom content={value}>
            <span className='block '>{truncate(value)}</span>
          </TooltipCustom>
        );
      },
    },

    {
      accessorKey: 'resolution_time_hours',
      header: t('settingComplaint.feedbackCategorySetup.resolutionTimeHours'),
    },
    {
      accessorKey: 'processing_office',
      header: t('settingComplaint.feedbackCategorySetup.processingOffice'),
      cell: ({ getValue }) => {
        const processingOffice = getValue<PostOfficeType>();
        const office = PostOfficeTypeLabelKey[processingOffice];
        return t(office);
      },
    },
  ];
  return (
    <div>
      <DataTable
        columns={columns}
        data={DataInit}
        pageSizeOptions={[5, 10, 15, 20, 50, 100]}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        manualPagination={true}
        pageCount={pageCount}
        errorMessage={errorMessage}
      />
    </div>
  );
};
