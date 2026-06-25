import { Card, CardTitle } from '@/components/ui/card';
import { complaintService } from '@/services/complaintService';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type {
  ErrorCauseSearch,
  ExtensionReason,
  ExtensionReasonResponse,
} from '@/types/complaint-management';
import type { PaginationState } from '@tanstack/react-table';
import type { AxiosError } from 'axios';
import { useState } from 'react';
import { CreateExtensionReasonDialog } from './CreateReason';
import { FilterReasonSetup } from './FilterReasonSetup';
import { HistoryErrorCauseDialog } from './HistoryReason';
import { ReasonSetupTable } from './ReasonSetupTable';

export const ExtensionReasonPage = () => {
  const { t } = useTranslation();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [dataFilter, setDataFilter] = useState<ErrorCauseSearch>({
    keyword: '',
  });

  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editData, setEditData] = useState<ExtensionReason | null>(null);
  const [openHistory, setOpenHistory] = useState<boolean>(false);

  const {
    data: errorCausesData,
    isLoading: isLoadingErrorCauses,
    error: errorMessage,
  } = useQuery<ExtensionReasonResponse, AxiosError<{ message: string }>>({
    queryKey: ['extension-reason-list', dataFilter, pagination],
    queryFn: () =>
      complaintService.getExtensionReasonData({
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
        {t('settingComplaint.extensionReason.extensionReasonSetup')}
      </CardTitle>
      <FilterReasonSetup
        onSubmit={handleFilterSubmit}
        onCreate={() => {
          setOpenCreate(true);
          setEditData(null);
        }}
      />

      <ReasonSetupTable
        data={errorCausesData?.data?.page_data || []}
        setPagination={setPagination}
        pagination={pagination}
        isLoading={isLoadingErrorCauses}
        pageCount={errorCausesData?.data?.pagination?.totalPages}
        onEdit={(data: ExtensionReason) => {
          setOpenCreate(true);
          setEditData(data);
        }}
        onHistory={(data: ExtensionReason) => {
          setOpenHistory(true);
          setEditData(data);
        }}
        errorMessage={errorMessage?.response?.data?.message}
      />
      <CreateExtensionReasonDialog
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
