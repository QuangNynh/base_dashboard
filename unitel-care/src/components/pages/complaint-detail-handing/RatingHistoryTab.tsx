import { DataTable } from '@/components/common/data-table';
import { STATUS_TRANSLATION_KEY } from '@/constants/status';
import {
  CATEGORY_EVALUATION_LABEL_KEY,
  EXTENSION_EVALUATION_LABEL_KEY,
  PROCESSING_QUALITY_LABEL_KEY,
  RECEPTION_QUALITY_LABEL_KEY,
  type CategoryEvaluationType,
  type ExtensionEvaluationType,
  type ProcessingQualityType,
  type ReceptionQualityType,
} from '@/constants/ttvh-evaluation';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime } from '@/lib/utils';
import { complaintService } from '@/services/complaintService';
import type { HistoryRatingItem } from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  id?: string;
}

const RatingHistoryTab = ({ id }: Props) => {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 100 });

  const { data: dataListRatingHistory, isLoading: isLoadingListRatingHistory } = useQuery({
    queryKey: ['rating-history', id, pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      complaintService.getHistoryRatingComplaint(
        {
          page: pagination.pageIndex + 1,
          size: pagination.pageSize,
        },
        id!
      ),
    refetchOnWindowFocus: false,
    enabled: !!id,
    staleTime: 0,
  });

  const handlePaginationChange = (
    updater: PaginationState | ((prev: PaginationState) => PaginationState)
  ) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater;
    setPagination(next);
  };

  const columns: ColumnDef<HistoryRatingItem>[] = [
    {
      accessorKey: 'createdAt',
      header: t('detailComplaint.ratingDate'),
      size: 150,
      meta: { align: 'center' },
      cell: ({ getValue }) => {
        const actionDate = getValue<string>();
        return actionDate ? formatDateTime(actionDate, FORMAT_DATE.FULL_DATE_TIME) : '';
      },
    },
    {
      accessorKey: 'updatedByUsername',
      header: t('detailComplaint.ratingPerson'),
      cell: ({ getValue }) => {
        const updatedByUsername = getValue<string>();
        return updatedByUsername || 'hoitd';
      },
    },
    {
      accessorKey: 'processingQuality',
      header: t('detailComplaint.ratingProcessingQuality'),
      cell: ({ getValue }) => {
        const processingQuality = getValue<ProcessingQualityType>();
        return t(PROCESSING_QUALITY_LABEL_KEY[processingQuality]);
      },
    },
    {
      accessorKey: 'categoryEvaluation',
      header: t('detailComplaint.ratingComplaintCategory'),
      cell: ({ getValue }) => {
        const extensionEvaluation = getValue<CategoryEvaluationType>();
        return t(CATEGORY_EVALUATION_LABEL_KEY[extensionEvaluation]);
      },
    },
    {
      accessorKey: 'extensionEvaluation',
      header: t('detailComplaint.ratingExtension'),
      cell: ({ getValue }) => {
        const extensionEvaluation = getValue<ExtensionEvaluationType>();
        return t(EXTENSION_EVALUATION_LABEL_KEY[extensionEvaluation]);
      },
    },
    {
      accessorKey: 'receptionQuality',
      header: t('detailComplaint.ratingReceptionQuality'),
      cell: ({ getValue }) => {
        const receptionQuality = getValue<ReceptionQualityType>();
        return t(RECEPTION_QUALITY_LABEL_KEY[receptionQuality]);
      },
    },
    {
      accessorKey: 'slowUnitName',
      header: t('detailComplaint.ratingLateUnit'),
    },
    {
      accessorKey: 'is_deleted',
      header: t('detailComplaint.ratingStatus'),
      cell: ({ getValue }) => {
        const status = getValue<boolean>();
        return t(STATUS_TRANSLATION_KEY[status ? 'INACTIVE' : 'ACTIVE']);
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={dataListRatingHistory?.data?.page_data || []}
      pageSizeOptions={[100, 50, 20]}
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
      pageCount={dataListRatingHistory?.data?.pagination?.totalPages || 0}
      manualPagination={false}
      isLoading={isLoadingListRatingHistory}
    />
  );
};

export default RatingHistoryTab;
