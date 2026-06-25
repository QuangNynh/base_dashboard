import ButtonLoading from '@/components/common/ButtonLoading';
import { Combobox } from '@/components/common/ComboBoxCustom';
import { Button } from '@/components/ui/button';
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
import { getCurrency } from '@/lib/utils';
import type { ViolationErrorDetailData } from '@/types/violation-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const positiveNumberString = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z
    .string()
    .trim()
    .min(1, t('validation.required'))
    .max(10, t('validation.maxLength', { max: 10 }))
    .refine((v) => !Number.isNaN(Number(v)), { message: t('validation.number') })
    .refine((v) => Number(v) >= 0, { message: t('violationReport.errorDetail.greaterThanZero') })
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), {
      message: t('validation.maxDecimal', { max: 2 }),
    });

const buildSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z.object({
    errorGroup: z.string().min(1, t('validation.required')),
    errorTypeName: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .max(100, t('validation.maxLength', { max: 100 })),
    errorTypeCode: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .max(10, t('validation.maxLength', { max: 10 }))
      .regex(/^[0-9]+$/u, t('validation.onlyDigits')),
    wrongMinuteConfirmHour: positiveNumberString(t),
    conclusionHour: positiveNumberString(t),
    personalPenaltyPoint: positiveNumberString(t),
    personalRewardPoint: positiveNumberString(t),
    compensationUnitUsd: positiveNumberString(t),
    unitPenaltyPoint: positiveNumberString(t),
    postOfficeCompensationPoint: positiveNumberString(t),
    autoCompleteWhenImport: z.boolean(),
    createOnlyOneRecord: z.boolean(),
    compensation: z.boolean(),
  });

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

interface ErrorGroupOption {
  value: string;
  label: string;
}

interface ErrorDetailFormProps {
  defaultValues?: Partial<FormValues>;
  isEdit?: boolean;
  errorGroupOptions: ErrorGroupOption[];
  loading?: boolean;
  onSubmit: (data: ViolationErrorDetailData) => void | Promise<void>;
  onClear: () => void;
}

const initialValues: FormValues = {
  errorGroup: '',
  errorTypeName: '',
  errorTypeCode: '',
  wrongMinuteConfirmHour: '',
  conclusionHour: '',
  personalPenaltyPoint: '',
  personalRewardPoint: '',
  compensationUnitUsd: '',
  unitPenaltyPoint: '',
  postOfficeCompensationPoint: '',
  autoCompleteWhenImport: false,
  createOnlyOneRecord: false,
  compensation: false,
};

