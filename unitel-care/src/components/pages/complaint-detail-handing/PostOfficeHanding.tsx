import AppButton from '@/components/common/AppButton';
import { Combobox } from '@/components/common/ComboBoxCustom';
import { Show } from '@/components/common/Show';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import Upload from '@/components/common/Upload';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { STATUS_COMPLAINT } from '@/constants/status';
import { handleApiError } from '@/lib/utils';
import {
  buildProcessSchema,
  buildUpdateSchema,
  type PostOfficeHandingForm,
} from '@/schemas/complaint-management';
import { complaintService } from '@/services/complaintService';
import { postOfficeService } from '@/services/postOfficeService';
import type {
  ComplaintDetail,
  FeedbackLevel,
  FeedbackLevelResponse,
} from '@/types/complaint-management';
import type {
  // ErrorCause,
  // ErrorCauseResponse,
  PostMan,
  PostManResponse,
  PostOffice,
  PostOfficeResponse,
} from '@/types/post-office';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ConfirmDialog } from './ConfirmDialog';

const pagination = { pageIndex: 0, pageSize: 5 };

interface Props {
  data?: ComplaintDetail;
  status?: string;
}

type ConfirmType = 'update' | 'process' | 'complete';

export const PostOfficeHanding = ({ data, status }: Props) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [confirmType, setConfirmType] = useState<ConfirmType | null>(null);
  const [pendingFormData, setPendingFormData] = useState<PostOfficeHandingForm | null>(null);

  const isInProgress = status === STATUS_COMPLAINT.IN_PROGRESS;
  const isProcessed = status === STATUS_COMPLAINT.PROCESSED;
  const isDisabled = status !== STATUS_COMPLAINT.WAITING;
  const isDisabledToUpdate =
    status !== STATUS_COMPLAINT.WAITING && status !== STATUS_COMPLAINT.IN_PROGRESS;

  const [maxHoursMap, setMaxHoursMap] = useState<Record<string, number>>({});

  const form = useForm<PostOfficeHandingForm>({
    resolver: zodResolver(buildUpdateSchema(t, maxHoursMap)),
    defaultValues: {
      internalNote: '',
      complaintCategoryId: '',
      processingPostId: '',
      handlerId: '',
      responseToCustomer: '',
      faultUnitId: '',
      faultIndividualId: '',
      extensionReasonId: '',
      errorCauseId: '',
      files: [],
    },
  });

  const [savedFault, setSavedFault] = useState({
    faultUnitId: '',
    faultIndividualId: '',
    errorCauseContent: '',
    processingPostId: '',
    handlerId: '',
  });

  useEffect(() => {
    if (data) {
      form.reset({
        internalNote: '',
        complaintCategoryId: data?.complaint_category_id?.toString(),
        processingPostId: data?.processing_post_id?.toString(),
        handlerId: data?.handler_id?.toString(),
        responseToCustomer: data?.response_to_customer ?? '',
        extensionReasonId: '',
        faultUnitId: data?.fault_unit_id ?? 'none',
        faultIndividualId: data?.fault_individual_id?.toString() ?? 'none',
        errorCauseId: data?.error_cause_id?.toString() ?? 'none',
        extensionHours: '',
        files: data?.internal_attached_files ? JSON.parse(data?.internal_attached_files) : [],
      });
      setSavedFault({
        faultUnitId: data?.fault_unit_id ?? 'none',
        faultIndividualId: data?.fault_individual_id?.toString() ?? 'none',
        errorCauseContent: data?.error_cause_id?.toString() ?? 'none',
        processingPostId: data?.processing_post_id?.toString() ?? 'none',
        handlerId: data?.handler_id?.toString() ?? 'none',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const { data: feedbackLevel2Data } = useQuery<FeedbackLevelResponse, Error, FeedbackLevel[]>({
    queryKey: ['feedback-level-2-list'],
    queryFn: () =>
      complaintService.getFeedbackLevel2Data({ page: 1, size: 100, is_deleted: false }),
    select: (res) => res.data.page_data,
  });

  const { data: postOfficeAllData } = useQuery<PostOfficeResponse, Error, PostOffice[]>({
    queryKey: ['post-office-all-list'],
    queryFn: () => postOfficeService.getAllListPostOffice(),
    select: (res) => res.data,
  });
  const postOfficeOptions = useMemo(
    () =>
      postOfficeAllData?.map((item) => ({
        value: item.departmentId.toString(),
        label:
          item?.code && item?.name ? `${item?.code} - ${item?.name}` : item?.code || item?.name,
      })) ?? [],
    [postOfficeAllData]
  );

  const feedbackLevel2Options = useMemo(
    () =>
      feedbackLevel2Data?.map((item) => ({
        value: item.id.toString(),
        label: item.name,
      })) ?? [],
    [feedbackLevel2Data]
  );

  const selectedProcessingPostId = useWatch({ control: form.control, name: 'processingPostId' });
  const { data: postManData } = useQuery<PostManResponse, Error, PostMan[]>({
    queryKey: ['post-man-list', selectedProcessingPostId],
    queryFn: () => postOfficeService.getUsersByDepartment(selectedProcessingPostId!),
    select: (res) => res.data,
    enabled: !!selectedProcessingPostId,
  });
  const postManOptions = useMemo(
    () =>
      postManData?.map((item) => ({
        value: item.userId.toString(),
        label: item?.fullName ?? item.account,
      })) ?? [],
    [postManData]
  );

  // const noneOption = useMemo(() => ({ value: 'none', label: t('common.none') }), [t]);

  // const faultUnitOptions = useMemo(
  //   () => [noneOption, ...postOfficeOptions],
  //   [noneOption, postOfficeOptions]
  // );

  // const selectedFaultUnitId = useWatch({ control: form.control, name: 'faultUnitId' });
  // const { data: faultPersonData } = useQuery<PostManResponse, Error, PostMan[]>({
  //   queryKey: ['fault-person-list', selectedFaultUnitId],
  //   queryFn: () => postOfficeService.getUsersByDepartment(selectedFaultUnitId!),
  //   select: (res) => res.data,
  //   enabled: !!selectedFaultUnitId && selectedFaultUnitId !== 'none',
  // });
  // const faultPersonOptions = useMemo(
  //   () => [
  //     noneOption,
  //     ...(faultPersonData?.map((item) => ({
  //       value: item.userId.toString(),
  //       label: item.account,
  //     })) ?? []),
  //   ],
  //   [noneOption, faultPersonData]
  // );

  // const { data: errorCauseData } = useQuery<ErrorCauseResponse, Error, ErrorCause[]>({
  //   queryKey: ['error-cause-list'],
  //   queryFn: () => postOfficeService.getErrorCauses({ page: 1, size: 100, is_deleted: false }),
  //   select: (res) => res.data.page_data,
  // });
  // const errorCauseOptions = useMemo(
  //   () => [
  //     noneOption,
  //     ...(errorCauseData?.map((item) => ({
  //       value: String(item?.id),
  //       label: item?.description,
  //     })) ?? []),
  //   ],
  //   [noneOption, errorCauseData]
  // );

  const { data: extensionReasonData, isLoading: isLoadingExtensionReasonData } = useQuery({
    queryKey: ['extension-reason-list'],
    queryFn: () =>
      complaintService.getExtensionReasonData({ page: 1, size: 100, is_deleted: false }),
  });
  const extensionReasonOptions = useMemo(
    () =>
      extensionReasonData?.data?.page_data?.map((item) => ({
        value: String(item?.id),
        label: item?.reason,
        maxHours: item?.maxHours,
      })) ?? [],
    [extensionReasonData]
  );

  useEffect(() => {
    const map = extensionReasonOptions.reduce<Record<string, number>>((acc, item) => {
      if (item.maxHours !== undefined) acc[item.value] = item.maxHours;
      return acc;
    }, {});
    setMaxHoursMap(map);
  }, [extensionReasonOptions]);

  const validateExtensionHours = (values: PostOfficeHandingForm): boolean => {
    const hours = Number(values.extensionHours);
    if (values.extensionHours) {
      if (hours <= 0 || values.extensionHours.length > 4) {
        form.setError('extensionHours', { message: t('validation.extensionHoursInvalid') });
        return false;
      }
      if (values.extensionReasonId) {
        const maxHours = maxHoursMap[values.extensionReasonId];
        if (maxHours !== undefined && hours > maxHours) {
          form.setError('extensionHours', {
            message: t('validation.extensionHoursExceedMax', { max: maxHours }),
          });
          return false;
        }
      }
    }
    return true;
  };

  const watchedFaultUnitId = useWatch({ control: form.control, name: 'faultUnitId' });
  const watchedFaultPersonId = useWatch({ control: form.control, name: 'faultIndividualId' });
  const watchedErrorCauseId = useWatch({ control: form.control, name: 'errorCauseId' });
  const watchedProcessingPostId = useWatch({ control: form.control, name: 'processingPostId' });
  const watchedHandlerId = useWatch({ control: form.control, name: 'handlerId' });

  const hasFaultChanged =
    isProcessed &&
    (watchedFaultUnitId !== savedFault.faultUnitId ||
      watchedFaultPersonId !== savedFault.faultIndividualId ||
      watchedErrorCauseId !== savedFault.errorCauseContent);
  const hasProcessingChanged =
    isInProgress &&
    (watchedProcessingPostId !== savedFault.processingPostId ||
      watchedHandlerId !== savedFault.handlerId);

  const buildPayload = (formData: PostOfficeHandingForm): FormData => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'files') {
        (value as PostOfficeHandingForm['files'])?.forEach((file) => {
          if (file instanceof File) fd.append('files', file);
        });
      } else if (value !== undefined && value !== null && value !== '' && value !== 'none') {
        fd.append(key, String(value));
      }
    });
    return fd;
  };

  const refreshDetail = () => {
    queryClient.invalidateQueries({ queryKey: ['detail-complaint', id] });
  };
  const refreshHistory = () => {
    queryClient.invalidateQueries({
      queryKey: ['post-office-history', id, pagination.pageIndex, pagination.pageSize],
    });
  };

  const { mutateAsync: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (formData: PostOfficeHandingForm) =>
      complaintService.updateComplaintHandling(id!, buildPayload(formData)),
    onSuccess: () => {
      toast.success(t('common.updateSuccess'));
      const current = form.getValues();
      setSavedFault({
        faultUnitId: current.faultUnitId ?? '',
        faultIndividualId: current.faultIndividualId ?? '',
        errorCauseContent: current.errorCauseId ?? '',
        processingPostId: current.processingPostId ?? '',
        handlerId: current.handlerId ?? '',
      });
      if (!isProcessed) {
        refreshDetail();
        refreshHistory();
      }
    },
    onError: (error) => {
      handleApiError(error || t('common.updateError'));
    },
  });

  const { mutateAsync: mutateProcess, isPending: isProcessing } = useMutation({
    mutationFn: async (formData: PostOfficeHandingForm) => {
      await complaintService.processComplaint(id!, buildPayload(formData));
    },
    onSuccess: () => {
      toast.success(t('common.updateSuccess'));
      refreshDetail();
      refreshHistory();
    },
    onError: (error) => {
      handleApiError(error || t('common.updateError'));
    },
  });

  const { mutateAsync: mutateComplete, isPending: isCompleting } = useMutation({
    mutationFn: (formData: PostOfficeHandingForm) =>
      complaintService.completeComplaint(id!, {
        internalNote: formData.internalNote,
      }),
    onSuccess: () => {
      toast.success(t('common.updateSuccess'));
      refreshDetail();
      refreshHistory();
    },
    onError: (error) => {
      handleApiError(error || t('common.updateError'));
    },
  });

  const isAnyPending = isUpdating || isProcessing || isCompleting;

  const handleUpdateClick = form.handleSubmit((formData) => {
    if (!validateExtensionHours(formData)) return;
    setPendingFormData(formData);
    setConfirmType('update');
  });

  const handleProcessClick = async () => {
    const values = form.getValues();
    if (!validateExtensionHours(values)) return;
    const parsed = buildProcessSchema(t).safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = String(issue.path[0]) as keyof PostOfficeHandingForm;
        form.setError(field, { message: issue.message });
      });
      return;
    }
    setPendingFormData(values);
    setConfirmType('process');
  };

  const handleCompleteClick = form.handleSubmit((formData) => {
    if (!validateExtensionHours(formData)) return;
    setPendingFormData(formData);
    setConfirmType('complete');
  });

  const handleConfirm = async () => {
    if (confirmType === 'update' && pendingFormData) {
      await mutateUpdate(pendingFormData);
    } else if (confirmType === 'process' && pendingFormData) {
      await mutateProcess(pendingFormData);
    } else if (confirmType === 'complete' && pendingFormData) {
      await mutateComplete(pendingFormData);
    }
    setConfirmType(null);
    setPendingFormData(null);
  };

  const handleCancelConfirm = () => {
    setConfirmType(null);
    setPendingFormData(null);
  };

  const confirmConfig = {
    update: {
      title: t('postOfficeHanding.confirmUpdateTitle'),
      description: t('postOfficeHanding.confirmUpdate'),
    },
    process: {
      title: t('postOfficeHanding.confirmProcessTitle'),
      description: t('postOfficeHanding.confirmProcess'),
    },
    complete: {
      title: t('postOfficeHanding.confirmCompleteTitle'),
      description: t('postOfficeHanding.confirmComplete'),
    },
  };

  return (
    <div>
      <div className='font-semibold text-primary mb-2'>{t('postOfficeHanding.title')}</div>
      <Card className='p-4'>
        <Form {...form}>
          <div className='flex flex-col gap-x-4 gap-y-1'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='responseToCustomer'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('postOfficeHanding.customerReply')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('postOfficeHanding.customerReplyPlaceholder')}
                        rows={3}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.clearErrors('responseToCustomer');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Nội dung xử lý nội bộ — luôn editable, luôn bắt buộc */}
              <FormField
                control={form.control}
                name='internalNote'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('postOfficeHanding.internalContent')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('postOfficeHanding.internalContentPlaceholder')}
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Đơn vị xử lý + Cá nhân xử lý — readonly ở PROCESSED */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Phân loại phản ánh */}
              <FormField
                control={form.control}
                name='complaintCategoryId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('postOfficeHanding.feedbackCategory')}</FormLabel>
                    <FormControl>
                      <Combobox
                        disable={isDisabled}
                        placeholder={t('postOfficeHanding.feedbackCategoryPlaceholder')}
                        options={feedbackLevel2Options}
                        value={field.value ?? null}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='processingPostId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('postOfficeHanding.processingUnit')}</FormLabel>
                    <FormControl>
                      <Combobox
                        disable={isDisabledToUpdate}
                        placeholder={t('postOfficeHanding.processingUnitPlaceholder')}
                        options={postOfficeOptions}
                        value={field.value ?? null}
                        onChange={(val) => {
                          field.onChange(val);
                          form.setValue('handlerId', '');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cá nhân xử lý */}
              <FormField
                control={form.control}
                name='handlerId'
                render={({ field }) => (
                  <FormItem className='sm:col-span-2'>
                    <FormLabel>{t('createComplaint.personalProcess')}</FormLabel>
                    <FormControl>
                      <Combobox
                        disable={isDisabledToUpdate || !selectedProcessingPostId}
                        placeholder={t('createComplaint.placeholderPersonalProcess')}
                        options={postManOptions}
                        value={field.value ?? ''}
                        onChange={(val) => field.onChange(val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Nội dung trả lời khách hàng — readonly ở PROCESSED */}

            {/* Upload */}
            <FormField
              control={form.control}
              name='files'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Upload
                      value={field.value ?? []}
                      onChange={field.onChange}
                      multiple
                      maxFiles={3}
                      maxSize={2 * 1024 * 1024}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Đơn vị mắc lỗi + Cá nhân mắc lỗi + Nguyên nhân gây lỗi — editable cả 2 trạng thái */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* <FormField
                control={form.control}
                name='faultUnitId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('postOfficeHanding.faultUnit')}
                      <span className='text-destructive ml-1'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        placeholder={t('postOfficeHanding.faultUnitPlaceholder')}
                        options={faultUnitOptions}
                        value={field.value ?? null}
                        onChange={(val) => {
                          field.onChange(val);
                          form.setValue('faultIndividualId', 'none');
                          form.clearErrors('faultUnitId');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name='faultIndividualId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('postOfficeHanding.faultPerson')}
                      <span className='text-destructive ml-1'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        disable={!watchedFaultUnitId || watchedFaultUnitId === 'none'}
                        placeholder={t('postOfficeHanding.faultPersonPlaceholder')}
                        options={faultPersonOptions}
                        value={field.value ?? null}
                        onChange={(val) => {
                          field.onChange(val);
                          form.clearErrors('faultIndividualId');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            {/* <FormField
              control={form.control}
              name='errorCauseId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('postOfficeHanding.errorCause')}
                    <span className='text-destructive ml-1'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      placeholder={t('postOfficeHanding.errorCausePlaceholder')}
                      options={errorCauseOptions}
                      value={field.value ?? null}
                      onChange={(val) => {
                        field.onChange(val);
                        form.clearErrors('errorCauseId');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Lý do gia hạn — chỉ hiển thị khi IN_PROGRESS */}
              <Show when={isInProgress}>
                <FormField
                  control={form.control}
                  name='extensionReasonId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('postOfficeHanding.extensionReason')}</FormLabel>
                      <FormControl>
                        <Combobox
                          isLoading={isLoadingExtensionReasonData}
                          placeholder={t('postOfficeHanding.extensionReasonPlaceholder')}
                          options={extensionReasonOptions}
                          value={field.value ?? ''}
                          onChange={(val) => field.onChange(val)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Show>
              {/* Số giờ gia hạn — chỉ hiển thị khi IN_PROGRESS */}
              <Show when={isInProgress}>
                <FormField
                  control={form.control}
                  name='extensionHours'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('createComplaint.extensionHours')}</FormLabel>
                      <FormControl>
                        <Input
                          onlyNumber
                          placeholder={t('createComplaint.extensionHoursPlaceholder')}
                          value={field.value ?? ''}
                          onChange={(val) => field.onChange(val)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Show>
            </div>

            {/* Action buttons */}
            <div className='flex justify-end gap-2'>
              <AppButton outline disabled={isAnyPending} onClick={handleUpdateClick}>
                {t('common.update')}
              </AppButton>
              {isInProgress && (
                <AppButton
                  isWarning
                  disabled={isAnyPending || hasProcessingChanged}
                  onClick={handleProcessClick}
                >
                  {t('postOfficeHanding.btnProcessed')}
                </AppButton>
              )}
              <>
                {/* Hoàn thành: enable mặc định, disable khi có thay đổi chưa lưu */}
                <TooltipCustom
                  content={
                    hasFaultChanged ? t('postOfficeHanding.tooltipCompleteFaultChanged') : ''
                  }
                >
                  <span>
                    <AppButton
                      disabled={isAnyPending || hasFaultChanged || hasProcessingChanged}
                      onClick={handleCompleteClick}
                    >
                      {t('postOfficeHanding.btnComplete')}
                    </AppButton>
                  </span>
                </TooltipCustom>
              </>
            </div>
          </div>
        </Form>

        <Show when={confirmType}>
          <ConfirmDialog
            open={!!confirmType}
            onClose={handleCancelConfirm}
            onConfirm={handleConfirm}
            title={confirmConfig[confirmType as ConfirmType]?.title}
            description={confirmConfig[confirmType as ConfirmType]?.description}
          />
        </Show>
      </Card>
    </div>
  );
};
