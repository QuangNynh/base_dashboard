import { DataTable } from '@/components/common/data-table';
import { Badge } from '@/components/ui/badge';
import { getStatusLabel, removeStatusPrefix } from '@/constants/status';
import i18n from '@/i18n';
import { complaintService } from '@/services/complaintService';
import type { OrderActionHistoryItem } from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type OrderStatus = 'DELIVERED' | 'DELIVERING' | 'PROCESSING' | 'WAITING' | 'RETURNED' | 'CANCELLED';

const STATUS_CONFIG: Record<OrderStatus, { labelKey: string; className: string }> = {
  DELIVERED: {
    labelKey: 'orderStatus.DELIVERED',
    className: 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200',
  },
  DELIVERING: {
    labelKey: 'orderStatus.DELIVERING',
    className: 'bg-blue-100 text-blue-600 hover:bg-blue-100 border-blue-200',
  },
  PROCESSING: {
    labelKey: 'orderStatus.PROCESSING',
    className: 'bg-orange-100 text-orange-600 hover:bg-orange-100 border-orange-200',
  },
  WAITING: {
    labelKey: 'orderStatus.WAITING',
    className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200',
  },
  RETURNED: {
    labelKey: 'orderStatus.RETURNED',
    className: 'bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200',
  },
  CANCELLED: {
    labelKey: 'orderStatus.CANCELLED',
    className: 'bg-red-100 text-red-600 hover:bg-red-100 border-red-200',
  },
};

interface Props {
  data: OrderActionHistoryItem[];
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  isLoading?: boolean;
}

const ListDataInformationOrderDetail = ({
  data,
  pageCount,
  onPaginationChange,
  isLoading = false,
}: Props) => {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 });

  const handlePaginationChange = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState)
  ) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    setPagination(next);
    onPaginationChange?.(next);
  };
  const { data: enumData } = useQuery({
    queryKey: ['tracking-status-enum', i18n.language],
    queryFn: () => complaintService.getTrackingStatusEnum(),
    staleTime: Infinity,
  });

  const columns: ColumnDef<OrderActionHistoryItem>[] = useMemo(
    () => [
      {
        id: 'status',
        accessorKey: 'status',
        size: 100,
        meta: { align: 'center' },
        header: t('orderActionHistory.status'),
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const config = STATUS_CONFIG[status as OrderStatus];
          if (!config) return <span>{removeStatusPrefix(status)}</span>;
          return (
            <Badge variant='outline' className={config.className}>
              {t(config.labelKey)}
            </Badge>
          );
        },
      },
      {
        id: 'postOffice',
        accessorKey: 'postOffice',
        header: t('orderActionHistory.postOffice'),
      },
      {
        id: 'province',
        accessorKey: 'province',
        header: t('orderActionHistory.province'),
      },
      {
        id: 'actionPerson',
        accessorKey: 'actionPerson',
        size: 200,
        meta: { ellipsis: true },
        header: t('orderActionHistory.actionPerson'),
      },
      {
        id: 'actionTime',
        accessorKey: 'actionTime',
        size: 200,
        meta: { ellipsis: true },
        header: t('orderActionHistory.actionTime'),
      },
      {
        id: 'content',
        accessorKey: 'content',
        size: 500,
        header: t('orderActionHistory.content'),
        cell: ({ getValue }) => {
          const value = getValue<string>() ?? '';

          return <p className='whitespace-break-spaces'>{value}</p>;
        },
      },
      {
        id: 'note',
        accessorKey: 'status',
        header: t('orderActionHistory.note'),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          const label = getStatusLabel(value, enumData?.TrackingOrderStatus);
          return <span>{label}</span>;
        },
      },
      {
        id: 'licensePlate',
        accessorKey: 'licensePlate',
        size: 200,
        meta: { ellipsis: true },
        header: t('orderActionHistory.licensePlate'),
      },
      {
        id: 'destinationPostOffice',
        accessorKey: 'destinationPostOffice',
        size: 200,
        meta: { ellipsis: true },
        header: t('orderActionHistory.destinationPostOffice'),
      },
    ],
    [t, enumData?.TrackingOrderStatus]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      pageSizeOptions={[5, 10, 20]}
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
      pageCount={pageCount}
      manualPagination={!!pageCount}
      isLoading={isLoading}
    />
  );
};

export default ListDataInformationOrderDetail;
