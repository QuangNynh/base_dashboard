import { format, subDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonLoading from '@/components/common/ButtonLoading';
import { InputSearch } from '@/components/common/InputSearch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ComboBoxMulti } from '@/components/common/ComboBoxMuilti';
import { ViolationRangeDatePicker } from '../../violation-report-conclude/ViolationRangeDatePicker';
import {
  CompensationListFilterSchema,
  type CompensationListFilterDataSchema,
} from '@/schemas/compensation';
import type { CompensationListFilterData } from '@/types/compensation';
import { STATUS_COMPENSATION_OPTIONS } from '../../../../constants/status';
import type { FilterOption } from '../money/Filter';

const DATE_FORMAT = 'dd/MM/yyyy';
const MAX_DATE_RANGE_DAYS = 60;

interface Props {
  onSubmit: (data: CompensationListFilterData) => void;
  onExport: () => void;
  loadingExport?: boolean;
  postOfficeOptions?: FilterOption[];
}

const FilterCompensationList = ({
  onSubmit,
  onExport,
  loadingExport,
  postOfficeOptions,
}: Props) => {
  const { t } = useTranslation();

  const resolver = useMemo(() => zodResolver(CompensationListFilterSchema(t)), [t]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompensationListFilterDataSchema>({
    resolver,
    defaultValues: {
      keyword: '',
      creationTime: {
        from: format(subDays(new Date(), 7), DATE_FORMAT),
        to: format(new Date(), DATE_FORMAT),
      },
      status: [],
      paymentStatus: '',
      postOfficeIds: [],
    },
  });

  const statusOptions = useMemo(() => {
    return STATUS_COMPENSATION_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.label) }));
  }, [t]);

  const handleSearch = (data: CompensationListFilterDataSchema) => {
    const { creationTime, status, keyword, postOfficeIds } = data;
    onSubmit({
      keyword: keyword.trim(),
      status: status.length > 0 ? status.map(Number) : undefined,
      fromDate: creationTime.from || undefined,
      toDate: creationTime.to || undefined,
      postOfficeIds: postOfficeIds.length > 0 ? postOfficeIds : undefined,
    });
  };

  return (
    <Card className='p-4'>
      <form onSubmit={handleSubmit(handleSearch)}>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-3'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='keyword'>{t('complaintManagement.search')}</Label>
            <Controller
              name='keyword'
              control={control}
              render={({ field }) => (
                <InputSearch {...field} placeholder={t('compensation.formSearchPlaceholderList')} />
              )}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='creationTime'>{t('complaintManagement.creationTime')}</Label>
            <Controller
              name='creationTime'
              control={control}
              render={({ field }) => (
                <ViolationRangeDatePicker
                  onChange={field.onChange}
                  value={field.value}
                  enableClear={false}
                  maxRangeDays={MAX_DATE_RANGE_DAYS}
                  placeholder={t('complaintManagement.placeholderCreationTime')}
                />
              )}
            />
            {errors.creationTime?.to?.message && (
              <p className='text-sm text-destructive'>{errors.creationTime.to.message}</p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='status'>{t('complaintManagement.status')}</Label>
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
                  options={postOfficeOptions ?? []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('complaintManagement.placeholderPostOffice')}
                  checkbox
                  selectAll
                />
              )}
            />
          </div>
          <div className='flex items-end gap-2 flex-wrap col-span-2'>
            <Button type='submit' variant='default'>
              {t('common.search')}
            </Button>
            <ButtonLoading
              type='button'
              onClick={onExport}
              variant='export'
              loading={loadingExport}
            >
              {t('common.exportExcel')}
            </ButtonLoading>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default FilterCompensationList;
