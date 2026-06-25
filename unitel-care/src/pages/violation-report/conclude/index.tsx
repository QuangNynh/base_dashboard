import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../router/routes.config';
import { FilterViolationReport } from '../../../components/pages/violation-report-conclude/FilterViolationReport';
import type {
  ViolationReportFilterData,
  ViolationReportListItem,
} from '../../../types/violation-report-management';
import { useEffect, useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ViolationReportTable } from '../../../components/pages/violation-report-conclude/ViolationReportTable';
import { cleanParams, extractBlobApiError, handleApiError } from '../../../lib/utils';
import { violationReportService } from '@/services/violationReport';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

const ViolationReportConcludeList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [dataFilter, setDataFilter] = useState<ViolationReportFilterData>({
    keyword: '',
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: dataListConclude,
    isLoading: isLoadingListConclude,
    error: errorListConclude,
    refetch,
  } = useQuery({
    queryKey: [
      'list-conclude',
      location.key,
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
      return violationReportService.getListViolationConclude({
        ...params,
      });
    },
    staleTime: 0,
  });

  useEffect(() => {
    const cleaned = cleanParams(dataFilter);

    const isOnlyKeyword =
      cleaned &&
      Object.keys(cleaned).length === 1 &&
      Object.prototype.hasOwnProperty.call(cleaned, 'keyword');

    if (errorListConclude && isOnlyKeyword) {
      handleApiError(errorListConclude, undefined, 'fetchError');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorListConclude]);

  const { mutateAsync: exportConclude, isPending: isExporting } = useMutation({
    mutationFn: () => {
      const { status, mistakeCode, postOfficeId, ...restFilter } = dataFilter;
      const params = {
        ...restFilter,
        ...(status?.length && { status: status.join(',') }),
        ...(mistakeCode?.length && { mistakeCode: mistakeCode.join(',') }),
        ...(postOfficeId?.length && { postOfficeId: postOfficeId.join(',') }),
      };
      return violationReportService.getViolationConcludeExport({
        ...params,
      });
    },

    onSuccess: (file: Blob) => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      saveAs(file, `Danh_sach_bien_ban_ket_luan_${dd}${mm}${yyyy}.xlsx`);
    },
    onError: async (error: unknown) => {
      const errorMessage = await extractBlobApiError(error, t('common.exportError'));
      toast.error(errorMessage);
    },
  });

  const handleSearch = (data: ViolationReportFilterData) => {
    setDataFilter({ ...data });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <FilterViolationReport
        variant='conclude'
        onSubmit={handleSearch}
        onExport={exportConclude}
        onCreate={() => navigate(ROUTES.VIOLATION_REPORT_CREATE)}
        loadingExport={isExporting}
      />
      <ViolationReportTable
        variant='conclude'
        data={(dataListConclude?.data?.page_data as unknown as ViolationReportListItem[]) || []}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoadingListConclude}
        pageCount={dataListConclude?.data?.pagination?.totalPages}
      />
    </div>
  );
};

export default ViolationReportConcludeList;
