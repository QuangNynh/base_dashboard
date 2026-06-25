import { FORMAT_DATE } from '@/constants/utils';
import { cleanParams, extractErrorMessage, formatDateTime, handleApiError } from '@/lib/utils';
import { ROUTES } from '@/router/routes.config';
import { complaintService } from '@/services/complaintService';
import type { ComplaintFilterData, ComplaintListResponse } from '@/types/complaint-management';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import type { AxiosError } from 'axios';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ComplaintTable } from '../../components/pages/complaint-list/ComplaintTable';
import { FilterComplaintList } from '../../components/pages/complaint-list/FilterComplaintList';
import { endOfDay, startOfDay, subDays } from 'date-fns';

const ListComplaintManagement = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const today = endOfDay(new Date());
  const minDate = startOfDay(subDays(new Date(), 14));

  const [dataFilter, setDataFilter] = useState<ComplaintFilterData>({
    keyword: '',
    createdDateFrom: formatDateTime(minDate, FORMAT_DATE.DDMMYYYY),
    createdDateTo: formatDateTime(today, FORMAT_DATE.DDMMYYYY),
    completedDateFrom: '',
    completedDateTo: '',
    complaintType: 'INCOMING',
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: dataListComplaint,
    isLoading: isLoadingListComplaint,
    error: errorListComplaint,
    isFetching,
  } = useQuery<ComplaintListResponse, AxiosError<{ message: string }>>({
    queryKey: ['list-complaint', pagination.pageIndex, pagination.pageSize, dataFilter],
    queryFn: () =>
      complaintService.getListComplaint({
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
        ...dataFilter,
      }),
    staleTime: 0,
  });

  useEffect(() => {
    const cleaned = cleanParams(dataFilter);

    const hasKeyword = cleaned && Object.prototype.hasOwnProperty.call(cleaned, 'keyword');

    if (errorListComplaint && hasKeyword) {
      handleApiError(errorListComplaint, undefined, 'fetchError');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorListComplaint]);

  const { mutateAsync: exportComplaint, isPending: isExporting } = useMutation({
    mutationFn: () =>
      complaintService.exportComplaint({
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
        ...dataFilter,
      }),

    onSuccess: (file: Blob) => {
      const fileName = `${t('complaintManagement.exportFileName')}_${formatDateTime(new Date(), FORMAT_DATE.YYYYMMDD_ONLY)}.xlsx`;
      saveAs(file, fileName);
    },

    onError: async (error) => {
      const errorMessage = await extractErrorMessage(error, t('common.exportError'));
      toast.error(errorMessage);
    },
  });

  const handleSearch = (data: ComplaintFilterData) => {
    setDataFilter({ ...data });
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page when filtering
  };

  return (
    <>
      <FilterComplaintList
        onSubmit={handleSearch}
        onExport={exportComplaint}
        onCreate={() => navigate(ROUTES.COMPLAINT_MANAGEMENT_CREATE)}
        loadingExport={isExporting}
      />
      <ComplaintTable
        data={errorListComplaint ? [] : dataListComplaint?.data?.page_data || []}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoadingListComplaint || isFetching}
        pageCount={dataListComplaint?.data?.pagination?.totalPages}
        summary={dataListComplaint?.data?.summary}
      />
    </>
  );
};

export default ListComplaintManagement;
