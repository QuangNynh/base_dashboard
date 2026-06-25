import ButtonLoading from '@/components/common/ButtonLoading';
import { Combobox } from '@/components/common/ComboBoxCustom';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { STATUS_COMPLAINT } from '@/constants/status';
import { handleApiError } from '@/lib/utils';
import {
  buildSchema,
  getPostOfficeHandingAwaitValues,
  type PostOfficeHandingAwaitForm,
} from '@/schemas/complaint-management';
import { complaintService } from '@/services/complaintService';
import { postOfficeService } from '@/services/postOfficeService';
import type {
  ComplaintDetail,
  FeedbackLevel,
  FeedbackLevelResponse,
} from '@/types/complaint-management';
import type { PostMan, PostManResponse, PostOffice, PostOfficeResponse } from '@/types/post-office';
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

export const PostOfficeHandingAwait = ({ data, status }: Props) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [pendingFormData, setPendingFormData] = useState<PostOfficeHandingAwaitForm | null>(null);
  const [savedProcessingPost, setSavedProcessingPost] = useState({
    processingPostId: '',
  });

  const isAssigned = status === STATUS_COMPLAINT.ASSIGNED;
  const isWaiting = status === STATUS_COMPLAINT.WAITING;
  const schema = useMemo(() => buildSchema(t, isAssigned), [isAssigned, t]);

  const refreshDetail = () => {
    queryClient.invalidateQueries({ queryKey: ['detail-complaint', id] });
  };
  const refreshHistory = () => {
    queryClient.invalidateQueries({
      queryKey: ['post-office-history', id, pagination.pageIndex, pagination.pageSize],
    });
  };

  const form = useForm<PostOfficeHandingAwaitForm>({
    resolver: zodResolver(schema),
    defaultValues: getPostOfficeHandingAwaitValues(),
  });

  const watchedProcessingPostId = useWatch({ control: form.control, name: 'processingPostId' });

  const hasPostOfficeChanged = watchedProcessingPostId !== savedProcessingPost.processingPostId;

  useEffect(() => {
    if (data) {
      form.reset({
        internalNote: '',
        complaintCategoryId: data?.complaint_category_id?.toString(),
        processingPostId: data?.processing_post_id?.toString(),
        handlerId: data?.handler_id?.toString(),
      });
      setSavedProcessingPost({
        processingPostId: data?.processing_post_id?.toString() ?? '',
      });
    }
  }, [data, form]);

  const { data: feedbackLevel2Data } = useQuery<FeedbackLevelResponse, Error, FeedbackLevel[]>({
    queryKey: ['feedback-level-2-list'],
    queryFn: () =>
      complaintService.getFeedbackLevel2Data({
        page: 1,
        size: 100,
        is_deleted: false,
      }),
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

  const buildPayload = (formData: PostOfficeHandingAwaitForm): FormData => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        fd.append(key, String(value));
      }
    });
    return fd;
  };

  // WAITING: chỉ cập nhật PUT
  const { mutateAsync: mutateUpdate, isPending: isUpdating } = useMutation({
    mutationFn: (formData: PostOfficeHandingAwaitForm) =>
      complaintService.updateComplaintHandling(id!, buildPayload(formData)),
    onSuccess: () => {
      toast.success(t('common.updateSuccess'));
      refreshDetail();
      refreshHistory();
    },
    onError: (error) => {
      handleApiError(error || t('common.updateError'));
    },
  });

  // ASSIGNED: PUT + POST /receive
  const { mutateAsync: mutateReceive, isPending: isReceiving } = useMutation({
    mutationFn: async () => {
      return complaintService.receiveComplaint(id!);
    },
    onSuccess: () => {
      toast.success(t('common.updateSuccess'));
      refreshDetail();
      refreshHistory();
    },
    onError: () => {
      toast.error(t('common.updateError'));
    },
  });

  const handleUpdateClick = (formData: PostOfficeHandingAwaitForm) => {
    if (!hasPostOfficeChanged && !formData.handlerId) {
      form.setError('handlerId', { message: t('validation.required') });
      return;
    }
    setPendingFormData(formData);
    setShowConfirmDialog(true);
  };

  const handleConfirmUpdate = async () => {
    if (pendingFormData) {
      await mutateUpdate(pendingFormData);
      setShowConfirmDialog(false);
      setPendingFormData(null);
    }
  };

  const handleCancelUpdate = () => {
    setShowConfirmDialog(false);
    setPendingFormData(null);
  };

  const isAnyPending = isUpdating || isReceiving;
  const watchedHandlerId = useWatch({ control: form.control, name: 'handlerId' });

  const isChangedHandler = data?.handler_id?.toString() !== watchedHandlerId;
  const isUpdateDisabled =
    isAnyPending || (isAssigned && !hasPostOfficeChanged && !isChangedHandler);
  const isReceiveDisabled = isAnyPending || hasPostOfficeChanged || isChangedHandler;

  return (
    <div>
      <div className='font-semibold text-primary mb-2'>{t('postOfficeHanding.title')}</div>
      <Card className='p-4'>
        <Form {...form}>
          <div className='flex flex-col gap-x-4 gap-y-1'>
            <FormField
              control={form.control}
              name='internalNote'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('postOfficeHanding.internalContent')}{' '}
                    {isWaiting && <span className='text-destructive'>*</span>}
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

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='complaintCategoryId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('postOfficeHanding.feedbackCategory')}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        disable={!isWaiting}
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
                    <FormLabel>
                      {t('postOfficeHanding.processingUnit')}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        placeholder={t('postOfficeHanding.processingUnitPlaceholder')}
                        options={postOfficeOptions}
                        value={field.value ?? null}
                        onChange={(val) => {
                          field.onChange(val);
                          form.setValue('handlerId', '');
                          form.clearErrors('handlerId');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-4'>
              <FormField
                control={form.control}
                name='handlerId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('createComplaint.personalProcess')}</FormLabel>
                    <FormControl>
                      <Combobox
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

            <div className='flex justify-end gap-2'>
              {/* ASSIGNED: chỉ có nút Tiếp nhận */}
              {isAssigned && (
                <ButtonLoading
                  type='button'
                  variant='receive'
                  loading={isReceiving}
                  disabled={isReceiveDisabled}
                  onClick={form.handleSubmit(() => mutateReceive())}
                >
                  {t('postOfficeHanding.btnReceive')}
                </ButtonLoading>
              )}

              {/* WAITING: chỉ có nút Cập nhật */}
              <ButtonLoading
                type='button'
                variant='create'
                loading={isUpdating}
                disabled={isUpdateDisabled}
                onClick={form.handleSubmit(handleUpdateClick)}
              >
                {t('common.update')}
              </ButtonLoading>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
              open={showConfirmDialog}
              onClose={handleCancelUpdate}
              onConfirm={handleConfirmUpdate}
              title={t('postOfficeHanding.confirmUpdateTitle')}
              description={t('postOfficeHanding.confirmUpdate')}
            />
          </div>
        </Form>
      </Card>
    </div>
  );
};
