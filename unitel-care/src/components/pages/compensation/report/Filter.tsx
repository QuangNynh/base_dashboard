import { format, subDays } from 'date-fns';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/common/ComboBoxCustom';
import { ComboBoxMulti } from '@/components/common/ComboBoxMuilti';
import { ViolationRangeDatePicker } from '@/components/pages/violation-report-conclude/ViolationRangeDatePicker';
import ButtonLoading from '@/components/common/ButtonLoading';
import { useQuery } from '@tanstack/react-query';
import { violationReportService } from '@/services/violationReport';
import compact from 'lodash/compact';

const DATE_FORMAT = 'dd/MM/yyyy';
const MAX_DATE_RANGE_DAYS = 90;

export type CompensationReportFilterData = {
  fromDate: string;
  toDate: string;
  branchId?: string;
  postOfficeIds: string[];
};

interface Props {
  onSubmit: (data: CompensationReportFilterData) => void;
  onExport: () => void;
  loadingExport?: boolean;
  onExportDetail: () => void;
  loadingExportDetail?: boolean;
}

const CompensationReportFilter = ({
  onSubmit,
  onExport,
  loadingExport,
  onExportDetail,
  loadingExportDetail,
}: Props) => {
  const { t } = useTranslation();

  const schema = useMemo(
    () =>
      z.object({
        creationTime: z.object({
          from: z.string(),
          to: z.string(),
        }),
        branchId: z.string().optional(),
        postOfficeIds: z.array(z.string()),
      }),
    []
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      creationTime: {
        from: format(subDays(new Date(), 7), DATE_FORMAT),
        to: format(new Date(), DATE_FORMAT),
      },
      branchId: undefined,
      postOfficeIds: [],
    },
  });

  const branchId = useWatch({ control, name: 'branchId' });

  const { data: branchesRes } = useQuery({
    queryKey: ['compensation-report-branches'],
    queryFn: () => violationReportService.getListAccessibleBranches(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: allPostOfficesRes } = useQuery({
    queryKey: ['compensation-report-all-post-offices', branchId],
    queryFn: () => violationReportService.getListAccessiblePostOffice(branchId || ''),
    staleTime: 5 * 60 * 1000,
    enabled: !!branchId,
  });

  const handleSearch = handleSubmit((values) => {
    onSubmit({
      fromDate: values.creationTime.from ?? '',
      toDate: values.creationTime.to ?? '',
      branchId: values.branchId,
      postOfficeIds: values.postOfficeIds.length ? values.postOfficeIds : [],
    });
  });

  const branchOptions = useMemo(
    () =>
      (branchesRes?.data ?? []).map((item) => ({
        value: item.departmentId,
        label: compact([item.code, item.name]).join(' - '),
      })),
    [branchesRes]
  );

  const postOfficeOptions = useMemo(
    () =>
      (allPostOfficesRes?.data ?? []).map((item) => ({
        value: item.departmentId,
        label: compact([item.code, item.name]).join(' - '),
      })),
    [allPostOfficesRes]
  );

  return (
    <Card className='p-4'>
      <form onSubmit={handleSearch}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[2fr_2fr_2fr_2fr_auto] xl:items-end'>
          <div className='flex flex-col gap-2'>
            <Label>{t('compensation.report.timeRange')}</Label>
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
                />
              )}
            />
            {errors.creationTime?.to?.message && (
              <p className='text-sm text-destructive'>{errors.creationTime.to.message}</p>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <Label>{t('compensation.report.branch')}</Label>
            <Controller
              name='branchId'
              control={control}
              render={({ field }) => (
                <Combobox
                  placeholder={t('compensation.report.placeholderBranch')}
                  options={branchOptions}
                  value={field.value || null}
                  onChange={(id) => {
                    field.onChange(id);
                    setValue('postOfficeIds', []);
                  }}
                  clearValue
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
                  placeholder={t('complaintManagement.placeholderPostOffice')}
                  checkbox
                  selectAll
                  disable={!branchId}
                />
              )}
            />
          </div>

          <div className='flex gap-2 items-end mt-2 lg:mt-0'>
            <Button type='submit' className='w-full md:w-auto'>
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
            <ButtonLoading
              type='button'
              onClick={onExportDetail}
              variant='export'
              loading={loadingExportDetail}
            >
              {t('compensation.report.exportExcelDetail')}
            </ButtonLoading>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default CompensationReportFilter;
