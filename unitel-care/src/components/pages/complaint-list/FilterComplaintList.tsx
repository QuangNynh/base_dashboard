import ButtonLoading from '@/components/common/ButtonLoading';
import { Combobox } from '@/components/common/ComboBoxCustom';
import { InputSearch } from '@/components/common/InputSearch';
import { RangeDatePicker } from '@/components/common/RangeDatePicker';
import MultiSelect from '@/components/common/SelectMuilti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CHANNEL_TYPES_OPTIONS,
  COMPLAINT_TYPE_OPTIONS,
  DEADLINE_STATUS_OPTIONS,
  SEVERITY_TYPES_OPTIONS,
} from '@/constants/options';
import { ROLE_GROUP } from '@/constants/permissions';
import { STATUS_COMPLAINT_OPTIONS } from '@/constants/status';
import { FORMAT_DATE } from '@/constants/utils';
import { useCheckPermissions } from '@/hooks/useCheckPermissions';
import { formatDateTime } from '@/lib/utils';
import {
  ComplaintFilterSchema,
  type ComplaintFilterDataSchema,
} from '@/schemas/complaint-management';
import { complaintService } from '@/services/complaintService';
import type { ComplaintFilterData, FeedbackLevelResponse } from '@/types/complaint-management';
import type { Option } from '@/types/post-office';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { CirclePlusIcon } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  onSubmit: (data: ComplaintFilterData) => void;
  onExport: () => void;
  onCreate: () => void;
  loadingExport?: boolean;
}

