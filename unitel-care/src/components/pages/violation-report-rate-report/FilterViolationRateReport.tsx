import { ViolationRangeDatePicker } from '@/components/pages/violation-report-conclude/ViolationRangeDatePicker';
import ButtonLoading from '@/components/common/ButtonLoading';
import { ComboBoxMulti } from '@/components/common/ComboBoxMuilti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { violationReportService } from '@/services/violationReport';
import { tokenService } from '@/lib/token';
import type { BranchResponse, PostOfficeResponse } from '@/types/post-office';
import type { Option } from '@/types/common';
import type { ViolationRateReportQueryParams } from '@/types/violation-report-management';
import { useQuery } from '@tanstack/react-query';
import compact from 'lodash/compact';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { format, subDays } from 'date-fns';
import { Combobox } from '../../common/ComboBoxCustom';

const selectDepartmentOptions = (res: BranchResponse | PostOfficeResponse): Option[] =>
  (res.data ?? []).map((item) => ({
    value: item.departmentId,
    label: compact([item?.code, item?.name]).join(' - '),
  }));

interface FilterFormValues {
  dateRange: { from: string; to: string };
  branchId: string;
  postOfficeIds: string[];
}

interface Props {
  onSubmit: (params: ViolationRateReportQueryParams) => void;
  onExport: () => void;
  loadingExport?: boolean;
}

const DATE_FORMAT = 'dd/MM/yyyy';
export const FilterViolationRateReport = ({ onSubmit, onExport, loadingExport }: Props) => {
  const { t } = useTranslation();

  const userInfoToken = tokenService.getUserInfoToken();
  const userID = (() => {
    try {
      return userInfoToken ? JSON.parse(userInfoToken)?.['cth-user-id'] : undefined;
    } catch {
      return undefined;
    }
  })();

  const { control, handleSubmit, setValue } = useForm<FilterFormValues>({
    defaultValues: {
      dateRange: {
        from: format(subDays(new Date(), 30), DATE_FORMAT),
        to: format(new Date(), DATE_FORMAT),
      },
      branchId: '',
      postOfficeIds: [],
    },
  });

  const selectedBranchId = useWatch({ control, name: 'branchId' });

  const { data: branchOptions = [] } = useQuery<BranchResponse, Error, Option[]>({
    queryKey: ['violation-rate-report-branch', userID],
    queryFn: () => violationReportService.getListAccessibleBranches(),
    select: selectDepartmentOptions,
    enabled: !!userID,
  });

  const { data: postOfficeOptions = [], isLoading: postOfficeLoading } = useQuery<
    PostOfficeResponse,
    Error,
    Option[]
  >({
    queryKey: ['violation-rate-report-post-office', selectedBranchId],
    queryFn: () => violationReportService.getListAccessiblePostOffice(selectedBranchId),
    select: selectDepartmentOptions,
    enabled: !!selectedBranchId,
  });

  const handleSearch = (data: FilterFormValues) => {
    const params: ViolationRateReportQueryParams = {
      ...(data.dateRange.from && { dateFrom: data.dateRange.from }),
      ...(data.dateRange.to && { dateTo: data.dateRange.to }),
      ...(data.branchId && { branchId: data.branchId }),
      ...(data.postOfficeIds.length > 0 && { postOfficeIds: data.postOfficeIds }),
    };
    onSubmit(params);
  };

  return (
    <Card className='p-4'>
      <form onSubmit={handleSubmit(handleSearch)}>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3'>
          <div className='flex flex-col gap-2'>
            <Label>{t('violationRateReport.filterDateRange')}</Label>
            <Controller
              name='dateRange'
              control={control}
              render={({ field }) => (
                <ViolationRangeDatePicker
                  value={field.value}
                  onChange={field.onChange}
                  enableClear={false}
                  placeholder={t('violationRateReport.filterDateRangePlaceholder')}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>{t('complaintManagement.branch')}</Label>
            <Controller
              name='branchId'
              control={control}
              render={({ field }) => (
                <Combobox
                  options={branchOptions ?? []}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue('postOfficeIds', []);
                  }}
                  placeholder={t('complaintManagement.placeholderBranch')}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label>{t('complaintManagement.postOffice')}</Label>
            <Controller
              name='postOfficeIds'
              control={control}
              render={({ field }) => (
                <ComboBoxMulti
                  options={postOfficeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  isLoading={postOfficeLoading}
                  disable={!selectedBranchId}
                  placeholder={t('complaintManagement.placeholderPostOffice')}
                  checkbox
                  selectAll
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
