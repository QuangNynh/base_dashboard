import FilterCompensationList from '@/components/pages/compensation/list/FilterCompensationList';
import { ROUTES } from '@/router/routes.config';
import type { CompensationListFilterData, CompensationListItem } from '@/types/compensation';
import type { PaginationState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CompensationTable } from '../../../components/pages/compensation/list/CompensationTable';
import { useMutation, useQuery } from '@tanstack/react-query';
import { extractBlobApiError, handleApiError } from '../../../lib/utils';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { compensationService } from '@/services/compensation';
import { compact } from 'lodash';
import { violationReportService } from '../../../services/violationReport';

const ListCompensation = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [dataFilter, setDataFilter] = useState<CompensationListFilterData>({
    keyword: '',
    postOfficeIds: [],
  });

  const { data: postOfficesRes } = useQuery({
    queryKey: ['compensation-list-post-offices'],
    queryFn: () => violationReportService.getListAccessiblePostOffice(''),
    staleTime: 5 * 60 * 1000,
  });

  const postOfficeOptions = useMemo(
    () =>
      (postOfficesRes?.data ?? []).map((item) => ({
        value: item.departmentId,
        label: compact([item.code, item.name]).join(' - '),
      })),
    [postOfficesRes]
  );

  const {
    data: dataListCompensation,
    isLoading: isLoadingListCompensation,
    error: errorListCompensation,
  } = useQuery({
    queryKey: [
      'list-compensation',
      location.key,
      pagination.pageIndex,
      pagination.pageSize,
      dataFilter,
    ],
    queryFn: () => {
      const { status, postOfficeIds, keyword, fromDate, toDate } = dataFilter;
      return compensationService.listCompensationCases({
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
        keyword,
        fromDate,
        toDate,
        ...(status?.length && { status: status.join(',') }),
        ...(postOfficeIds?.length && { postOfficeIds: postOfficeIds.join(',') }),
      });
    },
    staleTime: 0,
    gcTime: 0,
  });

  const { mutate: exportList, isPending: isExporting } = useMutation({
    mutationFn: () => {
      const { status, postOfficeIds, keyword, fromDate, toDate } = dataFilter;
      return compensationService.exportExelCompensationList({
        keyword,
        fromDate,
        toDate,
        ...(status?.length && { status: status.join(',') }),
        ...(postOfficeIds?.length && { postOfficeIds: postOfficeIds.join(',') }),
      });
    },
    onSuccess: (file: Blob) => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      saveAs(file, `${t('compensation.fileNameListCompensationExel')}_${dd}${mm}${yyyy}.xlsx`);
    },
    onError: async (err: unknown) => {
      const message = await extractBlobApiError(err, t('common.exportError'));
      toast.error(message);
    },
  });

  const { mutateAsync: getExampleFile, isPending: loadingExampleFile } = useMutation({
    mutationFn: () => compensationService.getExampleFile(),
    onSuccess: (file: Blob) => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      saveAs(file, `Mau_Hosoboithuong_${dd}${mm}${yyyy}`);
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: Blob | { message?: string } }; message?: string };
      const fallback = t('compensation.exampleDownloadError');

      if (e?.response?.data instanceof Blob) {
        e.response.data
          .text()
          .then((text) => {
            try {
              const json = JSON.parse(text);
              toast.error(json?.message || fallback);
            } catch {
              toast.error(fallback);
            }
          })
          .catch(() => toast.error(fallback));
        return;
      }

      const message =
        (e?.response?.data as { message?: string })?.message ?? e?.message ?? fallback;
      toast.error(message);
    },
  });

  useEffect(() => {
    if (errorListCompensation) {
      handleApiError(errorListCompensation, undefined, 'fetchError');
    }
  }, [errorListCompensation]);

  const handleFilterSubmit = useCallback((data: CompensationListFilterData) => {
    setDataFilter(data);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleDetail = useCallback(
    (item: CompensationListItem) => {
      navigate(ROUTES.COMPENSATION_DETAIL.replace(':id', String(item.id)));
    },
    [navigate]
  );

  const handleComplete = useCallback(
    (item: CompensationListItem) => {
      navigate(ROUTES.COMPENSATION_COMPLETE.replace(':id', String(item.id)));
    },
    [navigate]
  );

  return (
    <div className='flex flex-col gap-4'>
      <FilterCompensationList
        onSubmit={handleFilterSubmit}
        onExport={exportList}
        postOfficeOptions={postOfficeOptions}
        loadingExport={isExporting}
      />
      <CompensationTable
        data={dataListCompensation?.data?.page_data || []}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoadingListCompensation}
        pageCount={dataListCompensation?.data?.pagination?.totalPages || 1}
        onDetail={handleDetail}
        onComplete={handleComplete}
        getExampleFile={getExampleFile}
        loadingExampleFile={loadingExampleFile}
      />
    </div>
  );
};

export default ListCompensation;
