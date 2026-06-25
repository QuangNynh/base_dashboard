import { Card, CardTitle } from '@/components/ui/card';
import { complaintService } from '@/services/complaintService';
import type {
  ErrorCause,
  ErrorCauseResponse,
  ErrorCauseSearch,
} from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateErrorCauseDialog } from './CreateErrorCause';
import { ErrorsCauseTable } from './ErrorsCauseTable';
import { FilterErrorsCause } from './FilterErrorsCause';
import { HistoryErrorCauseDialog } from './HistoryErrorCause';

export const ErrorsCause = () => {
  const { t } = useTranslation();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [dataFilter, setDataFilter] = useState<ErrorCauseSearch>({
    keyword: '',
  });

  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editData, setEditData] = useState<ErrorCause | null>(null);
  const [openHistory, setOpenHistory] = useState<boolean>(false);

  const {
    data: errorCausesData,
    isLoading: isLoadingErrorCauses,
    error: errorMessage,
  } = useQuery<ErrorCauseResponse, AxiosError<{ message: string }>>({
    queryKey: ['error-causes-list', dataFilter, pagination],
    queryFn: () =>
      complaintService.getListErrorCauses({
        ...dataFilter,
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
      }),
  });

  const handleFilterSubmit = (data: ErrorCauseSearch) => {
    setDataFilter({ ...data });
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page when filtering
  };

  return (
    <Card className='p-4'>
      <CardTitle className='text-primary text-xl'>
        {t('settingComplaint.extensionReason.errorCause')}
      </CardTitle>
      <FilterErrorsCause
        onSubmit={handleFilterSubmit}
        onCreate={() => {
          setOpenCreate(true);
          setEditData(null);
        }}
      />

      <ErrorsCauseTable
        data={errorCausesData?.data?.page_data || []}
        setPagination={setPagination}
        pagination={pagination}
        isLoading={isLoadingErrorCauses}
        pageCount={errorCausesData?.data?.pagination?.totalPages}
        onEdit={(data: ErrorCause) => {
          setOpenCreate(true);
          setEditData(data);
        }}
        onHistory={(data: ErrorCause) => {
          setOpenHistory(true);
          setEditData(data);
        }}
        errorMessage={errorMessage?.response?.data?.message || 'kkk'}
      />
      <CreateErrorCauseDialog
        open={openCreate}
        onclose={() => setOpenCreate(false)}
        dataEdit={editData}
      />
      <HistoryErrorCauseDialog
        open={openHistory}
        onclose={() => setOpenHistory(false)}
        id={editData?.id}
      />
    </Card>
  );
};
