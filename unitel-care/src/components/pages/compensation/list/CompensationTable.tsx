import EyeIcon from '@/assets/icons/IconEye';
import { DataTable } from '@/components/common/data-table';
import { CompensationStatusBadge } from '@/components/common/StatusBadge';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { Button } from '@/components/ui/button';
import { orDash } from '@/components/pages/violation-report-conclude/useMinutesColumns';
import {
  CASE_COMPENSATION_TRANSLATION_KEY,
  STATUS_COMPENSATION,
  type CaseCompensationType,
  type StatusCompensationType,
} from '@/constants/status';
import type { CompensationListItem } from '@/types/compensation';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../../../ui/card';
import CompleteCompensationIcon from '../../../../assets/icons/CompleteCompensationIcon';
import DownloadCloudIcon from '@/assets/icons/DownloadCloud';
import ButtonLoading from '@/components/common/ButtonLoading';
import Can from '@/components/common/Can';

interface Props {
  data: CompensationListItem[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  pageCount?: number;
  onDetail: (item: CompensationListItem) => void;
  onComplete: (item: CompensationListItem) => void;
  getExampleFile: () => void;
  loadingExampleFile: boolean;
}

export const CompensationTable = ({
  data,
  pagination,
  setPagination,
  isLoading,
  pageCount,
  onDetail,
  onComplete,
  getExampleFile,
  loadingExampleFile,
}: Props) => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<CompensationListItem>[]>(
    () => [
      {
        id: 'stt',
        header: t('common.stt'),
        size: 40,
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
          return (
            <div className='flex gap-1 items-center'>
              <TooltipCustom content={t('common.detail')}>
                <Button size='sm' variant='icon' onClick={() => onDetail(item)}>
                  <EyeIcon className='!w-5 !h-5' />
                </Button>
              </TooltipCustom>
              {item.status === STATUS_COMPENSATION.COMPLETING && (
                <Can roles={['HPO', 'CS']}>
                  <TooltipCustom content={t('compensation.actionComplete')}>
                    <Button size='sm' variant='icon' onClick={() => onComplete(item)}>
                      <CompleteCompensationIcon className='!w-5 !h-5' />
                    </Button>
                  </TooltipCustom>
                </Can>
              )}
            </div>
          );
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: t('compensation.colStatus'),
        size: 120,
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => (
          <CompensationStatusBadge status={getValue<number>() as StatusCompensationType} />
        ),
      },
      {
        id: 'compensationCode',
        accessorKey: 'compensationCode',
        header: t('compensation.colProfileCode'),
        size: 300,
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2 break-all'>{orDash(getValue<string>())}</span>
          </TooltipCustom>
        ),
      },
      {
        id: 'minutesCode',
        accessorKey: 'minutesCode',
        header: t('compensation.colMinutesCode'),
        size: 300,
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => (
          <span className='line-clamp-2 break-all whitespace-break-spaces'>
            {orDash(getValue<string>())}
          </span>
        ),
      },
      {
        id: 'caseType',
        accessorKey: 'caseType',
        header: t('compensation.colProfileType'),
        size: 150,
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => (
          <span className='line-clamp-2 break-all whitespace-break-spaces'>
            {t(`${orDash(CASE_COMPENSATION_TRANSLATION_KEY[getValue() as CaseCompensationType])}`)}
          </span>
        ),
      },
      {
        id: 'itemCode',
        accessorKey: 'itemCode',
        header: t('compensation.colWaybillCode'),
        size: 150,
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => (
          <span className='line-clamp-2 break-all whitespace-break-spaces'>
            {orDash(getValue<string>())}
          </span>
        ),
      },
      {
        id: 'violatingPostOfficeSummary',
        accessorKey: 'violatingPostOfficeSummary',
        header: t('compensation.colCompensationPostOffice'),
        size: 150,
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => (
          <span className='line-clamp-2 break-all whitespace-break-spaces'>
            {orDash(getValue<string>())}
          </span>
        ),
      },
      {
        id: 'createdPostOfficeCode',
        accessorKey: 'createdPostOfficeCode',
        header: t('compensation.colCreatedPostOffice'),
        size: 150,
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => (
          <span className='line-clamp-2 break-all whitespace-break-spaces'>
            {orDash(getValue<string>())}
          </span>
        ),
      },
      {
        id: 'rootPostOfficeCode',
        accessorKey: 'rootPostOfficeCode',
        header: t('compensation.colOriginalPostOffice'),
        size: 150,
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => (
          <span className='line-clamp-2 break-all whitespace-break-spaces'>
            {orDash(getValue<string>())}
          </span>
        ),
      },
    ],
    [t, pagination.pageIndex, pagination.pageSize, onDetail, onComplete]
  );

  return (
    <Card className='px-6'>
      <ButtonLoading
        variant='outline'
        className='h-11 w-fit rounded-md border-primary text-primary hover:text-primary text-[15px] font-semibold'
        onClick={getExampleFile}
        loading={loadingExampleFile}
        disabled={loadingExampleFile}
      >
        <DownloadCloudIcon className='!w-6 !h-6 min-w-6' />
        {t('compensation.exampleDownload')}
      </ButtonLoading>
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
