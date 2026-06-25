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
import type { FeedbackLevel1Params } from '@/types/complaint-management';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlusIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
  onSubmit: (data: FeedbackLevel1Params) => void;
  onCreate: () => void;
}

const FeedbackLevel1FilterSchema = z.object({
  keyword: z.string(),
  is_deleted: z.string(),
});

type FeedbackLevel1FilterData = z.infer<typeof FeedbackLevel1FilterSchema>;

export const FilterFeedbackLevel1 = ({ onSubmit, onCreate }: Props) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<FeedbackLevel1FilterData>({
    resolver: zodResolver(FeedbackLevel1FilterSchema),
    defaultValues: {
      keyword: '',
      is_deleted: STATUS.ALL,
    },
  });

  const handleSearch = (data: FeedbackLevel1FilterData) => {
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
          <Label htmlFor='search'>
            {t('settingComplaint.feedbackCategorySetup.feedbackLevel1NameFilter')}
          </Label>
          <Controller
            name='keyword'
            control={control}
            render={({ field }) => (
              <InputSearch
                {...field}
                placeholder={t(
                  'settingComplaint.feedbackCategorySetup.placeholderFeedbackLevel1NameFilter'
                )}
              />
            )}
          />
        </div>

        {/* Trạng thái */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='is_deleted'>{t('settingComplaint.feedbackCategorySetup.status')}</Label>
          <Controller
            name='is_deleted'
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue
                    placeholder={t(
                      'settingComplaint.feedbackCategorySetup.placeholderStatusFilter'
                    )}
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
            {t('settingComplaint.feedbackCategorySetup.addFeedbackLevel1')}
          </Button>
        </div>
      </div>
    </form>
  );
};
