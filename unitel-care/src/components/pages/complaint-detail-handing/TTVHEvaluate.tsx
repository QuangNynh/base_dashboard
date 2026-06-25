import AppButton from '@/components/common/AppButton';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROLE_GROUP } from '@/constants/permissions';
import {
  CATEGORY_EVALUATION,
  CATEGORY_EVALUATION_LABEL_KEY,
  EXTENSION_EVALUATION,
  EXTENSION_EVALUATION_LABEL_KEY,
  PROCESSING_QUALITY,
  PROCESSING_QUALITY_LABEL_KEY,
  RECEPTION_QUALITY,
  RECEPTION_QUALITY_LABEL_KEY,
} from '@/constants/ttvh-evaluation';
import { useCheckPermissions } from '@/hooks/useCheckPermissions';
import { buildSchemaTTVHEvaluate, type TTVHEvaluateForm } from '@/schemas/complaint-management';
import { complaintService } from '@/services/complaintService';
import { postOfficeService } from '@/services/postOfficeService';
import type { ComplaintDetail } from '@/types/complaint-management';
import type { PostOfficeSlow, PostOfficeSlowResponse } from '@/types/post-office';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, type FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface Props {
  data?: ComplaintDetail;
  status?: string;
}

export const TTVHEvaluate: FC<Props> = ({ data }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = useCheckPermissions([ROLE_GROUP.VAN_HANH]);

  // Bước 2: deadline < now → KN đã quá hạn → hiển thị field "Đơn vị xử lý chậm muộn"
  const deadline = data?.deadline;
  const isOverDeadline = useMemo(() => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  }, [deadline]);

  const refreshDetail = () => {
    queryClient.invalidateQueries({ queryKey: ['detail-complaint', id] });
  };

  const form = useForm<TTVHEvaluateForm>({
    resolver: zodResolver(buildSchemaTTVHEvaluate(t)),
    defaultValues: {
      processingQuality: '',
      categoryEvaluation: '',
      extensionEvaluation: '',
      receptionQuality: '',
      slowUnitId: '',
    },
  });

  // Bước 3: chỉ gọi API processing-units khi KN đã quá hạn
  const { data: postOfficeAllData } = useQuery<PostOfficeSlowResponse, Error, PostOfficeSlow[]>({
    queryKey: ['post-office-all-list-slow', id],
    queryFn: () => postOfficeService.getListUnitSlow(id!),
    select: (res) => res.data,
    enabled: !!id && isOverDeadline,
  });

  useEffect(() => {
    if (!data) return;

    let defaultSlowUnitId = data?.ttvh_evaluation?.slow_unit_id || '';

    // Auto-fill chỉ khi chưa có giá trị từ server và KN đã quá hạn
    if (!defaultSlowUnitId && isOverDeadline && postOfficeAllData) {
      if (postOfficeAllData.length === 1) {
        // Chỉ 1 unit → auto-fill luôn (is_slowest mặc nhiên true)
        defaultSlowUnitId = postOfficeAllData[0].id?.toString() ?? '';
      } else if (postOfficeAllData.length > 1) {
        // Nhiều unit → auto-fill unit có is_slowest = true
        defaultSlowUnitId = postOfficeAllData.find((item) => item.is_slowest)?.id?.toString() ?? '';
      }
      // Rỗng → giữ '' → field bị disable (isSlowUnitDisabled)
    }

    form.reset({
      processingQuality: data?.ttvh_evaluation?.processing_quality,
      categoryEvaluation: data?.ttvh_evaluation?.category_evaluation,
      extensionEvaluation: data?.ttvh_evaluation?.extension_evaluation,
      receptionQuality: data?.ttvh_evaluation?.reception_quality,
      slowUnitId: defaultSlowUnitId,
    });
  }, [data, form, postOfficeAllData, isOverDeadline]);

  const postOfficeOptions = useMemo(
    () =>
      postOfficeAllData?.map((item) => ({
        value: item?.id?.toString(),
        label:
          item?.postcode && item?.name
            ? `${item?.postcode} - ${item?.name}`
            : item?.postcode || item?.name,
      })) ?? [],
    [postOfficeAllData]
  );

  // Danh sách rỗng → disable select (không có dữ liệu để auto-fill)
  const isSlowUnitDisabled = isOverDeadline && postOfficeAllData?.length === 0;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (formData: TTVHEvaluateForm) =>
      complaintService.createTtvhEvaluation(id!, {
        complaintId: Number(id),
        processingQuality: formData.processingQuality,
        categoryEvaluation: formData.categoryEvaluation,
        extensionEvaluation: formData.extensionEvaluation,
        receptionQuality: formData.receptionQuality,
        slowUnitId: formData.slowUnitId || undefined,
      }),
    onSuccess: () => {
      toast.success(t('common.updateSuccess'));
      refreshDetail();
      navigate('/complaint-management/list');
    },
    onError: () => {
      toast.error(t('common.updateError'));
    },
  });

  const handleSubmit = form.handleSubmit((data) => mutateAsync(data));

  const processingQualityOptions = Object.values(PROCESSING_QUALITY).map((v) => ({
    value: v,
    label: t(PROCESSING_QUALITY_LABEL_KEY[v]),
  }));

  const categoryEvaluationOptions = Object.values(CATEGORY_EVALUATION).map((v) => ({
    value: v,
    label: t(CATEGORY_EVALUATION_LABEL_KEY[v]),
  }));

  const extensionEvaluationOptions = Object.values(EXTENSION_EVALUATION).map((v) => ({
    value: v,
    label: t(EXTENSION_EVALUATION_LABEL_KEY[v]),
  }));

  const receptionQualityOptions = Object.values(RECEPTION_QUALITY).map((v) => ({
    value: v,
    label: t(RECEPTION_QUALITY_LABEL_KEY[v]),
  }));

  if (!isAdmin) return null;

  return (
    <div>
      <h4 className='font-semibold text-primary mb-2'>{t('TTVHEvaluate.title')}</h4>
      <Card className='p-4'>
        <Form {...form}>
          <div className='flex flex-col gap-x-4 gap-y-1'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1'>
              <FormField
                control={form.control}
                name='processingQuality'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('TTVHEvaluate.processingQuality')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t('TTVHEvaluate.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {processingQualityOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='categoryEvaluation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('TTVHEvaluate.complaintCategory')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t('TTVHEvaluate.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryEvaluationOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='extensionEvaluation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('TTVHEvaluate.extensionRating')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t('TTVHEvaluate.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {extensionEvaluationOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='receptionQuality'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('TTVHEvaluate.receptionQuality')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t('TTVHEvaluate.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {receptionQualityOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Chỉ hiển thị khi KN đã quá hạn (deadline < now) */}
            {isOverDeadline && (
              <FormField
                control={form.control}
                name='slowUnitId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('TTVHEvaluate.lateUnit')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSlowUnitDisabled}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={t('TTVHEvaluate.lateUnitPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {postOfficeOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className='flex justify-end'>
              <AppButton outline disabled={isPending} onClick={handleSubmit}>
                {t('common.update')}
              </AppButton>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};
