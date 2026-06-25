import EditIcon from '@/assets/icons/EditIcon';
import { DataTable } from '@/components/common/data-table';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { Button } from '@/components/ui/button';
import type { AssignmentSetup, Department } from '@/types/complaint-management';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  data: AssignmentSetup[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  pageCount?: number;
  onEdit: (item: AssignmentSetup) => void;
  onDelete: (item: AssignmentSetup) => void;
  errorMessage?: string;
}

export const AssignmentTable = ({
  data,
  pagination,
  setPagination,
  isLoading,
  pageCount,
  onEdit,
  onDelete,
  errorMessage,
}: Props) => {
  const { t } = useTranslation();

  const columns: ColumnDef<AssignmentSetup>[] = [
    {
      id: 'stt',
      header: t('common.stt'),
      size: 10,
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
            <TooltipCustom content={t('settingComplaint.assignmentSetup.editTooltip')}>
              <Button size='sm' variant='icon' onClick={() => onEdit(item)}>
                <EditIcon className='!w-5.5 !h-5.5 ' />
              </Button>
            </TooltipCustom>
            <TooltipCustom content={t('settingComplaint.assignmentSetup.deleteTooltip')}>
              <Button
                size='sm'
                variant='icon'
                className='text-destructive hover:text-destructive'
                onClick={() => onDelete(item)}
              >
                <Trash2 size={18} />
              </Button>
            </TooltipCustom>
          </div>
        );
      },
    },
    {
      id: 'employeeCode',
      size: 50,
      accessorKey: 'employeeCode',
      header: t('settingComplaint.assignmentSetup.employeeCode'),
      meta: { ellipsis: true },
    },
    {
      id: 'fullName',
      size: 80,
      accessorKey: 'fullName',
      header: t('settingComplaint.assignmentSetup.employeeName'),
      meta: { ellipsis: true },
    },
    {
      id: 'departments',
      size: 400,
      accessorKey: 'departments',
      header: t('settingComplaint.assignmentSetup.managingBranch'),
      meta: { ellipsis: true },
      cell: ({ getValue }) => {
        const departments = getValue<Department[]>();
        const value = departments?.map((d) => d.departmentName).join(', ');
        return <span>{value}</span>;
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
      errorMessage={errorMessage}
    />
  );
};
