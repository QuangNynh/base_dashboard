import ButtonLoading from '@/components/common/ButtonLoading';
import { Combobox } from '@/components/common/ComboBoxCustom';
import { ComboBoxMulti } from '@/components/common/ComboBoxMuilti';
import { DialogCustom } from '@/components/common/DialogCustom';
import Loading from '@/components/common/Loading';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { postOfficeOptions } from '@/constants/post-office';
import { STATUS_DELETED_OPTIONS } from '@/constants/status';
import { handleApiError } from '@/lib/utils';
import { createFeedbackLevel2Schema } from '@/schemas/settingComplaintSchema';
import { complaintService } from '@/services/complaintService';
import type {
  ErrorCauseResponse,
  FeedbackLevel,
  FeedbackLevelDetailResponse,
  FeedbackLevelResponse,
} from '@/types/complaint-management';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
interface props {
  open: boolean;
  onclose: () => void;
  dataEdit?: FeedbackLevel | null;
}
type Option = {
  value: string;
  label: string;
};

const defaultForm = {
  code: '',
  name: '',
  is_deleted: false,
  level: 2,
  error_cause_ids: [],
  processing_office: '',
  parent_id: '',
  resolution_time_hours: '',
};

export const CreateFeedbackLevel2Dialog = ({ open, onclose, dataEdit }: props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(createFeedbackLevel2Schema(t)),
    defaultValues: defaultForm,
  });

  const {
    data: detailFeedbackLevel,
    error: ErrorMessage,
    isLoading: isLoadingDetail,
  } = useQuery<FeedbackLevelDetailResponse, Error, FeedbackLevel>({
    queryKey: ['feedback-level-detail', dataEdit?.id],
    queryFn: () => complaintService.getDetailFeedbackLevel(dataEdit!.id.toString()),
    select: (res) => res.data,
    enabled: open && !!dataEdit?.id,
  });

  const onCloseClick = () => {
    form.reset(defaultForm);
    onclose();
  };

  useEffect(() => {
    if (!open) return;
    if (ErrorMessage) {
      handleApiError(ErrorMessage, undefined, t('common.fetchError'));
    }

    if (detailFeedbackLevel) {
      form.reset({
        ...detailFeedbackLevel,
        error_cause_ids: detailFeedbackLevel.error_cause_ids?.map((item) => item.toString()),
        parent_id: detailFeedbackLevel.parent_id.toString(),
        resolution_time_hours: detailFeedbackLevel.resolution_time_hours?.toString(),
      });
    } else if (!dataEdit?.id) {
      form.reset(defaultForm);
    }
  }, [detailFeedbackLevel, dataEdit?.id, open, form, ErrorMessage, t]);

  const { data: errorCausesOptions } = useQuery<ErrorCauseResponse, Error, Option[]>({
    queryKey: ['error-causes-list-100'],
    queryFn: () =>
      complaintService.getListErrorCauses({
        page: 1,
        size: 1000,
      }),
    select: (res) =>
      res.data.page_data.map((item) => ({
        value: item.id.toString(),
        label: item.code,
      })),
    enabled: open,
  });

  const { data: feedbackLevel1Data } = useQuery<FeedbackLevelResponse, Error, Option[]>({
    queryKey: ['feedback-level-1-list', { is_deleted: false }],
    queryFn: () =>
      complaintService.getFeedbackLevel1Data({
        page: 1,
        size: 100,
        is_deleted: false,
      }),
    select: (res) =>
      res.data.page_data.map((item) => ({
        value: item.id.toString(),
        label: item.code,
      })),
    enabled: open,
  });

  const onSubmit = async (data: z.infer<ReturnType<typeof createFeedbackLevel2Schema>>) => {
    const dataSubmit = {
      ...data,
      error_cause_ids: data.error_cause_ids.map((item) => Number(item)),
      parent_id: Number(data.parent_id),
      resolution_time_hours: Number(data.resolution_time_hours),
    };
    setIsLoading(true);
    try {
      if (dataEdit?.id) {
        await complaintService.updateFeedbackLevel1(dataSubmit, dataEdit.id.toString());
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ['feedback-level-2-history-list', dataEdit.id],
          }),
          queryClient.invalidateQueries({
            queryKey: ['feedback-level-detail', dataEdit.id],
          }),
        ]);
      } else {
        await complaintService.createFeedbackLevel1(dataSubmit);
      }

      // Refresh the error causes list
      await queryClient.invalidateQueries({
        queryKey: ['feedback-level-2-list'],
      });

      toast.success(dataEdit ? t('common.updateSuccess') : t('common.createSuccess'));
      onCloseClick();
    } catch (error) {
      console.log(error);
      handleApiError(error, form, dataEdit ? t('common.updateError') : t('common.createError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogCustom
      open={open}
      onclose={onCloseClick}
      title={
        dataEdit
          ? t('settingComplaint.feedbackCategorySetup.editFeedbackLevel2')
          : t('settingComplaint.feedbackCategorySetup.addFeedbackLevel2TitleModal')
      }
      className='!max-w-xl h-fit'
    >
      <Loading isLoading={isLoadingDetail}>
        <div className='py-2'>
          <Form {...form}>
            <form
              className='grid grid-cols-2 gap-x-4 gap-y-1'
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Version Code */}

              <FormField
                control={form.control}
                name='parent_id'
                render={({ field, fieldState }) => (
                  <FormItem className='min-w-0'>
                    <FormLabel className='font-semibold'>
                      {t('settingComplaint.feedbackCategorySetup.feedbackLevel1CodeCreate')}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        options={feedbackLevel1Data || []}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t(
                          'settingComplaint.feedbackCategorySetup.placeholderFeedbackLevel1CodeCreate'
                        )}
                        lengthTruncate={100}
                        i18n={true}
                        hasError={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>
                      {t('settingComplaint.feedbackCategorySetup.feedbackLevel2CodeCreate')}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'settingComplaint.feedbackCategorySetup.placeholderFeedbackLevel2CodeCreate'
                        )}
                        {...field}
                        disabled={!!dataEdit?.id}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>
                      {t('settingComplaint.feedbackCategorySetup.feedbackLevel2NameCreate')}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'settingComplaint.feedbackCategorySetup.placeholderFeedbackLevel2NameCreate'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='resolution_time_hours'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>
                      {t('settingComplaint.feedbackCategorySetup.resolutionTimeHours')}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'settingComplaint.feedbackCategorySetup.placeholderResolutionTimeHours'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='is_deleted'
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>
                      {t('settingComplaint.feedbackCategorySetup.status')}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString() ?? 'false'}
                        onValueChange={(value) => field.onChange(value === 'true')}
                      >
                        <SelectTrigger className='w-full' aria-invalid={!!fieldState.error}>
                          <SelectValue
                            placeholder={t(
                              'settingComplaint.feedbackCategorySetup.placeholderStatus'
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent className={fieldState.error ? 'border-destructive' : ''}>
                          {STATUS_DELETED_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {t(option.label)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='processing_office'
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className='font-semibold'>
                      {t('settingComplaint.feedbackCategorySetup.processingOffice')}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        options={postOfficeOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t(
                          'settingComplaint.feedbackCategorySetup.placeholderProcessingOffice'
                        )}
                        i18n={true}
                        hasError={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='error_cause_ids'
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel className='font-semibold'>
                      {t('settingComplaint.feedbackCategorySetup.errorCause')}
                    </FormLabel>
                    <FormControl>
                      <ComboBoxMulti
                        options={errorCausesOptions || []}
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder={t(
                          'settingComplaint.feedbackCategorySetup.placeholderErrorCause'
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className='grid grid-cols-2 gap-4 col-span-2'>
                <ButtonLoading type='button' onClick={onCloseClick} variant='create'>
                  {t('common.cancel')}
                </ButtonLoading>
                <ButtonLoading type='submit' loading={isLoading}>
                  {t('common.confirm')}
                </ButtonLoading>
              </div>
            </form>
          </Form>
        </div>
      </Loading>
    </DialogCustom>
  );
};
