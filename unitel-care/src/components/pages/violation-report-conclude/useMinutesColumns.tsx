import { MinutesFileList } from '@/components/pages/violation-report-conclude/MinutesFileList';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import type { MinutesDetailItem, ViolationUnitItem } from '@/types/violation-report-management';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const FALLBACK = '--';

/** Returns the value if it's a non-empty, non-whitespace string; otherwise returns '--'. */
export const orDash = (val: string | undefined | null): string =>
  val?.trim() ? val.trim() : FALLBACK;

export function useTrackingColumns(): ColumnDef<MinutesDetailItem>[] {
  const { t } = useTranslation();

  return useMemo<ColumnDef<MinutesDetailItem>[]>(
    () => [
      {
        id: 'stt',
        size: 70,
        header: () => <span>{t('common.stt')}</span>,
        cell: ({ row }) => <span>{row.index + 1}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'itemCode',
        header: t('violationReportConclude.colTrackingCodeShort'),
        cell: ({ row }) => <span>{orDash(row.original?.itemCode)}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'itemType',
        header: t('violationReportConclude.colType'),
        cell: ({ row }) => {
          const itemType = row.original?.itemType?.trim();
          let label = FALLBACK;
          if (itemType === 'ORDER') label = t('violationReportConclude.trackingTypeVanDon');
          else if (itemType === 'PACKAGE') label = t('violationReportConclude.trackingTypeTaiKien');
          return <span>{label}</span>;
        },
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'rootPostOfficeName',
        header: t('violationReportConclude.colOriginPostOffice'),
        cell: ({ row }) => (
          <span>
            {[row.original?.rootPostOfficeCode, row.original?.rootPostOfficeName]
              ?.filter(Boolean)
              ?.join(' - ') ?? '--'}
          </span>
        ),
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'loadCode',
        header: t('violationReportConclude.colShipmentCode'),
        cell: ({ row }) => <span>{orDash(row.original?.loadCode)}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'complaintCodes',
        header: t('violationReportConclude.colComplaintCount'),
        cell: ({ row }) => <span>{orDash(row.original?.complaintCodes)}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
    ],
    [t]
  );
}

export function useViolationUnitColumns(): ColumnDef<ViolationUnitItem>[] {
  const { t } = useTranslation();

  return useMemo<ColumnDef<ViolationUnitItem>[]>(
    () => [
      {
        id: 'stt',
        size: 70,
        header: () => <span>{t('common.stt')}</span>,
        cell: ({ row }) => <span>{row.index + 1}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'postOffice',
        header: t('violationReportConclude.colUnit'),
        cell: ({ row }) => <span>{orDash(row.original?.postOffice)}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'branchName',
        header: t('violationReportConclude.colBranch'),
        cell: ({ row }) => <span>{orDash(row.original?.branchName)}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'content',
        header: t('violationReportConclude.colProcessContent'),
        cell: ({ row }) => <span>{orDash(row.original?.content)}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'individual',
        header: t('violationReportConclude.colViolator'),
        cell: ({ row }) => {
          const name = orDash(row.original?.individual);
          if (name === FALLBACK) return <span>{FALLBACK}</span>;
          return (
            <TooltipCustom content={name}>
              <span className='line-clamp-2'>{name}</span>
            </TooltipCustom>
          );
        },
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'isCorrect',
        header: t('violationReportConclude.colIsCorrect'),
        cell: ({ row }) => {
          const key = row.original?.isCorrect?.trim();
          // key is an i18n path (e.g. 'ttvhEvaluation.categoryEvaluation.correct') or '--'
          const text = key && key !== FALLBACK ? t(key) : FALLBACK;
          return <span>{text}</span>;
        },
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 80,
      },
      {
        accessorKey: 'attachmentFile',
        header: t('violationReportConclude.colAttachmentFile'),
        cell: ({ row }) => <MinutesFileList files={row.original.attachedFiles ?? []} />,
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 300,
      },
      {
        accessorKey: 'compensationRate',
        header: t('violationReportConclude.colCompensationRate'),
        cell: ({ row }) => <span>{orDash(row.original?.compensationRate)}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 80,
      },
    ],
    [t]
  );
}