const ErrorDetailForm = ({
  defaultValues,
  isEdit = false,
  errorGroupOptions,
  loading = false,
  onSubmit,
  onClear,
}: ErrorDetailFormProps) => {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(buildSchema(t)),
    defaultValues: {
      ...initialValues,
    },
    values: {
      ...initialValues,
      ...defaultValues,
    },
  });

  const handleSubmit = async (data: FormValues) => {
    await onSubmit({
      mistakeGroupId: Number(data?.errorGroup),
      mistakeCode: data?.errorTypeCode,
      mistakeDescription: data?.errorTypeName,
      processExpiredTime: Number(data?.wrongMinuteConfirmHour),
      concludeExpiredTime: Number(data?.conclusionHour),
      isAutoClose: data?.autoCompleteWhenImport,
      isUnique: data?.createOnlyOneRecord,
      isCompensatory: data?.compensation,
      individualPenaltyScore: Number(data?.personalPenaltyPoint),
      moneyPenalty: Number(data?.compensationUnitUsd),
      individualBonusScore: Number(data?.personalRewardPoint),
      managerPenaltyScore: Number(data?.unitPenaltyPoint),
      agencyPenaltyScore: Number(data?.postOfficeCompensationPoint),
    });

    form.reset({
      ...initialValues,
    });
  };

  const handleClear = () => {
    form.reset({
      ...initialValues,
    });
    onClear();
  };

  return (
    <Card className='p-0'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='mb-4 bg-[#F8F8FA] px-4 py-3 rounded-t-md'>
            <h3 className='text-primary font-semibold'>{t('violationReport.errorDetail.title')}</h3>
          </div>

          <div className='px-4 mt-6 space-y-3'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-4'>
              <div className='lg:col-span-6'>
                <FormField
                  control={form.control}
                  name='errorGroup'
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className='font-medium'>
                        {t('violationReport.errorDetail.errorGroup')}{' '}
                        <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Combobox
                          options={errorGroupOptions}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={t('violationReport.errorDetail.errorGroupPlaceholder')}
                          disable={isEdit}
                          hasError={!!fieldState?.error}
                          placeholderEmpty={t('violationReportConclude.trackingNoMatch')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='lg:col-span-3'>
                <FormField
                  control={form.control}
                  name='errorTypeName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-medium'>
                        {t('violationReport.errorDetail.errorTypeName')}{' '}
                        <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('violationReport.errorDetail.errorTypeNamePlaceholder')}
                          {...field}
                          onBlur={(e) => {
                            const value = e.target.value.trim();
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='lg:col-span-3'>
                <FormField
                  control={form.control}
                  name='errorTypeCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-medium'>
                        {t('violationReport.errorDetail.errorTypeCode')}{' '}
                        <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          onlyNumber
                          disabled={isEdit}
                          placeholder={t('violationReport.errorDetail.errorTypeCodePlaceholder')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3'>
              <FormField
                control={form.control}
                name='wrongMinuteConfirmHour'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>
                      {t('violationReport.errorDetail.wrongMinuteConfirmHour')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t(
                          'violationReport.errorDetail.wrongMinuteConfirmHourPlaceholder'
                        )}
                        onlyNumber
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='conclusionHour'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>
                      {t('violationReport.errorDetail.conclusionHour')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        onlyNumber
                        placeholder={t('violationReport.errorDetail.conclusionHourPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='personalPenaltyPoint'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>
                      {t('violationReport.errorDetail.personalPenaltyPoint')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        onlyNumber
                        placeholder={t(
                          'violationReport.errorDetail.personalPenaltyPointPlaceholder'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='personalRewardPoint'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>
                      {t('violationReport.errorDetail.personalRewardPoint')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        onlyNumber
                        placeholder={t(
                          'violationReport.errorDetail.personalRewardPointPlaceholder'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='compensationUnitUsd'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>
                      {t('violationReport.errorDetail.compensationUnitUsd')} ({getCurrency()}){' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        onlyNumber
                        placeholder={t(
                          'violationReport.errorDetail.compensationUnitUsdPlaceholder'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='unitPenaltyPoint'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>
                      {t('violationReport.errorDetail.unitPenaltyPoint')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        onlyNumber
                        placeholder={t('violationReport.errorDetail.unitPenaltyPointPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='postOfficeCompensationPoint'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>
                      {t('violationReport.errorDetail.postOfficeCompensationPoint')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        onlyNumber
                        placeholder={t(
                          'violationReport.errorDetail.postOfficeCompensationPointPlaceholder'
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex flex-wrap items-center gap-6'>
                <FormField
                  control={form.control}
                  name='autoCompleteWhenImport'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center gap-2 space-y-0'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                          className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                        />
                      </FormControl>
                      <FormLabel className='font-normal pb-0'>
                        {t('violationReport.errorDetail.autoCompleteWhenImport')}
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='createOnlyOneRecord'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center gap-2 space-y-0'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                          className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                        />
                      </FormControl>
                      <FormLabel className='font-normal pb-0'>
                        {t('violationReport.errorDetail.createOnlyOneRecord')}
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='compensation'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center gap-2 space-y-0'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                          className='data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                        />
                      </FormControl>
                      <FormLabel className='font-normal pb-0'>
                        {t('violationReport.errorDetail.compensation')}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className='lg:col-span-2 flex items-center gap-2 lg:justify-end mt-6 px-4 pb-6'>
            {isEdit && (
              <Button
                type='button'
                variant='outline'
                onClick={handleClear}
                className='border-primary text-primary hover:text-primary'
              >
                {t('violationReport.errorGroup.clearData')}
              </Button>
            )}
            <ButtonLoading
              loading={loading}
              type='submit'
              className='bg-primary hover:bg-primary/90 text-white'
            >
              {t('violationReport.errorGroup.save')}
            </ButtonLoading>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default ErrorDetailForm;
