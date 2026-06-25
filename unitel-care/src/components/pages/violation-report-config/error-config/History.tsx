import { DataTable } from '@/components/common/data-table';
import { Card } from '@/components/ui/card';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime, getCurrency } from '@/lib/utils';
import { violationReportService } from '@/services/violationReport';
import type { ViolationHistoryErrorDetailData } from '@/types/violation-report';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import compact from 'lodash/compact';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const History = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['error-history', id, location.key],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return violationReportService.getDetailErrorHistory(id as string);
    },
    enabled: !!id,
    refetchOnMount: true,
  });

  const handleBack = () => {
    navigate(-1);
  };

  const yesNoLabel = (value: boolean) =>
    value ? t('violationReport.errorDetail.yes') : t('violationReport.errorDetail.no');

  const columns: ColumnDef<ViolationHistoryErrorDetailData>[] = [
    {
      id: 'stt',
      header: () => <span>{t('common.stt')}</span>,
      cell: ({ row }) => <span>{row.index + 1 + pagination.pageIndex * pagination.pageSize}</span>,
      size: 70,
      meta: {
        className: 'px-3',
      },
    },
    {
      accessorKey: 'mistakeCode',
      header: t('violationReport.errorHistory.errorCode'),
      size: 90,
      meta: {
        className: 'px-3',
      },
    },
    {
      accessorKey: 'mistakeDescription',
      header: t('violationReport.errorHistory.errorDetail'),
      size: 180,
      meta: {
        className: 'px-3 whitespace-break-spaces',
      },
    },
    {
      accessorKey: 'errorGroupName',
      header: t('violationReport.errorHistory.errorGroupName'),
      size: 130,
      cell: ({ row }) => {
        const item = row.original;

        return compact([item?.mistakeGroupCode, item?.mistakeGroupName]).join(' - ');
      },
      meta: {
        className: 'px-3 whitespace-break-spaces',
      },
    },
    {
      accessorKey: 'autoComplete',
      header: t('violationReport.errorHistory.autoComplete'),
      cell: ({ row }) => <span>{yesNoLabel(Boolean(row.original?.isAutoClose))}</span>,
      size: 130,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[130px]',
      },
    },
    {
      accessorKey: 'createSingleRecord',
      header: t('violationReport.errorHistory.createSingleRecord'),
      cell: ({ row }) => <span>{yesNoLabel(Boolean(row.original.isUnique))}</span>,
      size: 130,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[130px]',
      },
    },
    {
      accessorKey: 'compensation',
      header: t('violationReport.errorHistory.compensation'),
      cell: ({ row }) => <span>{yesNoLabel(Boolean(row.original?.isCompensatory))}</span>,
      size: 110,
    },
    {
      accessorKey: 'processExpiredTime',
      header: t('violationReport.errorHistory.confirmHour'),
      size: 150,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[150px]',
      },
    },
    {
      accessorKey: 'concludeExpiredTime',
      header: t('violationReport.errorHistory.conclusionHour'),
      size: 150,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[150px]',
      },
    },
    {
      accessorKey: 'individualBonusScore',
      header: t('violationReport.errorDetail.personalRewardPoint'),
      size: 150,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[150px]',
      },
    },
    {
      accessorKey: 'individualPenaltyScore',
      header: t('violationReport.errorHistory.personalPenaltyPoint'),
      size: 150,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[150px]',
      },
    },
    {
      accessorKey: 'moneyPenalty',
      header: `${t('violationReport.errorHistory.compensationUnitLak')} (${getCurrency()})`,
      size: 150,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[150px]',
      },
    },
    {
      accessorKey: 'managerPenaltyScore',
      header: t('violationReport.errorHistory.unitManagerPenaltyPoint'),
      size: 150,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[150px]',
      },
    },
    {
      accessorKey: 'agencyPenaltyScore',
      header: t('violationReport.errorHistory.postOfficeDeductionPoint'),
      size: 130,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[130px]',
      },
    },
    {
      accessorKey: 'createdByUsername',
      header: t('violationReport.errorHistory.updatedBy'),
      size: 120,
      meta: {
        className: 'px-3 whitespace-break-spaces max-w-[120px]',
      },
    },
    {
      accessorKey: 'createdAt',
      header: t('violationReport.errorHistory.updatedAt'),
      size: 140,
      cell: ({ getValue }) => {
        const updatedAt = getValue<string>();
        return updatedAt ? formatDateTime(updatedAt, FORMAT_DATE.FULL_DATE_TIME) : '';
      },
    },
  ];

  return (
    <>
      <div className='bg-[#F8F8FA] px-4 py-3 rounded-t-md flex items-center gap-2'>
        <span
          onClick={handleBack}
          className='h-6 w-6 flex items-center justify-center rounded-full bg-primary cursor-pointer'
        >
          <ChevronLeft color='#fff' width={20} height={20} strokeWidth={1.5} />
        </span>
        <h3 className='text-[#44494D] font-semibold'>
          {t('common.violationReportConfigHistory')}: {id}
        </h3>
      </div>
      <Card className='p-0'>
        <div className='px-4 py-6'>
          <DataTable
            columns={columns}
            data={historyData?.data || []}
            onPaginationChange={setPagination}
            manualPagination
            isLoading={isLoading}
            pageCount={
              historyData?.data?.length
                ? Math.ceil(historyData?.data?.length / pagination.pageSize)
                : 0
            }
            errorMessage={t('violationReportConclude.noData')}
          />
        </div>
      </Card>
    </>
  );
};

export default History;
