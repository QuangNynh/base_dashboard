import { DataTable } from '@/components/common/data-table';
import { formatDigit, getCurrency } from '@/lib/utils';
import type { CompensationRateItem } from '@/types/compensation';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionPanel } from './CompensationShared';

interface Props {
  data: CompensationRateItem[];
  pagination: PaginationState;
  isLoading?: boolean;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export function CompensationRateTable({ data, pagination, isLoading, onPaginationChange }: Props) {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<CompensationRateItem>[]>(
    () => [
      {
        id: 'stt',
        size: 60,
        header: t('common.stt'),
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ row }) => <span>{row.index + 1}</span>,
      },
      {
        accessorKey: 'postOfficeName',
        header: t('compensation.detail.colPostOffice'),
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      },
      {
        accessorKey: 'compensationRatio',
        header: t('compensation.detail.colCompensationRate'),
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => {
          const v = getValue<number | null | undefined>();
          return <span>{v != null ? `${v}%` : '--'}</span>;
        },
      },
      {
        accessorKey: 'compensationAmount',
        header: `${t('compensation.detail.colAmount')} (${getCurrency()})`,
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => {
          const v = getValue<number | null | undefined>();
          return <span>{formatDigit(v != null ? Math.round(v * 100) / 100 : v)}</span>;
        },
      },
    ],
    [t]
  );

  return (
    <SectionPanel title={t('compensation.detail.sectionRateInfo')}>
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        manualPagination={false}
        isLoading={isLoading}
        errorMessage={t('compensation.detail.noData')}
      />
    </SectionPanel>
  );
}
