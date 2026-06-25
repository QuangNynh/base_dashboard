import ButtonLoading from '@/components/common/ButtonLoading';
import type { UploadedFile } from '@/components/common/Upload';
import { Form } from '@/components/ui/form';
import { getAddressByLevel, handleApiError } from '@/lib/utils';
import { ROUTES } from '@/router/routes.config';
import {
  createComplaintSchema,
  editComplaintSchema,
  getDefaultValues,
  getEditDefaultValues,
  type CreateComplaintData,
} from '@/schemas/complaint-management';
import { complaintService } from '@/services/complaintService';
import type { ComplaintDetail } from '@/types/complaint-management';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactInfoForm from './ContactInfoForm';
import ContentForm from './ContentForm';
import GeneralInfoForm from './GeneralInfoForm';

const CreateComplaintForm = ({
  contactType,
  data,
  id,
}: {
  contactType: 'SENDER' | 'RECEIVER';
  data?: ComplaintDetail;
  id?: string;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const form = useForm<CreateComplaintData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver((data ? editComplaintSchema(t) : createComplaintSchema(t)) as any),
    defaultValues: data
      ? (getEditDefaultValues(contactType) as unknown as CreateComplaintData)
      : getDefaultValues(contactType),
  });

  useEffect(() => {
    if (data) {
      form.reset({
        contactType: data?.contact_type,
        orderCode: data?.order_code,
        receiptChannel: data?.receipt_channel,
        complaintCategoryId: data?.complaint_category_id?.toString(),
        priority: data?.priority,
        errorDescription: data?.error_description,
        content: data?.content,
        customerProvinceName: getAddressByLevel(data?.address, 1)?.name || '',
        customerDistrictName: getAddressByLevel(data?.address, 2)?.name || '',
        processingPostId: data?.processing_post_id,

        requestPhoneNumber: data?.request_phone_number,
        contactPhoneNumber: data?.contact_phone_number,
        contactName: data?.contact_name,
        tgttEvaluation: data?.tgtt_evaluation,
        originPostOfficeName: data?.origin_post_office_name,
        deliveryPostOfficeName: data?.delivery_post_office_name,
        processingPostcode: data?.processing_postcode,
        originBranchName: data?.current_branch_name,
        deliveryBranchName: data?.delivery_branch_name,
        processingBranchName: data?.processing_branch_name,
        files: data?.customerAttachedFiles ? JSON.parse(data?.customerAttachedFiles) : [],
      });
    }
  }, [data, form]);

  const isEdit = !!id;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (formData: CreateComplaintData) => {
      const dataFormat = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (key === 'address') {
          dataFormat.append(key, JSON.stringify(value));
          return;
        }
        if (key === 'files' && Array.isArray(value)) {
          const customerFiles: UploadedFile[] = [];

          value.forEach((file) => {
            if (file instanceof File) {
              dataFormat.append('files', file);
            } else {
              customerFiles.push(file);
            }
          });

          // chỉ append 1 lần
          if (customerFiles.length > 0) {
            dataFormat.append('customerAttachedFiles', JSON.stringify(customerFiles));
          }

          return;
        }

        dataFormat.append(key, String(value));
      });

      if (isEdit) {
        return complaintService.updateComplaint(id, dataFormat);
      }

      return complaintService.createComplaint(dataFormat);
    },

    onSuccess: () => {
      toast.success(t(isEdit ? 'common.updateSuccess' : 'common.createSuccess'));

      queryClient.invalidateQueries({ queryKey: ['list-complaint'] });

      if (isEdit) {
        queryClient.invalidateQueries({
          queryKey: ['detail-complaint', id],
        });
      }

      navigate(ROUTES.COMPLAINT_MANAGEMENT_LIST);
    },

    onError: (error) => {
      handleApiError(error, form, t(isEdit ? 'common.updateError' : 'common.createError'));
    },
  });
  const onSubmit = (formData: CreateComplaintData) => {
    mutateAsync(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4 mt-2'
        style={{
          pointerEvents: isPending ? 'none' : 'auto',
          opacity: isPending ? 0.7 : 1,
        }}
      >
        <GeneralInfoForm orderCode={data?.order_code} />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <ContactInfoForm />
          <ContentForm />
        </div>

        <div className='flex justify-end p-4'>
          <ButtonLoading type='submit' disabled={isPending} loading={isPending}>
            {t('createComplaint.confirm')}
          </ButtonLoading>
        </div>
      </form>
    </Form>
  );
};

export default CreateComplaintForm;
