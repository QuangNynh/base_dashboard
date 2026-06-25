import AgendaIcon from '@/assets/icons/AgendaIcon';
import EditIcon from '@/assets/icons/EditIcon';
import { DataTable } from '@/components/common/data-table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { Button } from '@/components/ui/button';
import { truncate } from '@/lib/utils';
import type { ExtensionReason } from '@/types/complaint-management';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface Props {
  data: ExtensionReason[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  pageCount?: number;
  onEdit: (data: ExtensionReason) => void;
  onHistory: (data: ExtensionReason) => void;
  errorMessage?: string;
}

export const ReasonSetupTable = ({
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

  const columns: ColumnDef<ExtensionReason>[] = [
    {
      id: 'stt',
      size: 10,
      header: t('common.stt'),
      meta: { align: 'center' },
      cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
    },
    {
      id: 'actions',
      size: 50,
      header: t('common.actions'),
      meta: { align: 'center' },
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className='flex gap-1 items-center justify-center'>
            <TooltipCustom content={t('common.edit')}>
              <Button size='sm' variant='icon' onClick={() => onEdit(item)}>
                <EditIcon className='!w-5.5 !h-5.5' />
              </Button>
            </TooltipCustom>

            <TooltipCustom content={t('settingComplaint.extensionReason.history')}>
              <Button size='sm' variant='icon' onClick={() => onHistory(item)}>
                <AgendaIcon className='!w-5 !h-5' />
              </Button>
            </TooltipCustom>
          </div>
        );
      },
    },
    {
      accessorKey: 'is_deleted',
      size: 50,
      header: t('settingComplaint.extensionReason.status'),
      meta: { align: 'center' },
      cell: ({ getValue }) => {
        const status = getValue<boolean>();
        return <StatusBadge status={status ? 'INACTIVE' : 'ACTIVE'} />;
      },
    },
    {
      accessorKey: 'code',
      header: t('settingComplaint.extensionReason.reasonCode'),
      meta: { ellipsis: true },
    },
    {
      accessorKey: 'reason',
      header: t('settingComplaint.extensionReason.reasonName'),
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <TooltipCustom content={value.length && value}>
            <span>{truncate(value, 70)}</span>
          </TooltipCustom>
        );
      },
    },
    {
      accessorKey: 'maxHours',
      header: t('settingComplaint.extensionReason.maxHours'),
      meta: { align: 'center' },
      cell: ({ getValue }) => getValue<number>(),
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
