import { DataTable } from '@/components/common/data-table';
import { Card } from '@/components/ui/card';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime, handleApiError } from '@/lib/utils';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import { InfoRow } from '@/components/pages/violation-report-conclude/ViolationReportInfoCard';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { violationReportService } from '@/services/violationReport';
import { ViolationReportStatusBadge } from '@/components/common/StatusBadge';
import type {
  MinutesDetailActionHistory,
  MinutesDetailExplainHistory,
  ViolationUnitItem,
} from '@/types/violation-report-management';
import { MinutesFileList } from '@/components/pages/violation-report-conclude/MinutesFileList';
import { MinutesTableSection } from '@/components/pages/violation-report-conclude/MinutesTableSection';
import {
  orDash,
  useTrackingColumns,
  useViolationUnitColumns,
} from '@/components/pages/violation-report-conclude/useMinutesColumns';
import {
  VIOLATION_ACTION_TYPE,
  VIOLATION_ACTION_TYPE_LABEL_KEY,
  type ViolationActionType,
} from '@/constants/options';
import { STATUS_VIOLATION_CODE } from '@/constants/status';
import { mapInfoViolationUnitItem } from '../list/violation-report-detail';

const ViolationReportConcludeDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [trackingPagination, setTrackingPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [violationPagination, setViolationPagination] = useState<PaginationState>({
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

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['minutes-detail conclude', id, location.key],
    queryFn: () => violationReportService.getDetailMinutesDetail(Number(id)),
    enabled: id != null,
  });

  const detail = response?.data;

  const statusBadge = useMemo(
    () => (detail?.status != null ? <ViolationReportStatusBadge status={detail.status} /> : null),
    [detail]
  );

  const violatorNames = useMemo(
    () =>
      (detail?.createdViolatingPersons ?? [])
        .map((p) => p.personName)
        .filter(Boolean)
        .join(', ') || '-',
    [detail?.createdViolatingPersons]
  );
  const attachmentFiles = useMemo(() => detail?.attachedFiles ?? [], [detail?.attachedFiles]);

  const trackingColumns = useTrackingColumns();
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
        cell: ({ getValue }) => (
          <TooltipCustom content={orDash(getValue<string>())}>
            <span className='line-clamp-2'>{orDash(getValue<string>())}</span>
          </TooltipCustom>
        ),
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 300,
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
        size: 300,
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
        size: 300,
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

  useEffect(() => {
    if (error) handleApiError(error, undefined, 'fetchError');
  }, [error]);

  return (
    <div className='flex flex-col gap-4'>
      <Card className='py-2 px-4'>
        <div className='flex items-center gap-2'>
          <div
            className='bg-primary p-0.5 rounded-full text-background cursor-pointer'
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className='w-4 h-4' />
          </div>
          <span className='text-[17px] font-medium'>
            {t('violationReportConclude.titleDetailMinutes')}
          </span>
        </div>
      </Card>

      {/* Thông tin biên bản */}
      <Card className='p-4'>
        <div className='border grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x'>
          {/* Col 1: Thông tin chung */}
          <div className='flex flex-col'>
            <div className='p-4 bg-[#F4FAFF] border-b'>
              <h4 className='font-semibold text-primary mb-1 text-sm'>
                {t('violationReportConclude.sectionGeneralInfo')}
              </h4>
            </div>
            <div className='flex flex-col p-4 gap-2'>
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
                label={t('violationReportConclude.lblCreatingPostOffice')}
                value={
                  [detail?.createdPostOfficeCode, detail?.createdPostOfficeName]
                    ?.filter(Boolean)
                    .join(' - ') ?? '--'
                }
              />
              <InfoRow
                label={t('violationReportConclude.lblTargetPO')}
                value={
                  [detail?.targetPostOfficeCode, detail?.targetPostOfficeName]
                    ?.filter(Boolean)
                    .join(' - ') ?? '--'
                }
              />
              <InfoRow
                label={t('violationReportConclude.lblCreatedDate')}
                value={formatDateTime(detail?.createdAt, FORMAT_DATE.FULL_DATE_TIME)}
              />
            </div>
          </div>

          {/* Col 2: Thông tin lỗi */}
          <div className='flex flex-col'>
            <div className='p-4 bg-[#F4FAFF] border-b'>
              <h4 className='font-semibold text-primary mb-1 text-sm'>
                {t('violationReportConclude.sectionErrorInfo')}
              </h4>
            </div>
            <div className='flex flex-col p-4 gap-2'>
              <InfoRow
                label={t('violationReportConclude.lblErrorCode')}
                value={detail?.mistakeCode}
              />
              <InfoRow
                label={t('violationReportConclude.lblErrorIndicator')}
                value={detail?.mistakeDescription}
              />
              <InfoRow label={t('violationReportConclude.lblStatus')}>{statusBadge}</InfoRow>
              {detail?.status != null &&
                ![STATUS_VIOLATION_CODE.COMPLETED, STATUS_VIOLATION_CODE.CANCELLED].includes(
                  detail?.status
                ) && (
                  <InfoRow label={t('violationReportConclude.lblViolator')} value={violatorNames} />
                )}
            </div>
          </div>

          {/* Col 3: Nội dung */}
          <div className='flex flex-col'>
            <div className='p-4 bg-[#F4FAFF] border-b'>
              <h4 className='font-semibold text-primary mb-1 text-sm'>
                {t('violationReportConclude.sectionContent')}
              </h4>
            </div>
            <div className='flex flex-col p-4 gap-2'>
              <InfoRow
                label={t('violationReportConclude.lblRecordContent')}
                value={detail?.content}
              />
              <InfoRow label={t('violationReportConclude.lblAttachmentFile')}>
                <MinutesFileList files={attachmentFiles} />
              </InfoRow>
              <InfoRow
                label={t('violationReportConclude.lblKpiDeadline')}
                value={formatDateTime(detail?.concludeExpiredAt, FORMAT_DATE.FULL_DATE_TIME)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Danh sách vận đơn / tải / CCDC */}
      <Card className='p-0 gap-0'>
        <div className='mb-4 bg-[#F8F8FA] px-4 py-3 rounded-t-md'>
          <h3 className='text-primary font-semibold'>
            {t('violationReportConclude.sectionTrackingListShort')}
          </h3>
        </div>
        <div className='px-4 pb-6'>
          <DataTable
            columns={trackingColumns}
            data={trackingItems}
            pagination={trackingPagination}
            onPaginationChange={setTrackingPagination}
            manualPagination
            isLoading={isLoading}
            errorMessage={t('violationReportConclude.noData')}
          />
        </div>
      </Card>

      {/* Đơn vị vi phạm */}
      {!!detail && detail?.status != STATUS_VIOLATION_CODE.CANCELLED && (
        <Card className='p-0 gap-0'>
          <div className='mb-4 bg-[#F8F8FA] px-4 py-3 rounded-t-md'>
            <h3 className='text-primary font-semibold'>
              {t('violationReportConclude.sectionViolationUnit')}
            </h3>
          </div>
          <div className='px-4 pb-6'>
            <DataTable
              columns={violationUnitColumns}
              data={violationUnitItems}
              pagination={violationPagination}
              onPaginationChange={setViolationPagination}
              manualPagination
              isLoading={isLoading}
              errorMessage={t('violationReportConclude.noData')}
            />
          </div>
        </Card>
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

export default ViolationReportConcludeDetail;
