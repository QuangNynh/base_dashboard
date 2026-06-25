import ButtonLoading from '@/components/common/ButtonLoading';
import { RangeDatePicker } from '@/components/common/RangeDatePicker';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { handleApiError } from '@/lib/utils';
import { workingDayService } from '@/services/workingDayService';
import { workingTimeSchema, type WorkingTimeFormData } from '@/schemas/workingTimeSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format, parse } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

// 0=CN, 1=T2, 2=T3, 3=T4, 4=T5, 5=T6, 6=T7
const DAY_OPTIONS = [
  { value: 'mon', apiValue: 1, labelKey: 'workingTimeSetup.monday' },
  { value: 'tue', apiValue: 2, labelKey: 'workingTimeSetup.tuesday' },
  { value: 'wed', apiValue: 3, labelKey: 'workingTimeSetup.wednesday' },
  { value: 'thu', apiValue: 4, labelKey: 'workingTimeSetup.thursday' },
  { value: 'fri', apiValue: 5, labelKey: 'workingTimeSetup.friday' },
  { value: 'sat', apiValue: 6, labelKey: 'workingTimeSetup.saturday' },
  { value: 'sun', apiValue: 0, labelKey: 'workingTimeSetup.sunday' },
];

const DAY_API_MAP: Record<string, number> = Object.fromEntries(
  DAY_OPTIONS.map((d) => [d.value, d.apiValue])
);

function toApiTime(hhmm: string): string {
  return hhmm ? `${hhmm}:00` : '';
}

function toApiDate(ddmmyyyy: string): string {
  if (!ddmmyyyy) return '';
  return format(parse(ddmmyyyy, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd');
}

export default function FormWorkingTimeSetup() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const schema = workingTimeSchema(t);

  const form = useForm<WorkingTimeFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      startTime: '',
      endTime: '',
      complaintMilestone: '',
      kpiMilestone: '',
      applyDays: [],
      applyDateRange: { from: '', to: '' },
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: WorkingTimeFormData) => {
    setIsLoading(true);
    try {
      await workingDayService.bulkCreate({
        start_time: toApiTime(data.startTime),
        end_time: toApiTime(data.endTime),
        ...(data.complaintMilestone && {
          daily_cutoff_time: toApiTime(data.complaintMilestone),
        }),
        days_of_week: data.applyDays.map((d) => DAY_API_MAP[d]),
        apply_from: toApiDate(data.applyDateRange.from),
        apply_to: toApiDate(data.applyDateRange.to),
        ...(data.kpiMilestone && { kpi_exclusion_threshold: data.kpiMilestone }),
      });
      await queryClient.invalidateQueries({ queryKey: ['working-day-calendar'] });
      toast.success(t('common.createSuccess'));
      form.reset();
    } catch (error) {
      handleApiError(error, form, t('common.createError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className='p-4 sm:p-6'>
          <h3 className='font-semibold text-primary text-base sm:text-lg'>
            {t('workingTimeSetup.title')}
          </h3>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4'>
            {/* Giờ bắt đầu */}
            <FormField
              control={control}
              name='startTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('workingTimeSetup.startTime')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Giờ kết thúc */}
            <FormField
              control={control}
              name='endTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('workingTimeSetup.endTime')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mốc giờ tính khiếu nại */}
            <FormField
              control={control}
              name='complaintMilestone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('workingTimeSetup.complaintMilestone')}</FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ngày áp dụng */}
            <FormField
              control={control}
              name='applyDays'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('workingTimeSetup.applyDays')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <div className='flex flex-wrap gap-x-4 gap-y-2 pt-1'>
                    {DAY_OPTIONS.map((day) => (
                      <div key={day.value} className='flex items-center gap-1.5'>
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={field.value.includes(day.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, day.value]);
                            } else {
                              field.onChange(field.value.filter((v) => v !== day.value));
                            }
                          }}
                        />
                        <label
                          htmlFor={`day-${day.value}`}
                          className='text-sm cursor-pointer select-none'
                        >
                          {t(day.labelKey)}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Khoảng thời gian áp dụng */}
            <FormField
              control={control}
              name='applyDateRange'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('workingTimeSetup.applyDateRange')}
                    <span className='text-red-500'>*</span>
                  </FormLabel>
                  <FormControl>
                    <RangeDatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t('workingTimeSetup.placeholderDateRange')}
                      disabled={{ before: new Date() }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mốc KPI */}
            <FormField
              control={control}
              name='kpiMilestone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('workingTimeSetup.kpiMilestone')}</FormLabel>
                  <FormControl>
                    <Input type='time' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex justify-end pt-2'>
            <ButtonLoading type='submit' loading={isLoading}>
              {t('workingTimeSetup.apply')}
            </ButtonLoading>
          </div>
        </Card>
      </form>
    </Form>
  );
}
