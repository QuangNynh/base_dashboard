import { Fragment } from 'react/jsx-runtime';
import ErrorGroupForm from './ErrorGroupForm';
import ErrorDetailForm from './ErrorDetailForm';
import ErrorList from './ErrorList';
import { useMutation, useQuery } from '@tanstack/react-query';
import { violationReportService } from '@/services/violationReport';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type { ViolationErrorDetailData, ViolationErrorDetailRow } from '@/types/violation-report';
import { useEffect, useRef, useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import ModalDeleteDetailError from './ModalDeleteDetailError';
import compact from 'lodash/compact';

const ErrorConfigSetupComponent = () => {
  const { t } = useTranslation();
  const detailRef = useRef<HTMLDivElement | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  // const [keyword, setKeyword] = useState('');
  const [idEdit, setIdEdit] = useState<number>();
  const [deleteItem, setDeleteItem] = useState<ViolationErrorDetailRow | null>(null);

  const { data, refetch } = useQuery({
    queryFn: () => violationReportService.getAllErrorGroup(),
    queryKey: ['get all error group'],
  });

  const { data: dataEdit } = useQuery({
    queryFn: () => violationReportService.getDetailErrorDetail(idEdit || 0),
    queryKey: ['get detail of error detail', idEdit],
    enabled: idEdit != undefined,
  });

  const {
    data: listErrorDetails,
    isLoading: isLoadingErrorDetails,
    refetch: refetchListErrorDetails,
  } = useQuery({
    queryKey: ['get list error detail', pagination.pageIndex, pagination.pageSize],
    queryFn: () =>
      violationReportService.getListErrorDetail({
        // keyword: keyword || undefined,
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize,
      }),
  });
  const pageCount = listErrorDetails?.data?.pagination?.totalPages ?? 0;

  const { mutateAsync: createErrorGroup, isPending: isCreateGroupLoading } = useMutation({
    mutationFn: (data: { code: string; name: string }) =>
      violationReportService.createErrorGroup(data),
    onSuccess: () => {
      toast.success(t('violationReport.errorGroup.success'));
      refetch();
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: string } }; detail?: string };
      toast.error(e?.response?.data?.detail || e?.detail || t('common.errorDefault'));
    },
  });

  const { mutateAsync: createErrorDetail, isPending: isCreateDetailLoading } = useMutation({
    mutationFn: (data: ViolationErrorDetailData) => violationReportService.createDetailError(data),
    onSuccess: () => {
      toast.success(t('violationReport.errorDetail.createSuccess'));
      refetchListErrorDetails();
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: string } }; detail?: string };
      toast.error(e?.response?.data?.detail || e?.detail || t('common.errorDefault'));
    },
  });

  const { mutateAsync: editErrorDetail, isPending: isEditDetailLoading } = useMutation({
    mutationFn: (payload: { id: number; data: ViolationErrorDetailData }) =>
      violationReportService.editDetailError(payload.id, payload.data),
    onSuccess: () => {
      toast.success(t('violationReport.errorDetail.editSuccess'));
      refetchListErrorDetails();
      setIdEdit(undefined);
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: string } }; detail?: string };
      toast.error(e?.response?.data?.detail || e?.detail || t('common.errorDefault'));
    },
  });

  const { mutateAsync: deleteErrorCode, isPending: isDeleting } = useMutation({
    mutationFn: (payload: {
      id: number;
      isDeleteMistakeGrp: boolean;
      isDeleteMistakeOnly: boolean;
    }) => violationReportService.deleteErrorCode(payload),
    onSuccess: (_, vars) => {
      setDeleteItem(null);
      refetchListErrorDetails();
      if (vars?.isDeleteMistakeGrp) {
        refetch();
      }
      toast.success(t('common.deleteSuccess'));
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: string } }; detail?: string };
      toast.error(e?.response?.data?.detail || e?.detail || t('common.errorDefault'));
    },
  });

  const isEdit = idEdit !== undefined;
  const detail = dataEdit?.data;

  // const errorGroupDefaultValues = detail
  //   ? {
  //       errorGroupCode: detail?.mistakeGroup?.code ?? '',
  //       errorGroupName: detail?.mistakeGroup?.name ?? '',
  //     }
  //   : undefined;

  const errorDetailDefaultValues = detail
    ? {
        errorGroup: String(detail?.mistakeInfo?.mistakeGroupId ?? ''),
        errorTypeName: detail?.mistakeInfo?.mistakeDescription ?? '',
        errorTypeCode: detail?.mistakeInfo?.mistakeCode ?? '',
        wrongMinuteConfirmHour: String(detail?.mistakeInfo?.processExpiredTime ?? ''),
        conclusionHour: String(detail?.mistakeInfo?.concludeExpiredTime ?? ''),
        personalPenaltyPoint: String(detail?.mistakeInfo?.individualPenaltyScore ?? ''),
        personalRewardPoint: String(detail?.mistakeInfo?.individualBonusScore ?? ''),
        compensationUnitUsd: String(detail?.mistakeInfo?.moneyPenalty ?? ''),
        unitPenaltyPoint: String(detail?.mistakeInfo?.managerPenaltyScore ?? ''),
        postOfficeCompensationPoint: String(detail?.mistakeInfo?.agencyPenaltyScore ?? ''),
        autoCompleteWhenImport: Boolean(detail?.mistakeInfo?.isAutoClose),
        createOnlyOneRecord: Boolean(detail?.mistakeInfo?.isUnique),
        compensation: Boolean(detail?.mistakeInfo?.isCompensatory),
      }
    : undefined;

  const handleSubmitErrorDetail = async (formData: ViolationErrorDetailData) => {
    if (isEdit && idEdit) {
      await editErrorDetail({ id: idEdit, data: formData });
      return;
    }

    await createErrorDetail(formData);
  };

  useEffect(() => {
    if (!idEdit) return;
    detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [idEdit]);

  useEffect(() => {
    if (
      !!listErrorDetails?.data?.page_data &&
      !listErrorDetails?.data?.page_data?.length &&
      pagination.pageIndex > 0
    ) {
      setPagination({
        ...pagination,
        pageIndex: pagination.pageIndex - 1,
      });
    }
  }, [listErrorDetails, pagination]);

  return (
    <Fragment>
      <ErrorGroupForm
        onSubmit={createErrorGroup}
        loading={isCreateGroupLoading}
        // isEdit={isEdit}
        // defaultValues={errorGroupDefaultValues}
      />

      <ErrorList
        data={listErrorDetails?.data?.page_data || []}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoadingErrorDetails}
        onEdit={setIdEdit}
        onDelete={setDeleteItem}
        pageCount={pageCount}
      />

      <div ref={detailRef}>
        <ErrorDetailForm
          onSubmit={handleSubmitErrorDetail}
          loading={isCreateDetailLoading || isEditDetailLoading}
          errorGroupOptions={
            data?.data?.map((i) => ({
              value: i?.id + '',
              label: compact([i?.code, i?.name]).join(' - '),
            })) || []
          }
          isEdit={isEdit}
          defaultValues={errorDetailDefaultValues}
          onClear={() => setIdEdit(undefined)}
        />
      </div>

      <ModalDeleteDetailError
        open={!!deleteItem}
        onOpenChange={(open) => {
          if (!open) setDeleteItem(null);
        }}
        onConfirm={async (type) => {
          if (!deleteItem) return;

          await deleteErrorCode({
            id: deleteItem.id,
            isDeleteMistakeGrp: type === 'group',
            isDeleteMistakeOnly: type === 'detail',
          });
        }}
        isLoading={isDeleting}
      />
    </Fragment>
  );
};

export default ErrorConfigSetupComponent;
