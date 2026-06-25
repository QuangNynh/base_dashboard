import { Card, CardTitle } from '@/components/ui/card';
import { complaintService } from '@/services/complaintService';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import type {
  ErrorCauseSearch,
  FeedbackLevel,
  FeedbackLevel2Params,
  FeedbackLevelResponse,
} from '@/types/complaint-management';
import type { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { CreateFeedbackLevel2Dialog } from './CreateFeedbackLevel2';
import { FeedbackLevel2Table } from './FeedbackLevel2Table';
import { FilterFeedbackLevel2 } from './FilterFeedbackLevel2';
import { HistoryFeedbackLevel2Dialog } from './HistoryFeedbackLevel2';
import type { AxiosError } from 'axios';

export const FeedbackLevel2Page = () => {
  const { t } = useTranslation();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [dataFilter, setDataFilter] = useState<ErrorCauseSearch>({
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
    queryKey: ['feedback-level-2-list', dataFilter, pagination],
    queryFn: () =>
      complaintService.getFeedbackLevel2Data({
        ...dataFilter,
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
      }),
  });

  const handleFilterSubmit = (data: FeedbackLevel2Params) => {
    setDataFilter({ ...data });
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page when filtering
  };

  return (
    <Card className='p-4'>
      <CardTitle className='text-primary text-xl'>
        {t('settingComplaint.feedbackCategorySetup.feedbackLevel2Title')}
      </CardTitle>
      <FilterFeedbackLevel2
        onSubmit={handleFilterSubmit}
        onCreate={() => {
          setOpenCreate(true);
          setEditData(null);
        }}
      />

      <FeedbackLevel2Table
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
      <CreateFeedbackLevel2Dialog
        open={openCreate}
        onclose={() => setOpenCreate(false)}
        dataEdit={editData}
      />
      <HistoryFeedbackLevel2Dialog
        open={openHistory}
        onclose={() => setOpenHistory(false)}
        id={editData?.id}
      />
    </Card>
  );
};
