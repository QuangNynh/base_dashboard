import EditIcon from '@/assets/icons/EditIcon';
import { DataTable } from '@/components/common/data-table';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { Button } from '@/components/ui/button';
import type { ViolationReportGeneralRow } from '@/types/violation-report';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  data: ViolationReportGeneralRow[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  pageCount?: number;
  onEdit: (row: ViolationReportGeneralRow) => void;
  onDelete: (row: ViolationReportGeneralRow) => void;
}

export const GeneralTable = ({
  data,
  pagination,
  setPagination,
  isLoading,
  pageCount,
  onEdit,
  onDelete,
}: Props) => {
  const { t } = useTranslation();

  const columns: ColumnDef<ViolationReportGeneralRow>[] = [
    {
      id: 'stt',
      header: () => <div>{t('common.stt')}</div>,
      cell: ({ row }) => <div>{row.index + 1 + pagination.pageIndex * pagination.pageSize}</div>,
      size: 40,
      meta: {
        className: 'px-3',
      },
    },
    {
      id: 'actions',
      header: () => <div className='text-center'>{t('common.actions')}</div>,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className='flex gap-2 items-center justify-center'>
            <TooltipCustom content={t('common.edit')}>
              <Button size='sm' variant='icon' onClick={() => onEdit(item)}>
                <EditIcon className='!w-5.5 !h-5.5 ' />
              </Button>
            </TooltipCustom>
            <TooltipCustom content={t('common.delete')}>
              <Button
                size='sm'
                variant='icon'
                className='text-destructive hover:text-destructive'
                onClick={() => onDelete(item)}
              >
                <Trash2 className='w-4 h-4' color='#8F9294' />
              </Button>
            </TooltipCustom>
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: 'employee_code',
      header: t('violationReport.generalTable.employeeCode'),
      size: 100,
      meta: {
        className: 'px-3',
      },
    },
    {
      accessorKey: 'employee_name',
      header: t('violationReport.generalTable.employeeName'),
      size: 180,
      meta: {
        className: 'px-3',
      },
    },
    {
      id: 'managingBranch',
      header: t('violationReport.generalTable.managingBranch'),
      cell: ({ row }) => {
        const branch_names = row.original?.assigned_branches;
        const value = branch_names?.map((i) => i?.branch_name).join(', ');

        return <span>{value}</span>;
      },
      size: 400,
      meta: {
        className: 'px-3',
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      pageSizeOptions={[5, 10, 20, 50, 100]}
      pagination={pagination}
      onPaginationChange={setPagination}
      isLoading={isLoading}
      manualPagination
      pageCount={pageCount}
      errorMessage={t('violationReportConclude.noData')}
    />
  );
};
