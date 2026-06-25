import { DataTable } from '@/components/common/data-table';
import { ViolationReportStatusBadge } from '@/components/common/StatusBadge';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { Card } from '@/components/ui/card';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime, getHourFromSecond } from '@/lib/utils';
import { STATUS_VIOLATION_CODE } from '@/constants/status';
import { orDash } from '@/components/pages/violation-report-conclude/useMinutesColumns';
import type { ViolationReportListItem } from '@/types/violation-report-management';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import AgendaIcon from '@/assets/icons/AgendaIcon';
import EyeIcon from '@/assets/icons/IconEye';
import IconConclude from '@/assets/icons/IconConclude';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface Props {
  variant: 'list' | 'conclude';
  tabKey?: 'incoming' | 'outgoing';
  data: ViolationReportListItem[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  pageCount?: number;
  onExplain?: (item: ViolationReportListItem) => void;
}

export const ViolationReportTable = ({
  variant,
  tabKey,
  data,
  pagination,
  setPagination,
  isLoading,
  pageCount,
  onExplain,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const canExplain = useCallback(
    (status: number | undefined): boolean => {
      if (tabKey === 'incoming')
        return (
          status === STATUS_VIOLATION_CODE.NOT_EXPLAINED || status === STATUS_VIOLATION_CODE.OPINION
        );
      if (tabKey === 'outgoing') return status === STATUS_VIOLATION_CODE.INCORRECT;
      return false;
    },
    [tabKey]
  );

  const columns = useMemo<ColumnDef<ViolationReportListItem>[]>(
    () => [
      {
        id: 'stt',
        size: 40,
        header: () => <span>{t('common.stt')}</span>,
        cell: ({ row }) => (
          <span>{row.index + 1 + pagination.pageIndex * pagination.pageSize}</span>
        ),
        meta: { className: 'px-3' },
      },
      {
        id: 'actions',
        header: t('common.actions'),
        cell: ({ row }) => {
          const item = row.original;
          if (variant === 'conclude') {
            return (
              <div className='flex gap-1 items-center justify-center'>
                <TooltipCustom content={t('common.detail')}>
                  <Button
                    size='sm'
                    variant='icon'
                    onClick={() =>
                      item.id && navigate(`/violation-report/conclude/${item.id}/detail`)
                    }
                  >
                    <EyeIcon className='!w-5 !h-5' />
                  </Button>
                </TooltipCustom>
                {[STATUS_VIOLATION_CODE.INCORRECT, STATUS_VIOLATION_CODE.OPINION].includes(
                  item.status
                ) ? (
                  <TooltipCustom content={t('common.concludeDetail')}>
                    <Button
                      size='sm'
                      variant='icon'
                      onClick={() =>
                        item.id && navigate(`/violation-report/conclude/${item.id}/conclude`)
                      }
                    >
                      <IconConclude className='!w-5.5 !h-5.5' />
                    </Button>
                  </TooltipCustom>
                ) : (
                  <div className='w-[42px] h-8 min-w-[42px]' />
                )}
              </div>
            );
          }
          return (
            <div className='flex gap-1 items-center justify-center'>
              <TooltipCustom content={t('common.detail')}>
                <Button
                  size='sm'
                  variant='icon'
                  onClick={() => item.id && navigate(`/violation-report/list/${item.id}`)}
                >
                  <EyeIcon className='!w-5 !h-5' />
                </Button>
              </TooltipCustom>
              {item?.remainingExplainSeconds != null &&
              item?.remainingExplainSeconds > 0 &&
              canExplain(item.status) ? (
                <TooltipCustom
                  content={t(
                    tabKey == 'outgoing' ? 'violationReportConclude.opinion' : 'common.explain'
                  )}
                >
                  <Button size='sm' variant='icon' onClick={() => onExplain?.(item)}>
                    <AgendaIcon className='!w-5 !h-5' />
                  </Button>
                </TooltipCustom>
              ) : (
                <div className='w-10 min-w-[40px]' />
              )}
            </div>
          );
        },
        meta: { className: 'px-3 text-center' },
        size: 100,
      },
      {
        accessorKey: 'status',
        header: t('violationReportConclude.colStatus'),
        cell: ({ getValue }) => <ViolationReportStatusBadge status={getValue<number>()} />,
        meta: { className: 'px-3' },
        size: 150,
      },
      {
        accessorKey: 'minutesCode',
        header: t('violationReportConclude.colRecordCode'),
        cell: ({ getValue }) => (
          <span className='text-primary whitespace-break-spaces break-all max-w-[150px]'>
            {orDash(getValue<string>())}
          </span>
        ),
        meta: { className: 'px-3 whitespace-break-spaces break-all max-w-[150px]' },
      },
      {
        accessorKey: 'createdAt',
        header: t('violationReportConclude.colCreatedAt'),
        cell: ({ getValue }) => {
          const date = getValue<string | undefined>();
          return <span>{date ? formatDateTime(date, FORMAT_DATE.FULL_DATE_TIME) : '--'}</span>;
        },
        meta: { className: 'px-3' },
      },
      {
        accessorKey: 'createdPostOfficeName',
        header: t('violationReportConclude.colCreatingPostOffice'),
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2'>{orDash(getValue<string>())}</span>
          </TooltipCustom>
        ),
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'createdByEmployeeName',
        header: t('violationReportConclude.colCreator'),
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'targetPostOfficeName',
        header: t('violationReportConclude.lblPostOfficeFiled'),
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'violatingPostOfficeName',
        header: t('violationReportConclude.colAffectedPostOffice'),
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'mistakeCode',
        header: t('violationReportConclude.colErrorCode'),
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 80,
      },
      {
        accessorKey: 'mistakeDescription',
        header: t('violationReportConclude.colErrorName'),
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'createdViolatingPersons',
        header: t('violationReportConclude.colViolator'),
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2'>{orDash(getValue<string>())}</span>
          </TooltipCustom>
        ),
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'remainingExplainSeconds',
        header: t('violationReportConclude.colRemainingTime'),
        cell: ({ row }) => {
          const { remainingExplainSeconds, remainingConcludeSeconds } = row.original;

          if (variant === 'conclude')
            return (
              <span>
                {remainingConcludeSeconds != null
                  ? getHourFromSecond(remainingConcludeSeconds || 0)
                  : '--'}
              </span>
            );

          return (
            <span>
              {remainingExplainSeconds != null
                ? getHourFromSecond(remainingExplainSeconds || 0)
                : '--'}
            </span>
          );
        },
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 150,
      },
      {
        accessorKey: 'complaintCount',
        header: t('violationReportConclude.colComplaintCount'),
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 100,
      },
    ],
    [canExplain, navigate, onExplain, pagination.pageIndex, pagination.pageSize, t, variant, tabKey]
  );

  return (
    <Card className='px-6'>
      <DataTable
        columns={columns}
        data={data}
        pageSizeOptions={[5, 10, 15, 20, 50, 100]}
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
