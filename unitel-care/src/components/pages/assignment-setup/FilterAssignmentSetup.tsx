import { InputSearch } from '@/components/common/InputSearch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

interface Props {
  onSubmit: (data: Pick<AssignmentSetupFilterData, 'keyword'>) => void;
  onCreate: () => void;
}

const AssignmentSetupFilterSchema = z.object({
  keyword: z.string(),
  area_id: z.array(z.string()),
});

export type AssignmentSetupFilterData = z.infer<typeof AssignmentSetupFilterSchema>;

export const FilterAssignmentSetup = ({ onSubmit }: Props) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<AssignmentSetupFilterData>({
    resolver: zodResolver(AssignmentSetupFilterSchema),
    defaultValues: {
      keyword: '',
      area_id: [],
    },
  });

  const handleSearch = (data: AssignmentSetupFilterData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleSearch)}>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4'>
        {/* Lý do gia hạn */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='search'>{t('settingComplaint.assignmentSetup.employeeCode')}</Label>
          <Controller
            name='keyword'
            control={control}
            render={({ field }) => (
              <InputSearch
                {...field}
                placeholder={t('settingComplaint.assignmentSetup.placeholderReasonCode')}
              />
            )}
          />
        </div>

        <div className='flex items-end gap-2'>
          <Button type='submit' variant='default'>
            {t('common.search')}
          </Button>
        </div>
      </div>
    </form>
  );
};
