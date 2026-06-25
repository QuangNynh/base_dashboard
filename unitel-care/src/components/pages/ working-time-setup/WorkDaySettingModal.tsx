import ButtonLoading from '@/components/common/ButtonLoading';
import { DialogCustom } from '@/components/common/DialogCustom';
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
import { workDaySettingSchema, type WorkDayFormValues } from '@/schemas/workDaySettingSchema';
import { workingDayService, type WorkingDayCalendarItem } from '@/services/workingDayService';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format, type Locale } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import i18n from '@/i18n';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

function toHHmm(hhmmss?: string): string {
  return hhmmss ? hhmmss.slice(0, 5) : '';
}

function toHHmmss(hhmm: string): string {
  return hhmm ? `${hhmm}:00` : '';
}

interface WorkDaySettingModalProps {
  open: boolean;
  date: Date | null;
  initialData?: WorkingDayCalendarItem;
  onClose: () => void;
  onSaved: () => void;
}

export default function WorkDaySettingModal({
  open,
  date,
  initialData,
  onClose,
  onSaved,
}: WorkDaySettingModalProps) {
  const { t } = useTranslation();
  const localeMap: Record<string, Locale> = { vi, en: enUS };
  const dateLocale = localeMap[i18n.language] ?? enUS;
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WorkDayFormValues>({
    resolver: zodResolver(workDaySettingSchema(t)),
    defaultValues: {
      startTime: '',
      endTime: '',
      complaintMilestone: '',
      kpiMilestone: '',
      isDayOff: false,
    },
  });

  const isDayOff = form.watch('isDayOff');

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      form.reset({
        startTime: toHHmm(initialData.start_time),
        endTime: toHHmm(initialData.end_time),
        complaintMilestone: toHHmm(initialData.daily_cutoff_time),
        kpiMilestone: initialData.kpi_exclusion_threshold ?? '',
        isDayOff: initialData.is_day_off,
      });
    } else {
      form.reset({
        startTime: '',
        endTime: '',
        complaintMilestone: '',
        kpiMilestone: '',
        isDayOff: false,
      });
    }
  }, [open, initialData, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: WorkDayFormValues) => {
    if (!date) return;
    setIsLoading(true);
    try {
      await workingDayService.updateDay({
        date: format(date, 'yyyy-MM-dd'),
        is_day_off: values.isDayOff,
        ...(values.isDayOff
          ? {}
          : {
              start_time: toHHmmss(values.startTime),
              end_time: toHHmmss(values.endTime),
              ...(values.complaintMilestone && {
                daily_cutoff_time: toHHmmss(values.complaintMilestone),
              }),
              ...(values.kpiMilestone && {
                kpi_exclusion_threshold: values.kpiMilestone,
              }),
            }),
      });
      await queryClient.invalidateQueries({ queryKey: ['working-day-calendar'] });
      toast.success('Cập nhật thành công');
      onSaved();
      handleClose();
    } catch (error) {
      handleApiError(error, form, 'Cập nhật thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const dateLabel = date
    ? format(date, t('workingTimeSetup.dateFormat'), { locale: dateLocale })
    : '';

  return (
    <DialogCustom
      open={open}
      onclose={handleClose}
      title={t('workingTimeSetup.settingModalTitle')}
      className='!max-w-md h-fit'
    >
      <div className='py-2'>
        <p className='text-primary font-semibold text-base mb-4'>{dateLabel}</p>

        <Form {...form}>
          <form className='flex flex-col gap-3' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='startTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium' style={{ color: '#44494D' }}>
                    {t('workingTimeSetup.startTime')}
                    {!isDayOff && <span className='text-red-500'>*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input type='time' disabled={isDayOff} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='endTime'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium' style={{ color: '#44494D' }}>
                    {t('workingTimeSetup.endTime')}
                    {!isDayOff && <span className='text-red-500'>*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input type='time' disabled={isDayOff} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='complaintMilestone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium' style={{ color: '#44494D' }}>
                    {t('workingTimeSetup.complaintMilestone')}
                  </FormLabel>
                  <FormControl>
                    <Input type='time' disabled={isDayOff} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='kpiMilestone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-medium' style={{ color: '#44494D' }}>
                    {t('workingTimeSetup.kpiMilestone')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={0}
                      placeholder={t('workingTimeSetup.placeholderKpi')}
                      disabled={isDayOff}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isDayOff'
              render={({ field }) => (
                <div className='flex flex-row items-center gap-2'>
                  <Checkbox id='isDayOff' checked={field.value} onCheckedChange={field.onChange} />
                  <label
                    htmlFor='isDayOff'
                    className='text-sm font-normal cursor-pointer leading-none'
                  >
                    {t('workingTimeSetup.dayOff')}
                  </label>
                </div>
              )}
            />

            <div className='grid grid-cols-2 gap-4 pt-2'>
              <ButtonLoading
                type='button'
                variant='outline'
                onClick={handleClose}
                style={{ color: '#FF5100', borderColor: 'rgba(255, 81, 0, 0.4)' }}
              >
                {t('common.cancel')}
              </ButtonLoading>
              <ButtonLoading type='submit' loading={isLoading}>
                {t('common.confirm')}
              </ButtonLoading>
            </div>
          </form>
        </Form>
      </div>
    </DialogCustom>
  );
}
