import { InputSearch } from '@/components/common/InputSearch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STATUS, STATUS_OPTIONS } from '@/constants/status';
import type { ErrorCauseSearch } from '@/types/complaint-management';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlusIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
  onSubmit: (data: ErrorCauseSearch) => void;
  onCreate: () => void;
}

const ErrorCauseFilterSchema = z.object({
  keyword: z.string(),
  is_deleted: z.string(),
});

type ErrorCauseFilterData = z.infer<typeof ErrorCauseFilterSchema>;

export const FilterErrorsCause = ({ onSubmit, onCreate }: Props) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<ErrorCauseFilterData>({
    resolver: zodResolver(ErrorCauseFilterSchema),
    defaultValues: {
      keyword: '',
      is_deleted: STATUS.ALL,
    },
  });

  const handleSearch = (data: ErrorCauseFilterData) => {
    onSubmit({
      ...data,
      is_deleted:
        data.is_deleted === STATUS.ALL
          ? undefined
          : data.is_deleted === STATUS.ACTIVE
            ? false
            : true,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleSearch)}>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4'>
        {/* Lý do gia hạn */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='search'>{t('settingComplaint.extensionReason.labelCause')}</Label>
          <Controller
            name='keyword'
            control={control}
            render={({ field }) => (
              <InputSearch
                {...field}
                placeholder={t('settingComplaint.extensionReason.placeholderErrorCause')}
              />
            )}
          />
        </div>

        {/* Trạng thái */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='is_deleted'>{t('settingComplaint.extensionReason.status')}</Label>
          <Controller
            name='is_deleted'
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue
                    placeholder={t('settingComplaint.extensionReason.placeholderStatus')}
                  />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className='flex items-end gap-2'>
          <Button type='submit' variant='default'>
            {t('common.search')}
          </Button>
          <Button type='button' onClick={onCreate} variant='create'>
            <CirclePlusIcon className='!w-4 !h-4' />
            {t('settingComplaint.extensionReason.addCause')}
          </Button>
        </div>
      </div>
    </form>
  );
};
