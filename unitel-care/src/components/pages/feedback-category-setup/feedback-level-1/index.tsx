import { Card, CardTitle } from '@/components/ui/card';
import { complaintService } from '@/services/complaintService';
import type {
  FeedbackLevel,
  FeedbackLevel1Params,
  FeedbackLevelResponse,
} from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateFeedbackLevel1Dialog } from './CreateFeedbackLevel1';
import { FeedbackLevel1Table } from './FeedbackLevel1Table';
import { FilterFeedbackLevel1 } from './FilterFeedbackLevel1';
import { HistoryFeedbackLevel1Dialog } from './HistoryFeedbackLevel1';
import type { AxiosError } from 'axios';

export const FeedbackLevel1Page = () => {
  const { t } = useTranslation();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [dataFilter, setDataFilter] = useState<FeedbackLevel1Params>({
    keyword: '',
  });

  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editData, setEditData] = useState<FeedbackLevel | null>(null);
  const [openHistory, setOpenHistory] = useState<boolean>(false);

  const {
    data: errorCausesData,
    isLoading: isLoadingErrorCauses,
    error: errorListComplaint,
  } = useQuery<FeedbackLevelResponse, AxiosError<{ message: string }>>({
    queryKey: ['feedback-level-1-list', dataFilter, pagination],
    queryFn: () =>
      complaintService.getFeedbackLevel1Data({
        ...dataFilter,
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
      }),
  });

  const handleFilterSubmit = (data: FeedbackLevel1Params) => {
    setDataFilter({ ...data });
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page when filtering
  };

  return (
    <Card className='p-4'>
      <CardTitle className='text-primary text-xl'>
        {t('settingComplaint.feedbackCategorySetup.feedbackLevel1Title')}
      </CardTitle>
      <FilterFeedbackLevel1
        onSubmit={handleFilterSubmit}
        onCreate={() => {
          setOpenCreate(true);
          setEditData(null);
        }}
      />

      <FeedbackLevel1Table
        data={errorCausesData?.data?.page_data || []}
        setPagination={setPagination}
        pagination={pagination}
        isLoading={isLoadingErrorCauses}
        pageCount={errorCausesData?.data?.pagination?.totalPages}
        onEdit={(data: FeedbackLevel) => {
          setOpenCreate(true);
          setEditData(data);
        }}
        onHistory={(data: FeedbackLevel) => {
          setOpenHistory(true);
          setEditData(data);
        }}
        errorMessage={errorListComplaint?.response?.data?.message}
      />
      <CreateFeedbackLevel1Dialog
        open={openCreate}
        onclose={() => setOpenCreate(false)}
        dataEdit={editData}
      />
      <HistoryFeedbackLevel1Dialog
        open={openHistory}
        onclose={() => setOpenHistory(false)}
        id={editData?.id}
      />
    </Card>
  );
};
