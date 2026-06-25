import { format, subDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import type { ViolationReportFilterData } from '../../../types/violation-report-management';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import type { BranchResponse, PostOfficeResponse } from '../../../types/post-office';
import { postOfficeService } from '../../../services/postOfficeService';
import { violationReportService } from '../../../services/violationReport';
import type { Option } from '../../../types/common';
import type { ViolationErrorDetailListResponse } from '../../../types/violation-report';
import ButtonLoading from '@/components/common/ButtonLoading';
import { Combobox } from '@/components/common/ComboBoxCustom';
import { InputSearch } from '@/components/common/InputSearch';
import { ViolationRangeDatePicker } from './ViolationRangeDatePicker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { STATUS_VIOLATION_CODE, STATUS_VIOLATION_OPTIONS } from '../../../constants/status';
import {
  ViolationReportFilterSchema,
  type ViolationReportFilterDataSchema,
} from '../../../schemas/violation-report';
import { ComboBoxMulti } from '../../common/ComboBoxMuilti';
import compact from 'lodash/compact';
import { tokenService } from '@/lib/token';

const DATE_FORMAT = 'dd/MM/yyyy';
const MAX_DATE_RANGE_DAYS = 90;

// Module-level stable references — prevents ComboBoxMulti useLayoutEffect from firing on every render
const selectBranchOptions = (res: BranchResponse): Option[] =>
  (res.data ?? []).map((item) => ({
    value: item.departmentId,
    label: compact([item?.code, item?.name]).join(' - '),
  }));

const selectPostOfficeOptions = (res: PostOfficeResponse): Option[] =>
  (res.data ?? []).map((item) => ({
    value: item.departmentId,
    label: compact([item.code, item?.name]).join(' - '),
  }));

const selectErrorDetailOptions = (res: ViolationErrorDetailListResponse): Option[] =>
  (res.data?.page_data ?? []).map((item) => ({
    value: item.mistakeCode,
    label: `${item.mistakeCode} - ${item.mistakeDescription}`,
  }));

type FilterVariant = 'incoming' | 'outgoing' | 'conclude';

interface Props {
  variant: FilterVariant;
  onSubmit: (data: ViolationReportFilterData) => void;
  onExport: () => void;
  onCreate: () => void;
  loadingExport?: boolean;
}

export const FilterViolationReport = ({
  variant,
  onSubmit,
  onExport,
  onCreate,
  loadingExport,
}: Props) => {
  const { t } = useTranslation();

  const userInfoTokenString = tokenService.getUserInfoToken();
  const userInfoToken = userInfoTokenString ? JSON.parse(userInfoTokenString) : null;
  const userID = userInfoToken?.['cth-user-id'];

  const resolver = useMemo(() => zodResolver(ViolationReportFilterSchema(t)), [t]);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ViolationReportFilterDataSchema>({
    resolver,
    defaultValues: {
      keyword: '',
      creationTime: {
        from: format(subDays(new Date(), 7), DATE_FORMAT),
        to: format(new Date(), DATE_FORMAT),
      },
      branchId: '',
      postOfficeId: [],
      status: [],
      mistakeCode: [],
    },
  });

  const handleSearch = (data: ViolationReportFilterDataSchema) => {
    const { creationTime, status, mistakeCode, postOfficeId, keyword, ...rest } = data;
    onSubmit({
      ...rest,
      keyword: keyword?.trim() || undefined,
      status: status.length > 0 ? status.map(Number) : undefined,
      mistakeCode: mistakeCode.length > 0 ? mistakeCode : undefined,
      postOfficeId: postOfficeId.length > 0 ? postOfficeId : undefined,
      fromDate: creationTime.from || '',
      toDate: creationTime.to || '',
    });
  };

  const statusOptions = useMemo(() => {
    if (variant == 'conclude') {
      return STATUS_VIOLATION_OPTIONS.filter((i) =>
        [
          `${STATUS_VIOLATION_CODE.COMPLETED}`,
          `${STATUS_VIOLATION_CODE.INCORRECT}`,
          `${STATUS_VIOLATION_CODE.OPINION}`,
          `${STATUS_VIOLATION_CODE.CANCELLED}`,
        ].includes(i?.value)
      ).map((opt) => ({ value: opt.value, label: t(opt.label) }));
    }
    return STATUS_VIOLATION_OPTIONS.map((opt) => ({ value: opt.value, label: t(opt.label) }));
  }, [t, variant]);

  const isAccessibleVariant = variant === 'incoming' || variant === 'outgoing';

  const { data: branchData } = useQuery<BranchResponse, Error, Option[]>({
    queryKey: ['violation-filter-branch', variant, userID],
    queryFn: () =>
      isAccessibleVariant
        ? violationReportService.getListAccessibleBranches()
        : violationReportService.getConfigBranchByUserID(userID),
    select: selectBranchOptions,
  });

  const selectedBranchId = watch('branchId');

  const { data: postOfficeData } = useQuery<PostOfficeResponse, Error, Option[]>({
    queryKey: ['violation-filter-post-office', variant, selectedBranchId],
    queryFn: () =>
      isAccessibleVariant
        ? violationReportService.getListAccessiblePostOffice(selectedBranchId)
        : postOfficeService.getListPostOfficeByTenant(selectedBranchId),
    enabled: !!selectedBranchId,
    select: selectPostOfficeOptions,
  });

  const { data: errorDetailOptions } = useQuery<ViolationErrorDetailListResponse, Error, Option[]>({
    queryKey: ['violation-filter-error-detail'],
    queryFn: () => violationReportService.getAllMistake({ limit: 1000, offset: 0 }),
    select: selectErrorDetailOptions,
  });

  return (
    <Card className='p-4'>
      <form onSubmit={handleSubmit(handleSearch)}>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-3'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='keyword'>{t('complaintManagement.search')}</Label>
            <Controller
              name='keyword'
              control={control}
              render={({ field }) => (
                <InputSearch
                  {...field}
                  placeholder={t('violationReportConclude.formSearchPlaceholder')}
                />
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
            <Label htmlFor='branchId'>{t('complaintManagement.branch')}</Label>
            <Controller
              name='branchId'
              control={control}
              render={({ field }) => (
                <Combobox
                  options={branchData ?? []}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue('postOfficeId', []);
                  }}
                  placeholder={t('complaintManagement.placeholderBranch')}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='postOfficeId'>{t('complaintManagement.postOffice')}</Label>
            <Controller
              name='postOfficeId'
              control={control}
              render={({ field }) => (
                <ComboBoxMulti
                  options={postOfficeData ?? []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('complaintManagement.placeholderPostOffice')}
                  disable={!selectedBranchId}
                  checkbox
                  selectAll
                />
              )}
            />
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
            <Label htmlFor='mistakeCode'>{t('violationReportConclude.errorTitle')}</Label>
            <Controller
              name='mistakeCode'
              control={control}
              render={({ field }) => (
                <ComboBoxMulti
                  options={errorDetailOptions ?? []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('options.all')}
                  checkbox
                  selectAll
                />
              )}
            />
          </div>

          <div className='flex items-end gap-2 flex-wrap col-span-2 md:col-span-3 lg:col-span-3'>
            <Button type='submit' variant='default'>
              {t('common.search')}
            </Button>
            <Button type='button' onClick={onCreate} variant='create'>
              {t('violationReportConclude.btnCreateInternal')}
            </Button>
            <ButtonLoading
              type='button'
              onClick={onExport}
              variant='export'
              loading={loadingExport}
              disabled={loadingExport}
            >
              {t('common.exportExcel')}
            </ButtonLoading>
          </div>
        </div>
      </form>
    </Card>
  );
};
