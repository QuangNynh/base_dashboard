import { DataTable } from '@/components/common/data-table';
import { HeaderDetail } from '@/components/common/HeaderDetail';
import { MinutesFileList } from '@/components/pages/violation-report-conclude/MinutesFileList';
import { MinutesTableSection } from '@/components/pages/violation-report-conclude/MinutesTableSection';
import {
  orDash,
  useTrackingColumns,
  useViolationUnitColumns,
} from '@/components/pages/violation-report-conclude/useMinutesColumns';
import ViolationReportInfoCard, {
  InfoRow,
} from '@/components/pages/violation-report-conclude/ViolationReportInfoCard';
import { ViolationReportStatusBadge } from '@/components/common/StatusBadge';
import { FORMAT_DATE } from '@/constants/utils';
import {
  VIOLATION_ACTION_TYPE,
  VIOLATION_ACTION_TYPE_LABEL_KEY,
  type ViolationActionType,
} from '@/constants/options';
import { formatDateTime, handleApiError } from '@/lib/utils';
import { violationReportService } from '@/services/violationReport';
import type {
  MinutesDetailActionHistory,
  MinutesDetailExplainHistory,
  ViolationUnitItem,
  MinutesProcessViolation,
  MinutesDetailData,
} from '@/types/violation-report-management';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { STATUS_VIOLATION_CODE } from '../../../constants/status';
import { TooltipCustom } from '@/components/common/TooltipCustom';

export const SectionTitle = ({ title }: { title: string }) => (
  <div className='bg-[#F8F8FA] px-4 py-3 rounded-t-md'>
    <h3 className='text-primary font-semibold'>{title}</h3>
  </div>
);

const formatPercent = (value?: number | null) => {
  if (value == null) return '--';
  return `${Number.isInteger(value) ? value : value}%`;
};

export const mapInfoViolationUnitItem = (listHistory?: MinutesProcessViolation[]) => {
  return (
    listHistory?.map((item) => {
      const code = item?.actorPostOfficeCode;
      const name = item?.actorPostOfficeName;
      const postOffice = code && name ? `${code} - ${name}` : (code ?? name ?? '--');

      return {
        postOffice,
        branchName: item?.branch?.postName,
        content: item?.content ?? '--',
        individual:
          item?.violatingUsers
            ?.map((tmp) => `${tmp?.staffCode ?? ''} - ${tmp?.fullName ?? ''}`)
            ?.join(', ') ?? '--',
        isCorrect:
          item?.confirmYesNo === 'YES'
            ? 'ttvhEvaluation.categoryEvaluation.correct'
            : item?.confirmYesNo === 'NO'
              ? 'ttvhEvaluation.categoryEvaluation.incorrect'
              : '--',
        attachedFiles: item?.attachedFiles ?? [],
        compensationRate: formatPercent(item?.compensationRatio),
      };
    }) ?? []
  );
};

export const getViolationNameDetail = (detail?: MinutesDetailData) => {
  if (!detail) return '-';
  const names = detail?.createdViolatingPersons?.map((p) => p?.personName).filter(Boolean) ?? [];
  return names.length ? names.join(', ') : '-';
};

export const showViolatorName = (status?: number) => {
  return STATUS_VIOLATION_CODE.CANCELLED !== status && STATUS_VIOLATION_CODE.COMPLETED !== status;
};

const ViolationReportDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const location = useLocation();

  const [trackingPagination, setTrackingPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [actionPagination, setActionPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [explainPagination, setExplainPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [unitPagination, setUnitPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const numericId = id ? Number(id) : 0;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['minutes-detail', numericId, location.key],
    queryFn: () => violationReportService.getDetailMinutesDetail(numericId),
    enabled: !!numericId,
  });

  useEffect(() => {
    if (error) handleApiError(error, undefined, 'fetchError');
  }, [error]);

  const detail = response?.data;

  // Shared column definitions — extracted to avoid duplication with violation-report-explanation
  const trackingColumns = useTrackingColumns();
  const violationUnitColumns = useViolationUnitColumns();

  const actionHistoryColumns = useMemo<ColumnDef<MinutesDetailActionHistory>[]>(
    () => [
      {
        id: 'stt',
        size: 40,
        header: () => <span>{t('common.stt')}</span>,
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return <span>{row.index + 1 + pageIndex * pageSize}</span>;
        },
        meta: { className: 'px-3' },
      },
      {
        accessorKey: 'createdAt',
        header: t('violationReportConclude.colActionTime'),
        cell: ({ getValue }) => {
          const val = getValue<string | undefined>();
          return <span>{val ? formatDateTime(val, FORMAT_DATE.FULL_DATE_TIME) : '--'}</span>;
        },
        meta: {
          className: 'px-3',
        },
      },
      {
        accessorKey: 'actorPostOfficeName',
        header: t('violationReportConclude.colActionUnit'),
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 200,
      },
      {
        accessorKey: 'actorName',
        header: t('violationReportConclude.colActor'),
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        accessorKey: 'actionType',
        header: t('violationReportConclude.colAction'),
        cell: ({ getValue, row }) => {
          const val = getValue<string | undefined>();
          const labelKey = val
            ? VIOLATION_ACTION_TYPE_LABEL_KEY[val as ViolationActionType]
            : undefined;
          return (
            <>
              <div>{labelKey ? t(labelKey) : orDash(val)}</div>
              {!!val &&
                [VIOLATION_ACTION_TYPE.TTVH_CORRECT, VIOLATION_ACTION_TYPE.TTVT_WRONG].includes(
                  val as 'TTVH_CORRECT' | 'TTVT_WRONG'
                ) && (
                  <div className='mt-1 text-xs text-primary'>
                    [{t('violationReportConclude.ttvhConclude')}]: {row.original?.content || '--'}
                  </div>
                )}
            </>
          );
        },
        meta: { className: 'px-3' },
      },
      // {
      //   accessorKey: 'content',
      //   header: t('violationReportConclude.colContent'),
      //   cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
      //   meta: { className: 'px-3' },
      //   size: 300,
      // },
    ],
    [t]
  );

  const explainHistoryColumns = useMemo<ColumnDef<MinutesDetailExplainHistory>[]>(
    () => [
      {
        id: 'stt',
        size: 40,
        header: () => <span>{t('common.stt')}</span>,
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return <span>{row.index + 1 + pageIndex * pageSize}</span>;
        },
        meta: { className: 'px-3 whitespace-break-spaces' },
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
        size: 150,
      },
      {
        accessorKey: 'createdAt',
        header: t('violationReportConclude.colInputTime'),
        cell: ({ getValue }) => {
          const val = getValue<string | undefined>();
          return <span>{val ? formatDateTime(val, FORMAT_DATE.FULL_DATE_TIME) : '--'}</span>;
        },
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 100,
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
        size: 300,
      },
      {
        id: 'attachmentFile',
        header: t('violationReportConclude.colAttachmentFile'),
        cell: ({ row }) => <MinutesFileList files={row.original.attachedFiles ?? []} />,
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 300,
      },
    ],
    [t]
  );

  // Stable data references — prevents TanStack Table autoResetPageIndex from firing on every render
  const trackingItems = useMemo(() => detail?.items ?? [], [detail?.items]);
  const actionItems = useMemo(() => detail?.actions ?? [], [detail?.actions]);
  const explainItems = useMemo(
    () => detail?.minutesProcessHistories ?? [],
    [detail?.minutesProcessHistories]
  );
  const violationUnitItems = useMemo<ViolationUnitItem[]>(
    () => mapInfoViolationUnitItem(detail?.minutesProcessViolatingHistories),
    [detail?.minutesProcessViolatingHistories]
  );
  const attachmentFiles = useMemo(() => detail?.attachedFiles ?? [], [detail]);

  const statusBadge = useMemo(
    () => (detail?.status != null ? <ViolationReportStatusBadge status={detail.status} /> : null),
    [detail]
  );

  const isShowViolationName = useMemo(() => showViolatorName(detail?.status), [detail?.status]);

  const violatorNames = useMemo(() => {
    return getViolationNameDetail(detail);
  }, [detail]);

  return (
    <div className='flex flex-col gap-4'>
      <HeaderDetail
        title={`${t('violationReportConclude.titleDetailMinutes')}: ${detail?.minutesCode ?? id ?? ''}`}
      />

      <ViolationReportInfoCard
        generalInfo={
          <>
            <InfoRow
              label={t('violationReportConclude.lblRecordCreator')}
              value={detail?.createdByEmployeeName}
            />
            <InfoRow
              label={t('violationReportConclude.lblRecordCode')}
              value={detail?.minutesCode}
            />
            <InfoRow
              label={t('violationReportConclude.lblReferenceCode')}
              value={detail?.refMinutesCode}
            />
            <InfoRow
              label={t('violationReportConclude.lblPostOfficeFiled')}
              value={detail?.targetPostOfficeName}
            />
            <InfoRow
              label={t('violationReportConclude.lblCreatingPostOffice')}
              value={detail?.createdPostOfficeName}
            />
            <InfoRow label={t('violationReportConclude.lblStatus')}>{statusBadge}</InfoRow>
          </>
        }
        errorInfo={
          <>
            <InfoRow
              label={t('violationReportConclude.lblErrorCode')}
              value={detail?.mistakeCode}
            />
            <InfoRow
              label={t('violationReportConclude.lblErrorDetail')}
              value={detail?.mistakeDescription}
            />
            {isShowViolationName && (
              <InfoRow label={t('violationReportConclude.lblViolator')} value={violatorNames} />
            )}
          </>
        }
        contentInfo={
          <>
            <InfoRow
              label={t('violationReportConclude.lblRecordContent')}
              value={detail?.content}
            />
            <InfoRow label={t('violationReportConclude.lblAttachmentFile')}>
              <MinutesFileList files={attachmentFiles} />
            </InfoRow>
            <InfoRow
              label={t('violationReportConclude.lblKpiExplainDeadline')}
              value={formatDateTime(detail?.explainExpiredAt, FORMAT_DATE.FULL_DATE_TIME)}
            />
          </>
        }
      />

      <MinutesTableSection title={t('violationReportConclude.sectionTrackingForRecord')}>
        <DataTable
          columns={trackingColumns}
          data={trackingItems}
          emptyHeight='h-40'
          pagination={trackingPagination}
          onPaginationChange={setTrackingPagination}
          manualPagination={false}
          isLoading={isLoading}
          errorMessage={t('violationReportConclude.noData')}
        />
      </MinutesTableSection>

      {!!detail && detail?.status != STATUS_VIOLATION_CODE.CANCELLED && (
        <MinutesTableSection title={t('violationReportConclude.sectionViolationUnit')}>
          <DataTable
            columns={violationUnitColumns}
            emptyHeight='h-40'
            data={violationUnitItems}
            pagination={unitPagination}
            onPaginationChange={setUnitPagination}
            manualPagination={false}
            isLoading={isLoading}
            errorMessage={t('violationReportConclude.noData')}
          />
        </MinutesTableSection>
      )}

      <MinutesTableSection title={t('violationReportConclude.sectionActionHistory')}>
        <DataTable
          columns={actionHistoryColumns}
          emptyHeight='h-40'
          data={actionItems}
          pagination={actionPagination}
          onPaginationChange={setActionPagination}
          manualPagination={false}
          isLoading={isLoading}
          errorMessage={t('violationReportConclude.noData')}
        />
      </MinutesTableSection>

      <MinutesTableSection title={t('violationReportConclude.sectionExplainHistory')}>
        <DataTable
          columns={explainHistoryColumns}
          emptyHeight='h-40'
          data={explainItems}
          pagination={explainPagination}
          onPaginationChange={setExplainPagination}
          manualPagination={false}
          isLoading={isLoading}
          errorMessage={t('violationReportConclude.noData')}
        />
      </MinutesTableSection>
    </div>
  );
};

export default ViolationReportDetail;
