import ButtonLoading from '@/components/common/ButtonLoading';
import { Combobox } from '@/components/common/ComboBoxCustom';
import { RangeDatePicker } from '@/components/common/RangeDatePicker';
import MultiSelect from '@/components/common/SelectMuilti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DEADLINE_STATUS_OPTIONS, SEVERITY_TYPES_OPTIONS } from '@/constants/options';
import { useLocationChain } from '@/hooks/useLocationChain';
import type { ComplaintRateReportFilterData } from '@/schemas/complaint-management';
import type { ComplaintRateReportQueryParams } from '@/types/complaint-management';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  onSubmit: (data: ComplaintRateReportQueryParams) => void;
  onExport: () => void;
  onCreate: () => void;
  loadingExport?: boolean;
}

export const FilterComplaintRateReport = ({ onSubmit, onExport, loadingExport }: Props) => {
  const { t } = useTranslation();
  const { control, handleSubmit, setValue } = useForm<ComplaintRateReportFilterData>({
    defaultValues: {
      creationTime: { from: '', to: '' },
      branchIds: '',
      postOfficeIds: '',
      complaintCount: '',
      priority: [],
      deadlineStatus: '',
    },
  });

  const selectedBranchIds = useWatch({ control, name: 'branchIds' });

  const { branchOptions, postOfficeOptions, branchLoading, postOfficeLoading } = useLocationChain({
    branchId: selectedBranchIds,
    showPostman: false,
  });

  const handleSearch = (data: ComplaintRateReportFilterData) => {
    const { creationTime, priority, branchIds, postOfficeIds, ...rest } = data;

    const raw: ComplaintRateReportQueryParams = {
      ...(rest.complaintCount && { complaintCount: rest.complaintCount }),
      ...(rest.deadlineStatus && { deadlineStatuses: rest.deadlineStatus }),
      ...(branchIds && { branchIds }),
      ...(postOfficeIds && { postOfficeIds }),
      ...(priority.length > 0 && { priorities: priority.join(',') }),
      ...(creationTime.from && { reportDateFrom: creationTime.from }),
      ...(creationTime.to && { reportDateTo: creationTime.to }),
    };

    onSubmit(raw);
  };

  return (
    <Card className='p-4'>
      <form onSubmit={handleSubmit(handleSearch)}>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4'>
          <div className='flex flex-col gap-2'>
            <Label>{t('complaintRateReport.reportTime')}</Label>
            <Controller
              name='creationTime'
              control={control}
              render={({ field }) => (
                <RangeDatePicker
                  onChange={field.onChange}
                  value={field.value}
                  disabled={{ after: new Date() }}
                  placeholder={t('complaintRateReport.placeholderReportTime')}
                  maxRange={30}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>{t('complaintRateReport.branch')}</Label>
            <Controller
              name='branchIds'
              control={control}
              render={({ field }) => (
                <Combobox
                  options={branchOptions}
                  value={field.value}
                  onChange={(vals) => {
                    setValue('postOfficeIds', '');
                    field.onChange(vals);
                  }}
                  isLoading={branchLoading}
                  placeholder={t('complaintRateReport.placeholderBranch')}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>{t('complaintRateReport.postOffice')}</Label>
            <Controller
              name='postOfficeIds'
              control={control}
              render={({ field }) => (
                <Combobox
                  options={postOfficeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  isLoading={postOfficeLoading}
                  disable={!selectedBranchIds}
                  placeholder={t('complaintRateReport.placeholderPostOffice')}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>{t('complaintRateReport.complaintCount')}</Label>
            <Controller
              name='complaintCount'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  onlyNumber
                  min={0}
                  onlyInteger
                  placeholder={t('complaintRateReport.placeholderComplaintCount')}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>{t('complaintRateReport.level')}</Label>
            <Controller
              name='priority'
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={SEVERITY_TYPES_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('complaintRateReport.placeholderLevel')}
                  in18n={true}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>{t('complaintRateReport.deadline')}</Label>
            <Controller
              name='deadlineStatus'
              control={control}
              render={({ field }) => (
                <Combobox
                  options={DEADLINE_STATUS_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('complaintRateReport.placeholderDeadline')}
                  i18n={true}
                />
              )}
            />
          </div>

          <div className='flex items-end gap-2'>
            <Button type='submit' variant='default'>
              {t('common.search')}
            </Button>
            <ButtonLoading
              type='button'
              onClick={onExport}
              loading={loadingExport}
              variant='export'
            >
              {t('common.exportExcel')}
            </ButtonLoading>
          </div>
        </div>
      </form>
    </Card>
  );
};
