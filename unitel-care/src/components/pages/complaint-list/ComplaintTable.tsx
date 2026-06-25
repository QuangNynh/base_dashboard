import { ActionsList, type ActionType } from '@/components/common/ActionsList';
import { DataTable } from '@/components/common/data-table';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ROLE_GROUP } from '@/constants/permissions';
import { STATUS_CONFIG } from '@/constants/status';
import { FORMAT_DATE } from '@/constants/utils';
import { useCheckPermissions } from '@/hooks/useCheckPermissions';
import { TimeFormatter, type LanguageCode } from '@/lib/timeFormatter';
import { formatDateTime, truncate } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import type {
  ComplaintListItem,
  ComplaintSummary,
  PostOfficeActionStatus,
} from '@/types/complaint-management';
import type { ColumnDef, OnChangeFn, PaginationState } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface Props {
  data: ComplaintListItem[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  pageCount?: number;
  summary?: ComplaintSummary;
  errorMessage?: string;
}
export interface ComplaintTableRef {
  exportExcel: () => void;
}

export const ComplaintTable = ({
  data: DataInit,
  pagination,
  setPagination,
  isLoading,
  pageCount,
  summary,
}: Props) => {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  const { currentUser } = useAuthStore();

  const handleAction = (action: ActionType, item: ComplaintListItem) => {
    switch (action) {
      case 'edit':
        navigate(`/complaint-management/list/${item.id}/edit`);
        break;
      case 'detail':
        navigate(`/complaint-management/list/${item.id}`);
        break;
      case 'process':
        navigate(`/complaint-management/list/${item.id}/handing`);
        break;
      default:
        break;
    }
  };
  const isVanHanh = useCheckPermissions([ROLE_GROUP.VAN_HANH]);

  const isCreatedByYou = (item: ComplaintListItem) =>
    String(currentUser?.userId) === item?.created_user_id;

  const columns: ColumnDef<ComplaintListItem>[] = [
    // STT
    {
      id: 'stt',
      header: () => <span className='pl-2 text-center'>{t('common.stt')}</span>,
      cell: ({ row }) => (
        <span className='pl-3'>{row.index + 1 + pagination.pageIndex * pagination.pageSize}</span>
      ),
      size: 60,
    },
    // Thao tác
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => {
        const item = row.original;
        const isOutGoing = item.complaintType === 'OUTCOMING';

        return (
          <ActionsList
            item={['edit', 'detail', 'process']}
            onAction={(action) => handleAction(action, item)}
            actionConfig={{
              edit: {
                disabled: item?.status === 'COMPLETED',
                hidden: !isOutGoing && !isCreatedByYou(item),
              },
              process: {
                hidden: isOutGoing,
                disabled: item?.status === 'COMPLETED' && !isVanHanh,
              },
              detail: { hidden: isOutGoing },
            }}
          />
        );
      },
      size: 80,
    },

    // Mã khiếu nại
    {
      id: 'complaintCode',
      accessorKey: 'complaintCode',
      header: t('complaintManagement.complaintCode'),
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <TooltipCustom content={value?.length > 30 && value}>
            <span className='text-primary'>{truncate(value, 50)}</span>
          </TooltipCustom>
        );
      },
      size: 350,
    },

    // Mã vận đơn
    {
      id: 'orderCode',
      accessorKey: 'orderCode',
      header: t('complaintManagement.trackingCode'),
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <TooltipCustom content={value?.length > 20 && value}>
            <span className='text-primary'>{truncate(value, 20)}</span>
          </TooltipCustom>
        );
      },
    },

    // Ngày tạo
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: t('complaintManagement.createdAt'),
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date ? formatDateTime(date, FORMAT_DATE.FULL_DATE_TIME) : '';
      },
    },

    // Hạn xử lý
    {
      id: 'deadline',
      accessorKey: 'deadline',
      header: t('complaintManagement.deadline'),
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date ? formatDateTime(date, FORMAT_DATE.FULL_DATE_TIME) : '';
      },
    },

    // Thời gian còn lại
    {
      id: 'remainingTime',
      size: 220,
      accessorKey: 'remainingTime',
      header: t('complaintManagement.remainingTime'),
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date
          ? TimeFormatter.formatWithDays(date, (i18n?.language ?? 'en') as LanguageCode)
          : '';
      },
    },

    // Ngày hoàn thành
    {
      id: 'completedAt',
      accessorKey: 'completedAt',
      header: t('complaintManagement.completedAt'),
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date ? formatDateTime(date, FORMAT_DATE.FULL_DATE_TIME) : '';
      },
    },

    // Tên khách hàng
    {
      id: 'contactName',
      accessorKey: 'contactName',
      size: 200,
      header: t('complaintManagement.customerName'),
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? (
          <TooltipCustom content={value?.length > 25 && value}>
            <span>{truncate(value, 25)}</span>
          </TooltipCustom>
        ) : (
          ''
        );
      },
    },

    // Điện thoại
    {
      id: 'contactPhone',
      accessorKey: 'contactPhone',
      header: t('complaintManagement.phoneNumber'),
      cell: ({ getValue }) => getValue<string>() || '',
    },

    // Lần phản ánh
    {
      id: 'complaintCount',
      accessorKey: 'complaintCount',
      header: t('complaintManagement.complaintCount'),
      cell: ({ getValue }) => getValue<number>() || 0,
    },

    // Phân loại phản ánh
    {
      id: 'categoryName',
      accessorKey: 'categoryName',
      header: t('complaintManagement.complaintCategory'),
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? (
          <TooltipCustom content={value?.length > 40 && value}>
            <span>{truncate(value, 40)}</span>
          </TooltipCustom>
        ) : (
          ''
        );
      },
      size: 300,
    },

    // Kênh tiếp nhận
    {
      id: 'receiptChannel',
      accessorKey: 'receiptChannel',
      header: t('complaintManagement.receiptChannel'),
      cell: ({ getValue }) => {
        const channel = getValue<string>();
        return channel ? t(`complaintManagement.channels.${channel}`) : '';
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: t('complaintManagement.status'),
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

    // Bưu cục xử lý
    {
      id: 'processingPostOffice',
      accessorKey: 'processingPostOffice',
      header: t('complaintManagement.processingPostOffice'),
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return value ? (
          <TooltipCustom content={value?.length > 35 && value}>
            <span>{truncate(value, 35)}</span>
          </TooltipCustom>
        ) : (
          ''
        );
      },
      size: 300,
    },

    // Cá nhân xử lý
    {
      id: 'assignedUser',
      accessorKey: 'handlerInfo',
      header: t('complaintManagement.assignedUser'),
      cell: ({ getValue }) => {
        const value = getValue<string>()
          ?.split(',')
          .map((s) => s.trim())
          .join(' - ');
        return value ? (
          <TooltipCustom content={value?.length > 25 && value}>
            <span>{truncate(value, 25)}</span>
          </TooltipCustom>
        ) : (
          ''
        );
      },
      size: 300,
    },
  ];

  return (
    <div>
      <Card className='px-6'>
        <DataTable
          columns={columns}
          data={DataInit}
          pageSizeOptions={[5, 10, 15, 20, 50, 100]}
          pagination={pagination}
          onPaginationChange={setPagination}
          isLoading={isLoading}
          manualPagination={true}
          pageCount={pageCount}
        >
          <div className='flex gap-4 text-xs'>
            <p>
              {t('complaintManagement.waiting') + ':'}{' '}
              <span className='text-primary'>{summary?.waiting_count || 0}</span>
            </p>
            <p>
              {t('complaintManagement.processed') + ':'}{' '}
              <span className='text-primary'>{summary?.assigned_count || 0}</span>
            </p>
            <p>
              {t('complaintManagement.completed') + ':'}{' '}
              <span className='text-primary'>{summary?.completed_count || 0}</span>
            </p>
          </div>
        </DataTable>
      </Card>
    </div>
  );
};
