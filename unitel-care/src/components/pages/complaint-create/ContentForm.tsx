import { Combobox } from '@/components/common/ComboBoxCustom';
import { Card } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { CreateComplaintData, EditComplaintData } from '@/schemas/complaint-management';
import { postOfficeService } from '@/services/postOfficeService';
import type { PostOffice, PostOfficeResponse } from '@/types/post-office';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const ContentForm = () => {
  const { t } = useTranslation();
  const { control, setValue, watch } = useFormContext<CreateComplaintData & EditComplaintData>();

  const { data: postOfficeAllData } = useQuery<PostOfficeResponse, Error, PostOffice[]>({
    queryKey: ['post-office-all-list'],
    queryFn: () => postOfficeService.getAllListPostOffice(),
    select: (res) => res.data,
  });

  const postOfficeOptions = useMemo(
    () =>
      postOfficeAllData?.map((item) => ({
        value: item.departmentId,
        label: item.name,
      })) ?? [],
    [postOfficeAllData]
  );

  const handleProcessingPostOfficeChange = (id: string | null) => {
    const selected = postOfficeAllData?.find((item) => item.departmentId === id);
    setValue('processingBranchCode', selected?.parentDepartmentCode ?? '', {
      shouldValidate: true,
    });
    setValue('processingBranchName', selected?.parentDepartmentName ?? '', {
      shouldValidate: true,
    });
  };
  useEffect(() => {
    const processingPostId = watch('processingPostId');
    if (processingPostId) {
      handleProcessingPostOfficeChange(processingPostId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('processingPostId')]);

  return (
    <div>
      <div className='font-semibold text-primary mb-2'>{t('createComplaint.processingInfo')}</div>

      <Card className='grid grid-cols-1 p-4 xl:grid-cols-2 gap-x-4 gap-y-1'>
        <FormField
          control={control}
          name='originPostOfficeName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createComplaint.bcOrigin')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('createComplaint.placeholderBcOrigin')}
                  readOnly
                  {...field}
                  className='bg-disable'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='deliveryPostOfficeName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createComplaint.bcSent')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('createComplaint.placeholderBcSent')}
                  readOnly
                  className='bg-disable'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='processingPostId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('createComplaint.bcProcess')}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <Combobox
                  placeholder={t('createComplaint.placeholderBcProcess')}
                  options={postOfficeOptions}
                  value={field.value ?? null}
                  onChange={(val) => field.onChange(val)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='originBranchName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createComplaint.cnOrigin')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('createComplaint.placeholderCnOrigin')}
                  readOnly
                  className='bg-disable'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='deliveryBranchName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createComplaint.cnSent')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('createComplaint.placeholderCnSent')}
                  readOnly
                  className='bg-disable'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='processingBranchName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('createComplaint.cnProcess')}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t('createComplaint.placeholderCnProcess')}
                  readOnly
                  className='bg-disable'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Card>
    </div>
  );
};

export default ContentForm;
