import { FilterViolationReport } from '@/components/pages/violation-report-conclude/FilterViolationReport';
import { ViolationReportTable } from '@/components/pages/violation-report-conclude/ViolationReportTable';
import { cleanParams, extractBlobApiError, handleApiError } from '@/lib/utils';
import { violationReportService } from '@/services/violationReport';
import type {
  ViolationReportFilterData,
  ViolationReportListItem,
} from '@/types/violation-report-management';
import type { PaginationState } from '@tanstack/react-table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/router/routes.config';
import TabListCustom from '@/components/common/TabListCustom';

type TabKey = 'incoming' | 'outgoing';

interface TabContentProps {
  tabKey: TabKey;
}

const ViolationReportTabContent = ({ tabKey }: TabContentProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dataFilter, setDataFilter] = useState<ViolationReportFilterData>({ keyword: '' });
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'violation-report-list',
      tabKey,
      pagination.pageIndex,
      pagination.pageSize,
      dataFilter,
    ],
    queryFn: () => {
      const { status, mistakeCode, postOfficeId, ...restFilter } = dataFilter;
      const params = {
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
        ...restFilter,
        ...(status?.length && { status: status.join(',') }),
        ...(mistakeCode?.length && { mistakeCode: mistakeCode.join(',') }),
        ...(postOfficeId?.length && { postOfficeId: postOfficeId.join(',') }),
      };
      return tabKey === 'incoming'
        ? violationReportService.getListMinutesInComing(params)
        : violationReportService.getListMinutesOutGoing(params);
    },
  });

  useEffect(() => {
    if (!error) return;
    const cleaned = cleanParams(dataFilter);
    const isOnlyKeyword =
      cleaned &&
      Object.keys(cleaned).length === 1 &&
      Object.prototype.hasOwnProperty.call(cleaned, 'keyword');
    if (isOnlyKeyword) {
      handleApiError(error, undefined, 'fetchError');
    }
    // dataFilter intentionally omitted — only re-run when error changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const { mutateAsync: exportList, isPending: isExporting } = useMutation({
    mutationFn: () => {
      const { status, mistakeCode, postOfficeId, ...restFilter } = dataFilter;
      const params = {
        ...restFilter,
        ...(status?.length && { status: status.join(',') }),
        ...(mistakeCode?.length && { mistakeCode: mistakeCode.join(',') }),
        ...(postOfficeId?.length && { postOfficeId: postOfficeId.join(',') }),
      };
      return tabKey === 'incoming'
        ? violationReportService.getMinutesInComingExport(params)
        : violationReportService.getMinutesOutGoingExport(params);
    },
    onSuccess: (file: Blob) => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      saveAs(
        file,
        `Danh_sach_bien_ban_${tabKey == 'incoming' ? 'den' : 'di'}_${dd}${mm}${yyyy}.xlsx`
      );
    },
    onError: async (error: unknown) => {
      const errorMessage = await extractBlobApiError(error, t('common.exportError'));
      toast.error(errorMessage);
    },
  });

  const handleSearch = (filterData: ViolationReportFilterData) => {
    setDataFilter(filterData);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleCreate = useCallback(() => navigate(ROUTES.VIOLATION_REPORT_CREATE), [navigate]);

  const handleExplain = useCallback(
    (item: ViolationReportListItem) => {
      if (!item.id) return;
      navigate(ROUTES.VIOLATION_REPORT_EXPLAIN.replace(':id', String(item.id)), {
        state: { tabKey },
      });
    },
    [navigate, tabKey]
  );

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <FilterViolationReport
        variant={tabKey}
        onSubmit={handleSearch}
        onExport={exportList}
        onCreate={handleCreate}
        loadingExport={isExporting}
      />
      <ViolationReportTable
        variant='list'
        tabKey={tabKey}
        data={data?.data?.page_data ?? []}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        pageCount={data?.data?.pagination?.totalPages}
        onExplain={handleExplain}
      />
    </div>
  );
};

const ViolationReportList = () => {
  const { t } = useTranslation();

  const tabTrigger = useMemo(
    () => [
      {
        value: 'incoming',
        labelKey: t('violationReportConclude.tabIncoming'),
        component: <ViolationReportTabContent tabKey='incoming' />,
      },
      {
        value: 'outgoing',
        labelKey: t('violationReportConclude.tabOutgoing'),
        component: <ViolationReportTabContent tabKey='outgoing' />,
      },
    ],
    [t]
  );

  return <TabListCustom tabTrigger={tabTrigger} />;
};

export default ViolationReportList;
