import EyeIcon from '@/assets/icons/IconEye';
import { ActionsList } from '@/components/common/ActionsList';
import { DataTable } from '@/components/common/data-table';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { STATUS_CONFIG } from '@/constants/status';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime, truncate } from '@/lib/utils.tsx';
import type { ComplaintHistoryItem, PostOfficeActionStatus } from '@/types/complaint-management';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Props {
  data: ComplaintHistoryItem[];
}

const ComplaintHistoryTab = ({ data }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const columns: ColumnDef<ComplaintHistoryItem>[] = useMemo(
    () => [
      {
        id: 'stt',
        header: t('common.stt'),
        cell: ({ row }) => (
          <span>{row.index + 1 + pagination.pageIndex * pagination.pageSize}</span>
        ),
        size: 60,
      },
      {
        id: 'actions',
        header: t('common.actions'),
        cell: ({ row }) => (
          <ActionsList
            item={['detail']}
            onAction={() => navigate(`/complaint-management/list/${row.original.complaint_id}`)}
            icon={<EyeIcon />}
          />
        ),
        size: 80,
      },
      {
        accessorKey: 'status',
        header: t('journeyHistory.status'),
        cell: ({ getValue }) => {
          const status = getValue<PostOfficeActionStatus>();
          const config = STATUS_CONFIG[status];
          if (!config) return null;
          return (
            <Badge variant='outline' className={config.className}>
              {t(config.label)}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'complaint_code',
        header: t('journeyHistory.complaintCode'),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return (
            <TooltipCustom content={value}>
              <span className='block '>{truncate(value)}</span>
            </TooltipCustom>
          );
        },
      },
      {
        accessorKey: 'complaint_category_code',
        id: 'complaint_category_code',
        header: t('journeyHistory.categoryDescription'),
      },
      {
        accessorKey: 'complaint_category_name',
        id: 'categoryName',
        header: t('journeyHistory.categoryName'),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return (
            <TooltipCustom content={value}>
              <span className='block '>{truncate(value)}</span>
            </TooltipCustom>
          );
        },
      },
      {
        accessorKey: 'complaint_count',
        header: t('journeyHistory.complaintCount'),
      },
      {
        accessorKey: 'processing_post_office',
        header: t('journeyHistory.processingUnit'),
        cell: ({ getValue }) => {
          const value = getValue<string>();
          return (
            <TooltipCustom content={value}>
              <span className='block '>{truncate(value)}</span>
            </TooltipCustom>
          );
        },
      },
      {
        accessorKey: 'created_at',
        header: t('journeyHistory.createdAt'),
        cell: ({ getValue }) => {
          const date = getValue<string>();
          return date ? formatDateTime(date, FORMAT_DATE.FULL_DATE_TIME) : '—';
        },
      },
    ],
    [t, pagination, navigate]
  );

  return (
    <Card className='p-4 mt-4'>
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageSizeOptions={[5, 10, 15, 20, 50, 100]}
      />
    </Card>
  );
};

export default ComplaintHistoryTab;
