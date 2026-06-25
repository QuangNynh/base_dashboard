import { Card } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CHANNEL_TYPES_NO_ALL_OPTIONS_CREATE } from '@/constants/options';
import { getAddressByLevel, handleApiError } from '@/lib/utils';
import { getDefaultValues, type CreateComplaintData } from '@/schemas/complaint-management';
import { complaintService } from '@/services/complaintService';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const GeneralInfoForm = ({ orderCode }: { orderCode?: string }) => {
  const { t } = useTranslation();
  const { control, setValue, reset, getValues } = useFormContext<CreateComplaintData>();
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);

  const queryClient = useQueryClient();

  const resetTrackingFields = () => {
    setValue('customerDistrictName', '');
    setValue('customerProvinceName', '');
    setValue('contactName', '');
    setValue('deliveryPostOfficeName', '');
    setValue('deliveryBranchName', '');
    setValue('originBranchName', '');
    setValue('originPostOfficeName', '');
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (!value) {
      resetTrackingFields();
      return;
    }

    try {
      setIsLoadingTracking(true);
      const res = await queryClient.fetchQuery({
        queryKey: ['tracking-code-info', value],
        queryFn: () => complaintService.getInformationTrackingCode(value),
      });

      if (res?.data) {
        toast.success(t('createComplaint.successGetTrackingCode'));
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { contactType, ...info } = res.data;

        if (info) {
          reset({
            ...getDefaultValues(getValues('contactType') as 'SENDER' | 'RECEIVER'),
            ...info,
            customerProvinceName: getAddressByLevel(info?.address, 1)?.name || '',
            customerDistrictName: getAddressByLevel(info?.address, 2)?.name || '',
          });
        }
      } else {
        resetTrackingFields();
        toast.error(t('common.trackingCodeNotFound'));
      }
    } catch (error) {
      resetTrackingFields();
      handleApiError(error, undefined, t('common.trackingCodeNotFound'));
    } finally {
      setIsLoadingTracking(false);
    }
  };

  return (
    <div>
      <div className='font-semibold text-primary text-base sm:text-lg mb-2'>
        {t('createComplaint.generalInfo')}
      </div>

      {/* ROW 1 */}
      <Card className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-1 p-4'>
        <FormField
          control={control}
          name='orderCode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('createComplaint.trackingCode')}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    placeholder={t('createComplaint.placeholderTrackingCode')}
                    {...field}
                    onBlur={handleBlur}
                    readOnly={isLoadingTracking || !!orderCode}
                    className={isLoadingTracking || !!orderCode ? 'bg-disable pr-9' : ''}
                  />
                  {isLoadingTracking && (
                    <Loader2 className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground' />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='receiptChannel'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('createComplaint.receptionChannel')}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <Select key={field.value} value={field.value ?? ''} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={t('complaintManagement.placeholderChannel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNEL_TYPES_NO_ALL_OPTIONS_CREATE.map((option) => (
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
          control={control}
          name='requestPhoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createComplaint.callCenterPhone')}</FormLabel>
              <FormControl>
                <Input
                  onlyNumber
                  placeholder={t('createComplaint.placeholderCallCenterPhone')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='contactPhoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createComplaint.contactPhone')}</FormLabel>
              <FormControl>
                <Input
                  onlyNumber
                  placeholder={t('createComplaint.placeholderContactPhone')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='contactName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createComplaint.customerName')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('createComplaint.placeholderCustomerName')}
                  {...field}
                  className='bg-disable'
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ROW 2 */}
        <FormField
          control={control}
          name='customerProvinceName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createComplaint.province')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('createComplaint.placeholderProvince')}
                  {...field}
                  className='bg-disable'
                  readOnly
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='customerDistrictName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createComplaint.district')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('createComplaint.placeholderDistrict')}
                  {...field}
                  readOnly
                  className='bg-disable'
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

export default GeneralInfoForm;
