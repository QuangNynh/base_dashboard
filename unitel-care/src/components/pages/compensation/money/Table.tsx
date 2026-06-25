import { DataTable } from '@/components/common/data-table';
import {
  CompensationPaymentStatusBadge,
  CompensationStatusBadge,
} from '@/components/common/StatusBadge';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { Button } from '@/components/ui/button';
import { orDash } from '@/components/pages/violation-report-conclude/useMinutesColumns';
import {
  STATUS_COMPENSATION,
  type StatusCompensationType,
  type StatusPaymentCompensationType,
} from '@/constants/status';
import type { CompensationMoneyItem } from '@/types/compensation';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../ui/card';
import CheckMarkRectangle from '@/assets/icons/CheckMarkRectangle';
import RemoveCircle from '@/assets/icons/RemoveCircle';
import { compact } from 'lodash';
import { MinutesFileList } from '../../violation-report-conclude/MinutesFileList';
import { formatNumberFloatOnly } from '@/lib/utils';

interface Props {
  data: CompensationMoneyItem[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  pageCount?: number;
  onSuccess: (item: CompensationMoneyItem) => void;
  onFailed: (item: CompensationMoneyItem) => void;
}

const CompensationMoneyTable = ({
  data,
  pagination,
  setPagination,
  isLoading,
  pageCount,
  onSuccess,
  onFailed,
}: Props) => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<CompensationMoneyItem>[]>(
    () => [
      {
        id: 'stt',
        header: t('common.stt'),
        size: 50,
        meta: { align: 'center', className: 'px-3' },
        cell: ({ row }) => (
          <span>{row.index + 1 + pagination.pageIndex * pagination.pageSize}</span>
        ),
      },
      {
        id: 'actions',
        header: t('common.actions'),
        size: 100,
        meta: { align: 'center', className: 'px-3' },
        cell: ({ row }) => {
          const item = row.original;
          if (item?.status == STATUS_COMPENSATION.PAYING)
            return (
              <div className='flex gap-1 items-center justify-center'>
                <TooltipCustom content={t('compensation.success')}>
                  <Button size='sm' variant='icon' onClick={() => onSuccess(item)}>
                    <CheckMarkRectangle className='!w-5 !h-5' />
                  </Button>
                </TooltipCustom>
                <TooltipCustom content={t('compensation.failed')}>
                  <Button size='sm' variant='icon' onClick={() => onFailed(item)}>
                    <RemoveCircle className='!w-5.5 !h-5.5' />
                  </Button>
                </TooltipCustom>
              </div>
            );
          return '--';
        },
      },
      {
        accessorKey: 'compensationCode',
        header: t('compensation.colProfileCode'),
        size: 160,
        meta: { className: 'px-3' },
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2 whitespace-break-spaces break-all'>
              {orDash(getValue<string>())}
            </span>
          </TooltipCustom>
        ),
      },
      {
        accessorKey: 'itemCode',
        header: t('compensation.colWaybillCode'),
        size: 160,
        meta: { className: 'px-3' },
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2 whitespace-break-spaces break-all'>
              {orDash(getValue<string>())}
            </span>
          </TooltipCustom>
        ),
      },
      {
        id: 'requestingUnit',
        header: t('compensation.moneyTable.colRequestingUnit'),
        size: 180,
        meta: { className: 'px-3' },
        cell: ({ row }) => {
          const item = row.original;

          return (
            <TooltipCustom
              content={compact([item?.rootPostOfficeCode, item?.rootPostOfficeName]).join(' - ')}
            >
              <span className='line-clamp-2 whitespace-break-spaces'>
                {compact([item?.rootPostOfficeCode, item?.rootPostOfficeName]).join(' - ')}
              </span>
            </TooltipCustom>
          );
        },
      },
      {
        id: 'customerName',
        accessorKey: 'customerName',
        header: t('compensation.moneyTable.colCustomerName'),
        size: 180,
        meta: { className: 'px-3' },
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2 whitespace-break-spaces'>
              {orDash(getValue<string>())}
            </span>
          </TooltipCustom>
        ),
      },
      {
        accessorKey: 'beneficiaryName',
        header: t('compensation.moneyTable.colReceivingAccountName'),
        size: 180,
        meta: { className: 'px-3' },
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2 whitespace-break-spaces'>
              {orDash(getValue<string>())}
            </span>
          </TooltipCustom>
        ),
      },
      {
        accessorKey: 'bankName',
        header: t('compensation.moneyTable.colBankName'),
        size: 160,
        meta: { className: 'px-3' },
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2 whitespace-break-spaces'>
              {orDash(getValue<string>())}
            </span>
          </TooltipCustom>
        ),
      },
      {
        accessorKey: 'bankAccountNo',
        header: t('compensation.moneyTable.colBankAccountNo'),
        size: 160,
        meta: { className: 'px-3' },
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2 whitespace-break-spaces break-all'>
              {orDash(getValue<string>())}
            </span>
          </TooltipCustom>
        ),
      },
      {
        accessorKey: 'bcgCompensationAmount',
        header: t('compensation.moneyTable.colCompensationAmount'),
        size: 160,
        meta: { className: 'px-3' },
        cell: ({ getValue }) => <span>{formatNumberFloatOnly(getValue<number>())}</span>,
      },
      {
        id: 'attachmentFile',
        header: t('compensation.colAttachmentFile'),
        size: 180,
        cell: ({ row }) => <MinutesFileList files={row.original.attachedFiles ?? []} />,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('compensation.moneyTable.colProfileStatus'),
        size: 150,
        cell: ({ getValue }) => (
          <CompensationStatusBadge status={getValue<number>() as StatusCompensationType} />
        ),
      },
      {
        id: 'paymentStatus',
        accessorKey: 'paymentStatus',
        header: t('compensation.moneyTable.colPaymentStatus'),
        size: 180,
        meta: { className: 'px-3' },
        cell: ({ getValue, row }) => {
          const { status } = row.original;
          if (status == STATUS_COMPENSATION.PAYING) return '';
          return (
            <CompensationPaymentStatusBadge
              status={getValue<string>() as StatusPaymentCompensationType}
            />
          );
        },
      },
    ],
    [t, pagination.pageIndex, pagination.pageSize, onSuccess, onFailed]
  );

  return (
    <Card className='px-6'>
      <DataTable
        columns={columns}
        data={data}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        manualPagination={true}
        pageCount={pageCount}
        errorMessage={t('violationReportConclude.noData')}
      />
    </Card>
  );
};

export default CompensationMoneyTable;
