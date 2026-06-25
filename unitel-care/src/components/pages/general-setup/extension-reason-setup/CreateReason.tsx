import ButtonLoading from '@/components/common/ButtonLoading';
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
import { Textarea } from '@/components/ui/textarea';
import { STATUS_DELETED_OPTIONS } from '@/constants/status';
import { handleApiError } from '@/lib/utils';
import {
  createExtensionReasonSchema,
  type CreateExtensionReasonData,
} from '@/schemas/settingComplaintSchema';
import { complaintService } from '@/services/complaintService';
import type { ExtensionReason } from '@/types/complaint-management';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
interface props {
  open: boolean;
  onclose: () => void;
  dataEdit?: ExtensionReason | null;
}

const defaultForm: CreateExtensionReasonData = {
  code: '',
  name: '',
  is_deleted: false,
  max_hours: '',
};

export const CreateExtensionReasonDialog = ({ open, onclose, dataEdit }: props) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateExtensionReasonData>({
    resolver: zodResolver(createExtensionReasonSchema(t)),
    defaultValues: defaultForm,
  });

  useEffect(() => {
    if (dataEdit) {
      form.reset({
        code: dataEdit.code,
        name: dataEdit.reason,
        max_hours: dataEdit.maxHours?.toString() || '',
        is_deleted: dataEdit.is_deleted,
      });
    } else {
      form.reset(defaultForm);
    }
  }, [dataEdit, form, open]);

  const onSubmit = async (formData: CreateExtensionReasonData) => {
    setIsLoading(true);
    try {
      if (dataEdit?.id) {
        await complaintService.updateExtensionReason(formData, dataEdit.id.toString());
      } else {
        await complaintService.createExtensionReason(formData);
      }

      // Refresh the extension reasons list
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['extension-reason-list'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['extension-reason-history-list', dataEdit?.id],
        }),
      ]);

      toast.success(dataEdit ? t('common.updateSuccess') : t('common.createSuccess'));
      onclose();
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
      onclose={onclose}
      title={
        dataEdit
          ? t('settingComplaint.extensionReason.editExtensionReason')
          : t('settingComplaint.extensionReason.createExtensionReason')
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
                    {t('settingComplaint.extensionReason.reasonCode')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('settingComplaint.extensionReason.placeholderReasonCode')}
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
                    {t('settingComplaint.extensionReason.reasonDescription')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className='h-12 scrollbar-custom'
                      rows={3}
                      placeholder={t(
                        'settingComplaint.extensionReason.placeholderReasonDescription'
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
              name='max_hours'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold'>
                    {t('settingComplaint.extensionReason.limitTime')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      onlyNumber
                      min={0}
                      placeholder={t('settingComplaint.extensionReason.placeholderLimitTime')}
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
                    {t('settingComplaint.extensionReason.status')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() ?? 'false'}
                      onValueChange={(value) => field.onChange(value === 'true')}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue
                          placeholder={t('settingComplaint.extensionReason.placeholderStatus')}
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
              <ButtonLoading loading={isLoading} type='submit'>
                {t('common.confirm')}
              </ButtonLoading>
            </div>
          </form>
        </Form>
      </div>
    </DialogCustom>
  );
};
