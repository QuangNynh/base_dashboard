import ButtonLoading from '@/components/common/ButtonLoading';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const buildSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z.object({
    errorGroupCode: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .max(20, t('validation.maxLength', { max: 20 }))
      .regex(/^[A-Za-z0-9\p{P}\p{S}]+$/u, t('validation.noSpace')),
    errorGroupName: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .max(100, t('validation.maxLength', { max: 100 })),
  });

type FormValues = {
  errorGroupCode: string;
  errorGroupName: string;
};

interface ErrorGroupFormProps {
  defaultValues?: Partial<FormValues>;
  isEdit?: boolean;
  loading?: boolean;
  onSubmit: (data: { code: string; name: string }) => void | Promise<void>;
}

const initialValues: FormValues = {
  errorGroupCode: '',
  errorGroupName: '',
};

const ErrorGroupForm = ({
  defaultValues,
  isEdit = false,
  loading = false,
  onSubmit,
}: ErrorGroupFormProps) => {
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(buildSchema(t)),
    defaultValues: {
      ...initialValues,
      ...defaultValues,
    },
  });

  useEffect(() => {
    form.reset({
      ...initialValues,
      ...defaultValues,
    });
  }, [defaultValues, form]);

  const handleSubmit = async (data: FormValues) => {
    await onSubmit({
      code: data.errorGroupCode.trim(),
      name: data.errorGroupName.trim(),
    });

    form.reset({
      ...initialValues,
      ...defaultValues,
    }); // chỉ chạy khi create thành công
  };

  return (
    <Card className='p-0'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='mb-4 bg-[#F8F8FA] px-4 py-3 rounded-t-md'>
            <h3 className='text-primary font-semibold'>{t('violationReport.errorGroup.title')}</h3>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 items-start px-4 mt-6'>
            <div className='lg:col-span-6'>
              <FormField
                control={form.control}
                name='errorGroupCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>
                      {t('violationReport.errorGroup.errorGroupCode')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('violationReport.errorGroup.errorGroupCodePlaceholder')}
                        disabled={isEdit}
                        {...field}
                        onBlur={(e) => {
                          const value = e.target.value.trim().toUpperCase();
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='lg:col-span-6'>
              <FormField
                control={form.control}
                name='errorGroupName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-medium'>
                      {t('violationReport.errorGroup.errorGroupName')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('violationReport.errorGroup.errorGroupNamePlaceholder')}
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
          </div>
          <div className='lg:col-span-2 flex lg:justify-end mt-6 px-4 pb-6'>
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

export default ErrorGroupForm;
