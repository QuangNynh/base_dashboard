import { DialogCustom } from '@/components/common/DialogCustom';
import { Button } from '@/components/ui/button';
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
import { STATUS_DELETED_OPTIONS } from '@/constants/status';
import { handleApiError } from '@/lib/utils';
import { createFeedbackLevel1Schema } from '@/schemas/settingComplaintSchema';
import { complaintService } from '@/services/complaintService';
import type { FeedbackLevel } from '@/types/complaint-management';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
interface props {
  open: boolean;
  onclose: () => void;
  dataEdit?: FeedbackLevel | null;
}

const defaultForm = {
  code: '',
  name: '',
  is_deleted: false,
  level: 1,
};

export const CreateFeedbackLevel1Dialog = ({ open, onclose, dataEdit }: props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createFeedbackLevel1Schema(t)),
    defaultValues: defaultForm,
  });

  useEffect(() => {
    if (dataEdit) {
      form.reset(dataEdit);
    } else {
      form.reset(defaultForm);
    }
  }, [dataEdit, form, open]);

  const onSubmit = async (data: z.infer<ReturnType<typeof createFeedbackLevel1Schema>>) => {
    try {
      if (dataEdit?.id) {
        await complaintService.updateFeedbackLevel1(data, dataEdit.id.toString());
        await queryClient.invalidateQueries({
          queryKey: ['feedback-level-1-history-list', dataEdit.id],
        });
      } else {
        await complaintService.createFeedbackLevel1(data);
      }

      // Refresh the error causes list
      await queryClient.invalidateQueries({
        queryKey: ['feedback-level-1-list'],
      });
      toast.success(dataEdit ? t('common.updateSuccess') : t('common.createSuccess'));
      onclose();
    } catch (error) {
      console.log(error);
      handleApiError(error, form, dataEdit ? t('common.updateError') : t('common.createError'));
    }
  };

  return (
    <DialogCustom
      open={open}
      onclose={onclose}
      title={
        dataEdit
          ? t('settingComplaint.feedbackCategorySetup.editFeedbackLevel1')
          : t('settingComplaint.feedbackCategorySetup.addFeedbackLevel1TitleModal')
      }
      className='!max-w-lg h-fit'
    >
      <div className='py-2'>
        <Form {...form}>
          <form className='flex flex-col gap-1' onSubmit={form.handleSubmit(onSubmit)}>
            {/* Version Code */}
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold'>
                    {t('settingComplaint.feedbackCategorySetup.feedbackLevel1CodeCreate')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        'settingComplaint.feedbackCategorySetup.placeholderFeedbackLevel1CodeCreateEnter'
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
                    {t('settingComplaint.feedbackCategorySetup.feedbackLevel1NameCreate')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        'settingComplaint.feedbackCategorySetup.placeholderFeedbackLevel1NameCreate'
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
              render={({ field }) => (
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
                      <SelectTrigger className='w-full'>
                        <SelectValue
                          placeholder={t(
                            'settingComplaint.feedbackCategorySetup.placeholderStatus'
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
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

            {/* Action Buttons */}
            <div className='grid grid-cols-2 gap-4'>
              <Button type='button' onClick={onclose} variant='create'>
                {t('common.cancel')}
              </Button>
              <Button type='submit'>{t('common.confirm')}</Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogCustom>
  );
};
