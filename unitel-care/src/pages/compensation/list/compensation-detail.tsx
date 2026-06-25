import { DataTable } from '@/components/common/data-table';
import { MinutesFileList } from '@/components/pages/violation-report-conclude/MinutesFileList';
import { CompensationProfileCard } from '@/components/pages/compensation/list/CompensationProfileCard';
import { CompensationRateTable } from '@/components/pages/compensation/list/CompensationRateTable';
import { DetailField, SectionPanel } from '@/components/pages/compensation/list/CompensationShared';
import { ActionHistoryCompensationBadge } from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import {
  CASE_COMPENSATION_TRANSLATION_KEY,
  type ActionHistoryCompensationType,
  type CaseCompensationType,
} from '@/constants/status';
import type { CompensationActionHistory } from '@/types/compensation';
import { orDash } from '@/components/pages/violation-report-conclude/useMinutesColumns';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { ChevronLeft } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatDateTime, formatDigit, getCurrency } from '../../../lib/utils';
import { FORMAT_DATE } from '../../../constants/utils';
import { useCompensationDetail } from '../../../hooks/useCompensationDetail';

const CompensationDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { detailData, isLoading, infoProfileCard } = useCompensationDetail();

  const [ratePagination, setRatePagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [historyPagination, setHistoryPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const dataRates = useMemo(() => detailData?.violatingPostOffices ?? [], [detailData]);
  const dataHistory = useMemo(() => detailData?.actionHistories ?? [], [detailData]);

  const historyColumns = useMemo<ColumnDef<CompensationActionHistory>[]>(
    () => [
      {
        id: 'stt',
        size: 60,
        header: t('common.stt'),
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ row }) => <span>{row.index + 1}</span>,
      },
      {
        accessorKey: 'actionType',
        header: t('compensation.detail.colStatus'),
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 180,
        cell: ({ getValue }) => (
          <ActionHistoryCompensationBadge status={getValue<ActionHistoryCompensationType>()} />
        ),
      },
      {
        accessorKey: 'createdAt',
        header: t('compensation.detail.colDateTime'),
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 160,
        cell: ({ getValue }) => {
          const date = getValue<string | undefined>();
          return <span>{date ? formatDateTime(date, FORMAT_DATE.FULL_DATE_TIME) : '--'}</span>;
        },
      },
      {
        accessorKey: 'actorPostOfficeName',
        header: t('compensation.detail.colUnit'),
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
      },
      {
        accessorKey: 'actorName',
        header: t('compensation.detail.colActor'),
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
      },
      {
        accessorKey: 'caseType',
        header: t('compensation.detail.colProfileType'),
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => (
          <span>
            {t(`${orDash(CASE_COMPENSATION_TRANSLATION_KEY[getValue() as CaseCompensationType])}`)}
          </span>
        ),
      },
      {
        accessorKey: 'content',
        header: t('compensation.detail.colContent'),
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
      },
      {
        accessorKey: 'files',
        header: t('compensation.detail.colFile'),
        meta: { className: 'px-3 whitespace-break-spaces' },
        cell: ({ row }) => <MinutesFileList files={row.original.files ?? []} />,
      },
    ],
    [t]
  );

  return (
    <div className='flex flex-col gap-4'>
      {/* Header */}
      <Card className='py-2 px-4'>
        <div className='flex items-center gap-2'>
          <div
            className='bg-primary p-0.5 rounded-full text-background cursor-pointer'
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className='w-4 h-4' />
          </div>
          <span className='text-[17px] font-medium'>
            {t('compensation.detail.title')}: {detailData?.compensationCode ?? '--'}
          </span>
        </div>
      </Card>

      {/* Thông tin hồ sơ - 3 cột */}
      <CompensationProfileCard detail={infoProfileCard} />

      {/* Thông tin tỷ lệ đến bù */}
      <CompensationRateTable
        data={dataRates}
        isLoading={isLoading}
        pagination={ratePagination}
        onPaginationChange={setRatePagination}
      />

      {/* Thông tin đến bù vận đơn + Thông tin chuyển khoản */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <SectionPanel
          title={`${t('compensation.detail.sectionWaybillInfo')}: ${detailData?.itemCode ?? '--'}`}
        >
          <div className='grid grid-cols-2 gap-3'>
            <DetailField
              label={`${t('compensation.detail.lblGoodsValue')} (${getCurrency()})`}
              value={formatDigit(detailData?.goodsValue)}
            />
            <DetailField
              label={`${t('compensation.detail.lblInvoiceValue')} (${getCurrency()})`}
              value={formatDigit(detailData?.invoiceValue)}
            />
            <DetailField
              label={`${t('compensation.detail.lblCod')} (${getCurrency()})`}
              value={formatDigit(detailData?.codAmount)}
            />
            <DetailField
              label={t('compensation.detail.lblService')}
              value={
                [detailData?.serviceName, ...(detailData?.vasName ?? [])]
                  .filter(Boolean)
                  .join(', ') || '—-'
              }
            />
            <DetailField
              label={t('compensation.detail.lblGoodsContent')}
              value={orDash(detailData?.goodsContent)}
            />
            <DetailField
              label={`${t('compensation.detail.lblBcgValue')} (${getCurrency()})`}
              value={
                detailData?.bcgCompensationAmount != null
                  ? `${Number(detailData?.bcgCompensationAmount || 0)}`
                  : '--'
              }
            />
            <DetailField
              label={t('compensation.detail.lblBcgInfo')}
              value={orDash(detailData?.bcgCompensationContent)}
            />
            <div className='flex flex-col gap-1'>
              <span className='text-sm font-semibold'>{t('compensation.detail.lblDocuments')}</span>
              <div className='text-sm bg-white min-h-[38px] text-[#44494D]'>
                <MinutesFileList files={detailData?.documentFiles ?? []} />
              </div>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title={t('compensation.detail.sectionBankInfo')}>
          <div className='grid grid-cols-2 gap-3'>
            <DetailField
              label={t('compensation.detail.lblCustomerId')}
              value={detailData?.customerCode != null ? String(detailData.customerCode) : '--'}
            />
            <DetailField
              label={t('compensation.detail.lblCustomerName')}
              value={orDash(detailData?.customerName)}
            />
            <DetailField
              label={t('compensation.detail.lblIdNumber')}
              value={orDash(detailData?.customerIdentityNo)}
            />
            <DetailField
              label={t('compensation.detail.lblPhone')}
              value={orDash(detailData?.customerPhone)}
            />
            <DetailField
              label={t('compensation.detail.lblEmail')}
              value={orDash(detailData?.customerEmail)}
            />
            <DetailField
              label={t('compensation.detail.lblAddress')}
              value={orDash(detailData?.customerAddress)}
            />
            <DetailField
              label={t('compensation.detail.lblBank')}
              value={orDash(detailData?.bankName)}
            />
            <DetailField
              label={t('compensation.detail.lblAccountNumber')}
              value={orDash(detailData?.bankAccountNo)}
            />
            <DetailField
              label={t('compensation.detail.lblBeneficiary')}
              value={orDash(detailData?.beneficiaryName)}
            />
            {/* <DetailField
              label={t('compensation.detail.lblDebitAccount')}
              value={orDash(detailData?.debitAccountNo)}
            /> */}
          </div>
        </SectionPanel>
      </div>

      {/* Lịch sử tác động */}
      <SectionPanel title={t('compensation.detail.sectionActionHistory')}>
        <DataTable
          columns={historyColumns}
          data={dataHistory}
          pagination={historyPagination}
          onPaginationChange={setHistoryPagination}
          isLoading={isLoading}
          manualPagination={false}
          errorMessage={t('compensation.detail.noData')}
        />
      </SectionPanel>
    </div>
  );
};

export default CompensationDetail;
