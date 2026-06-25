import { format, startOfMonth } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { InputSearch } from '@/components/common/InputSearch';
import { ComboBoxMulti } from '@/components/common/ComboBoxMuilti';
import { ViolationRangeDatePicker } from '../../violation-report-conclude/ViolationRangeDatePicker';
import {
  CompensationListFilterSchema,
  type CompensationListFilterDataSchema,
} from '@/schemas/compensation';
import type { CompensationListFilterData } from '@/types/compensation';
import { Combobox } from '@/components/common/ComboBoxCustom';

const DATE_FORMAT = 'dd/MM/yyyy';
const MAX_DATE_RANGE_DAYS = 70;

export type FilterOption = {
  label: string;
  value: string;
};

export interface CompensationMoneyFilterData extends CompensationListFilterData {
  postOfficeIds?: string[];
  paymentStatus?: string;
}

interface Props {
  onSubmit: (data: CompensationMoneyFilterData) => void;
  statusOptions?: FilterOption[];
  paymentStatusOptions?: FilterOption[];
  postOfficeOptions?: FilterOption[];
}

const Filter = ({
  onSubmit,
  statusOptions = [],
  postOfficeOptions = [],
  paymentStatusOptions = [],
}: Props) => {
  const { t } = useTranslation();

  const resolver = useMemo(
    () =>
      zodResolver(
        CompensationListFilterSchema(t).extend({
          postOfficeIds: z.array(z.string()),
        })
      ),
    [t]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompensationListFilterDataSchema & { postOfficeIds: string[] }>({
    resolver,
    defaultValues: {
      keyword: '',
      creationTime: {
        from: format(startOfMonth(new Date()), DATE_FORMAT),
        to: format(new Date(), DATE_FORMAT),
      },
      status: [],
      postOfficeIds: [],
      paymentStatus: '',
    },
  });

  const handleSearch = (data: CompensationListFilterDataSchema & { postOfficeIds: string[] }) => {
    const { creationTime, status, postOfficeIds, keyword, ...rest } = data;

    onSubmit({
      ...rest,
      keyword: keyword.trim(),
      status: status.length > 0 ? status.map(Number) : [],
      fromDate: creationTime.from || '',
      toDate: creationTime.to || '',
      postOfficeIds: postOfficeIds.length > 0 ? postOfficeIds : undefined,
    });
  };

  return (
    <Card className='p-4'>
      <form onSubmit={handleSubmit(handleSearch)}>
        <div className='grid grid-cols-2 md:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='keyword'>{t('common.search')}</Label>
            <Controller
              name='keyword'
              control={control}
              render={({ field }) => (
                <InputSearch
                  {...field}
                  placeholder={t('compensation.moneyFilter.placeholderKeyword')}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='creationTime'>{t('orderActionHistory.actionTime')}</Label>
            <Controller
              name='creationTime'
              control={control}
              render={({ field }) => (
                <ViolationRangeDatePicker
                  onChange={field.onChange}
                  value={field.value}
                  enableClear={false}
                  maxRangeDays={MAX_DATE_RANGE_DAYS}
                  placeholder={t('compensation.moneyFilter.placeholderCreationTime')}
                  maxFutureDays={12000}
                />
              )}
            />
            {errors.creationTime?.to?.message && (
              <p className='text-sm text-destructive'>{errors.creationTime.to.message}</p>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='status'>{t('settingComplaint.feedbackCategorySetup.status')}</Label>
            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <ComboBoxMulti
                  options={statusOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('complaintManagement.placeholderStatus')}
                  checkbox
                  selectAll
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='postOfficeIds'>{t('complaintManagement.postOffice')}</Label>
            <Controller
              name='postOfficeIds'
              control={control}
              render={({ field }) => (
                <ComboBoxMulti
                  options={postOfficeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('complaintManagement.placeholderPostOffice')}
                  checkbox
                  selectAll
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='paymentStatus'>{t('compensation.moneyTable.colPaymentStatus')}</Label>
            <Controller
              name='paymentStatus'
              control={control}
              render={({ field }) => (
                <Combobox
                  placeholder={t('complaintManagement.placeholderStatus')}
                  options={paymentStatusOptions}
                  value={field.value}
                  onChange={field.onChange}
                  clearValue
                />
              )}
            />
          </div>

          <div>
            <Button type='submit' variant='default' className='w-full xl:w-auto'>
              {t('common.search')}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default Filter;