export const FilterComplaintList = ({ onSubmit, onExport, onCreate, loadingExport }: Props) => {
  const today = endOfDay(new Date());
  const minDate = startOfDay(subDays(new Date(), 14));
  const { t } = useTranslation();
  const isAdmin = useCheckPermissions([ROLE_GROUP.VAN_HANH]);
  const { control, handleSubmit } = useForm<ComplaintFilterDataSchema>({
    resolver: zodResolver(ComplaintFilterSchema(t)),
    defaultValues: {
      keyword: '',
      complaintType: 'INCOMING',
      status: '',
      creationTime: {
        from: formatDateTime(minDate, FORMAT_DATE.DDMMYYYY),
        to: formatDateTime(today, FORMAT_DATE.DDMMYYYY),
      },

      branchId: '',
      postOfficeId: '',
      receiptChannel: '',
      complaintCategoryId: '',
      priority: [],
      deadlineStatus: '',
      completionDate: {
        from: '',
        to: '',
      },
      complaintCount: '',
    },
  });

  const handleSearch = (data: ComplaintFilterDataSchema) => {
    const { creationTime, completionDate, priority, ...rest } = data;
    onSubmit({
      ...rest,
      priority: priority.length > 0 ? priority.join(',') : '',
      createdDateFrom: creationTime.from || '',
      createdDateTo: creationTime.to || '',
      completedDateFrom: completionDate.from || '',
      completedDateTo: completionDate.to || '',
    });
  };
  const { data: feedbackLevel2Data } = useQuery<FeedbackLevelResponse, Error, Option[]>({
    queryKey: ['feedback-level-2-list'],
    queryFn: () =>
      complaintService.getFeedbackLevel2Data({
        page: 1,
        size: 100,
        is_deleted: false,
      }),
    select: (res) =>
      res.data.page_data.map((item) => ({
        value: item.id.toString(),
        label: item.name,
      })),
  });

  // TODO: Tạm thời ẩn
  // const { data: branchData } = useQuery<BranchResponse, Error, Option[]>({
  //   queryKey: ['branch-list'],
  //   queryFn: () => postOfficeService.getListBranch(),
  //   select: (res) =>
  //     res.data.map((item) => ({
  //       value: item.departmentId,
  //       label: item.name,
  //     })),
  // });

  // const selectedBranchId = watch('branchId');

  // const { data: postOfficeData } = useQuery<PostOfficeResponse, Error, Option[]>({
  //   queryKey: ['post-office-list', selectedBranchId],
  //   queryFn: () => postOfficeService.getListPostOffice(selectedBranchId),
  //   enabled: !!selectedBranchId,
  //   select: (res) =>
  //     res.data.map((item) => ({
  //       value: item.departmentId,
  //       label: item.name,
  //     })),
  // });

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
                <InputSearch {...field} placeholder={t('complaintManagement.placeholderSearch')} />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='creationTime'>{t('complaintManagement.creationTime')}</Label>
            <Controller
              name='creationTime'
              control={control}
              render={({ field }) => (
                <RangeDatePicker
                  onChange={field.onChange}
                  value={field.value}
                  disabled={{ after: today }}
                  placeholder={t('complaintManagement.placeholderCreationTime')}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='ComplaintType'>{t('complaintManagement.complaintType')}</Label>
            <Controller
              name='complaintType'
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ''} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={t('complaintManagement.placeholderComplaintType')} />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPLAINT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='status'>{t('complaintManagement.status')}</Label>
            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={t('complaintManagement.placeholderStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_COMPLAINT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {/* TODO: Tạm thời ẩn */}
          {/* <div className='flex flex-col gap-2'>
            <Label htmlFor='branchId'>{t('complaintManagement.branch')}</Label>
            <Controller
              name='branchId'
              control={control}
              render={({ field }) => (
                <Combobox
                  options={branchData || []}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    setValue('postOfficeId', '');
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
                <Combobox
                  options={postOfficeData || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('complaintManagement.placeholderPostOffice')}
                  disable={!selectedBranchId}
                />
              )}
            />
          </div> */}

          <div className='flex flex-col gap-2'>
            <Label htmlFor='receiptChannel'>{t('complaintManagement.channel')}</Label>
            <Controller
              name='receiptChannel'
              control={control}
              render={({ field }) => (
                <Select value={field.value ?? ''} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={t('complaintManagement.placeholderChannel')} />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNEL_TYPES_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='complaintCategoryId'>{t('complaintManagement.secondCategory')}</Label>
            <Controller
              name='complaintCategoryId'
              control={control}
              render={({ field }) => (
                <Combobox
                  options={feedbackLevel2Data || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('complaintManagement.placeholderSecondCategory')}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='priority'>{t('complaintManagement.severity')}</Label>
            <Controller
              name='priority'
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={SEVERITY_TYPES_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('complaintManagement.placeholderSeverity')}
                  in18n={true}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='deadlineStatus'>{t('complaintManagement.level')}</Label>
            <Controller
              name='deadlineStatus'
              control={control}
              render={({ field }) => (
                <Combobox
                  options={DEADLINE_STATUS_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('complaintManagement.placeholderLevel')}
                  i18n={true}
                />
              )}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='complaintCount'>{t('complaintManagement.complaintNumber')}</Label>
            <Controller
              name='complaintCount'
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type='text'
                  onlyNumber
                  onlyInteger
                  min={0}
                  placeholder={t('complaintManagement.placeholderComplaintNumber')}
                />
              )}
            />
          </div>

          {!isAdmin && (
            <div className='flex flex-col gap-2'>
              <Label htmlFor='completionDate'>{t('complaintManagement.completionDate')}</Label>
              <Controller
                name='completionDate'
                control={control}
                render={({ field }) => (
                  <RangeDatePicker
                    onChange={field.onChange}
                    value={field.value}
                    disabled={{ after: today }}
                    placeholder={t('complaintManagement.placeholderCompletionDate')}
                  />
                )}
              />
            </div>
          )}

          <div className='flex items-end gap-2 flex-wrap col-span-2 md:col-span-3 lg:col-span-3'>
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
            <Button type='button' onClick={onCreate} variant='create'>
              <CirclePlusIcon className='w-4! h-4!' />
              {t('complaintManagement.createComplaint')}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};
