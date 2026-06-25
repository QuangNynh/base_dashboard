import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { IconListDetails } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { ViolationErrorDetailRow } from '@/types/violation-report';
import compact from 'lodash/compact';

interface Props {
  data: ViolationErrorDetailRow[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  pageCount?: number;
  onEdit: (id: number) => void;
  onDelete: (row: ViolationErrorDetailRow) => void;
}

const ErrorList = ({
  data,
  pagination,
  setPagination,
  isLoading,
  onEdit,
  pageCount,
  onDelete,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const yesNoLabel = (value: boolean) =>
    value ? t('violationReport.errorDetail.yes') : t('violationReport.errorDetail.no');

  const handleEdit = (row: ViolationErrorDetailRow) => {
    onEdit(row?.id);
  };

  const handleDelete = (row: ViolationErrorDetailRow) => {
    onDelete(row);
  };

  const handleViewActionHistory = (row: ViolationErrorDetailRow) => {
    navigate(`/violation-report/config/${row?.mistakeCode}/history`);
  };

  const columns: ColumnDef<ViolationErrorDetailRow>[] = [
    {
      id: 'stt',
      header: () => <span>{t('common.stt')}</span>,
      cell: ({ row }) => <span>{row.index + 1 + pagination.pageIndex * pagination.pageSize}</span>,
      size: 30,
      meta: {
        className: 'px-3',
      },
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' type='button' aria-label={t('common.actions')}>
                <IconListDetails className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='bottom' align='start' sideOffset={4}>
              <DropdownMenuItem
                className='!font-medium !text-[15px] !text-[#44494D] cursor-pointer'
                onClick={() => handleEdit(item)}
              >
                {t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='!font-medium !text-[15px] !text-[#44494D] cursor-pointer'
                onClick={() => handleDelete(item)}
              >
                {t('common.delete')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='!font-medium !text-[15px] !text-[#44494D] cursor-pointer'
                onClick={() => handleViewActionHistory(item)}
              >
                {t('violationReport.errorDetail.viewActionHistory')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
      meta: {
        className: 'px-3',
      },
    },
    {
      id: 'errorGroupName',
      header: t('violationReport.errorDetail.errorGroup'),
      cell: ({ row }) => {
        const item = row.original;

        return compact([item?.mistakeGroupCode, item?.mistakeGroupName]).join(' - ');
      },
      meta: {
        className: 'px-3 whitespace-break-spaces',
      },
    },
    {
      accessorKey: 'mistakeCode',
      header: t('violationReport.errorDetail.errorTypeCode'),
      size: 100,
      meta: {
        className: 'px-3 max-w-[100px]',
      },
    },
    {
      accessorKey: 'mistakeDescription',
      header: t('violationReport.errorDetail.tableErrorTypeName'),
      meta: {
        className: 'px-3 whitespace-break-spaces',
      },
      size: 400,
    },
    {
      id: 'automatic',
      accessorKey: 'isAutoClose',
      header: t('violationReport.errorDetail.columnAutomatic'),
      cell: ({ row }) => <span>{yesNoLabel(Boolean(row.original?.isAutoClose))}</span>,
      size: 80,
      meta: {
        className: 'px-3 ',
      },
    },
    {
      accessorKey: 'processExpiredTime',
      header: t('violationReport.errorDetail.columnConfirmHour'),
      size: 100,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[100px]',
      },
    },
    {
      accessorKey: 'concludeExpiredTime',
      header: t('violationReport.errorDetail.columnConclusionHour'),
      size: 100,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[100px]',
      },
    },
  ];

  return (
    <Card className='p-0'>
      <div className='bg-[#F8F8FA] px-4 py-3 rounded-t-md'>
        <h3 className='text-primary font-semibold'>
          {t('violationReport.errorDetail.errorCodeListTitle')}
        </h3>
      </div>
      <div className='px-4 pb-6'>
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
      </div>
    </Card>
  );
};

export default ErrorList;
