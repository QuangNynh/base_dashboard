import { DataTable } from '@/components/common/data-table';
import { DialogCustom } from '@/components/common/DialogCustom';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { MinutesFileList } from '@/components/pages/violation-report-conclude/MinutesFileList';
import { orDash } from '@/components/pages/violation-report-conclude/useMinutesColumns';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime } from '@/lib/utils';
import type { MinutesDetailExplainHistory } from '@/types/violation-report-management';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  data: MinutesDetailExplainHistory[];
}

const DialogHistoryExplaination = ({ open, onClose, data }: Props) => {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // Must be memoized — non-memoized columns cause useReactTable to dispatch on every render → infinite loop
  const columns = useMemo<ColumnDef<MinutesDetailExplainHistory>[]>(
    () => [
      {
        id: 'stt',
        size: 70,
        header: () => <span>{t('common.stt')}</span>,
        // Read pagination from table state — avoids columns depending on pagination state
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return <span>{row.index + 1 + pageIndex * pageSize}</span>;
        },
        meta: { className: 'px-3' },
      },
      {
        accessorKey: 'actorPostOfficeName',
        header: t('violationReportConclude.colPostOfficeInput'),
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2'>{orDash(getValue<string>())}</span>
          </TooltipCustom>
        ),
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'createdAt',
        header: t('violationReportConclude.colInputTime'),
        cell: ({ getValue }) => {
          const val = getValue<string | undefined>();
          return <span>{val ? formatDateTime(val, FORMAT_DATE.FULL_DATE_TIME) : '--'}</span>;
        },
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'content',
        header: t('violationReportConclude.colContent'),
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2'>{orDash(getValue<string>())}</span>
          </TooltipCustom>
        ),
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        id: 'attachmentFile',
        header: t('violationReportConclude.colAttachmentFile'),
        cell: ({ row }) => <MinutesFileList files={row.original.attachedFiles ?? []} />,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
    ],
    [t]
  );

  return (
    <DialogCustom
      open={open}
      onclose={onClose}
      title={t('violationReportConclude.sectionExplainHistory')}
      className='h-fit'
    >
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageSizeOptions={[20, 50, 100]}
        manualPagination={false}
        errorMessage={t('violationReportConclude.noData')}
      />
    </DialogCustom>
  );
};

export default DialogHistoryExplaination;
