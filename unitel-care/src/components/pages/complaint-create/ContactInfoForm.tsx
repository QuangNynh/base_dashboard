import { Combobox } from '@/components/common/ComboBoxCustom';
import Upload from '@/components/common/Upload';
import { Card } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { SEVERITY_TYPES_OPTIONS } from '@/constants/options';
import type { CreateComplaintData } from '@/schemas/complaint-management';
import { complaintService } from '@/services/complaintService';
import type { FeedbackLevel, FeedbackLevelResponse } from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const PROCESSING_OFFICE_FIELD_MAP: Record<
  string,
  { postcode: string; postOfficeName: string; id: string }
> = {
  ORIGIN: {
    postcode: 'originPostcode',
    postOfficeName: 'originPostOfficeName',
    id: 'originPostId',
  },
  DELIVERY: {
    postcode: 'deliveryPostcode',
    postOfficeName: 'deliveryPostOfficeName',
    id: 'deliveryPostId',
  },
  CURRENT: {
    postcode: 'currentPostcode',
    postOfficeName: 'currentPostOfficeName',
    id: 'currentPostId',
  },
};

const ContactInfoForm = () => {
  const { t } = useTranslation();
  const { control, setValue, getValues } = useFormContext<CreateComplaintData>();

  const { data: feedbackLevel2Data } = useQuery<FeedbackLevelResponse, Error, FeedbackLevel[]>({
    queryKey: ['feedback-level-2-list'],
    queryFn: () =>
      complaintService.getFeedbackLevel2Data({
        page: 1,
        size: 100,
        is_deleted: false,
      }),
    select: (res) => res.data.page_data,
  });

  const feedbackLevel2Options = useMemo(
    () =>
      feedbackLevel2Data?.map((item) => ({
        value: item.id.toString(),
        label: item.name,
      })) ?? [],
    [feedbackLevel2Data]
  );

  const handleCategoryChange = (value: string | null) => {
    const category = feedbackLevel2Data?.find((item) => item.id.toString() === value);

    if (category?.processing_office) {
      const mapping = PROCESSING_OFFICE_FIELD_MAP[category.processing_office];

      if (mapping) {
        const formValues = getValues() as unknown as Record<string, string>;
        setValue('processingPostcode', formValues[mapping.postcode] ?? '', {
          shouldValidate: true,
        });
        setValue('processingPostName', formValues[mapping.postOfficeName] ?? '', {
          shouldValidate: true,
        });
        setValue('processingPostId', formValues[mapping.id] ?? '', {
          shouldValidate: true,
        });
      }
    }
  };

  return (
    <div>
      <h3 className='font-semibold text-primary text-base mb-2'>
        {t('createComplaint.contentInfo')}
      </h3>
      <Card className='p-4 flex flex-col gap-1'>
        <FormField
          control={control}
          name='priority'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('createComplaint.level')}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <Combobox
                  placeholder={t('createComplaint.placeholderLevel')}
                  options={SEVERITY_TYPES_OPTIONS}
                  value={field.value ?? null}
                  onChange={field.onChange}
                  i18n
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={control}
          name='errorDescription'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createComplaint.errorOccurred')}</FormLabel>
              <FormControl>
                <Input placeholder={t('createComplaint.placeholderErrorOccurred')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={control}
          name='complaintCategoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t('createComplaint.feedbackCategory')}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <Combobox
                  placeholder={t('createComplaint.placeholderFeedbackCategory')}
                  disable={!getValues('orderCode')}
                  options={feedbackLevel2Options}
                  value={field.value ?? null}
                  onChange={(value) => {
                    field.onChange(value);
                    handleCategoryChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={control}
          name='tgttEvaluation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('createComplaint.evaluationTGTT')}</FormLabel>
              <FormControl>
                <Input placeholder={t('createComplaint.placeholderEvaluationTGTT')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={control}
          name='content'
          render={({ field }) => (
            <FormItem className='col-span-2'>
              <FormLabel className='font-semibold'>
                {t('createComplaint.content')}
                <span className='text-red-500'>*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className='h-20 scrollbar-custom'
                  rows={3}
                  placeholder={t('createComplaint.placeholderContent')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='files'
          render={({ field }) => (
            <FormItem className='col-span-2'>
              <FormControl>
                <Upload
                  value={field.value}
                  onChange={field.onChange}
                  multiple
                  maxFiles={3}
                  maxSize={2 * 1024 * 1024}
                  accept='.mp3,.mp4,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.avi,.pdf'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Card>
    </div>
  );
};

export default ContactInfoForm;
