import { DialogCustom } from '@/components/common/DialogCustom';
import Upload from '@/components/common/Upload';
import type { UploadedFile } from '@/components/common/Upload';
import { Combobox } from '@/components/common/ComboBoxCustom';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { postOfficeService } from '@/services/postOfficeService';
import { violationReportService } from '@/services/violationReport';
import type { DataViolatedOffice } from '@/types/violation-report';
import { ComboBoxMulti } from '@/components/common/ComboBoxMuilti';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

type UploadItem = File | UploadedFile;

const CONFIRM_OPTIONS = [
  { label: 'ttvhEvaluation.categoryEvaluation.correct', value: 'YES' },
  { label: 'ttvhEvaluation.categoryEvaluation.incorrect', value: 'NO' },
];

export interface ViolationUnitEditItem {
  id: number;
  postOfficeId: string;
  content: string;
  individualId: string;
  compensationRate?: string;
  files?: File[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  editItem?: DataViolatedOffice;
  onCreate: (data: DataViolatedOffice) => void;
  onEdit: (data: DataViolatedOffice) => void;
  dataViolatingOffice: DataViolatedOffice[];
}

const DialogCreateViolationPostOffice = ({
  open,
  onClose,
  editItem,
  onCreate,
  onEdit,
  dataViolatingOffice,
}: Props) => {
  const { t } = useTranslation();
  const [filesUpload, setFilesUpload] = useState<UploadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const isEditMode = !!editItem;

  const schema = useMemo(
    () =>
      z.object({
        postOffice: z.string().min(1, t('violationReportConclude.validationUnit')),
        content: z.string().trim(),
        individual: z.array(z.string()).min(1, t('violationReportConclude.validationViolator')),
        compensationRate: z
          .string()
          .optional()
          .refine(
            (v) => !v || (Number(v) >= 0 && Number(v) <= 100),
            t('violationReportConclude.validationCompensationRate')
          ),
        confirmYesNo: z.string().optional(),
      }),
    [t]
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      postOffice: '',
      content: '',
      individual: [],
      compensationRate: '',
      confirmYesNo: 'YES',
    },
    values: {
      postOffice: editItem ? editItem.violatedOffice.postId + '' : '',
      content: editItem ? editItem.note : '',
      individual: editItem?.violatedUsers.map((u) => String(u.userId)) || [],
      compensationRate:
        editItem && editItem.compensationRatio != null ? editItem.compensationRatio + '' : '',
      confirmYesNo: editItem ? editItem.confirmYesNo : 'YES',
    },
  });

  useEffect(() => {
    if (!open) return;
    if (isEditMode) {
      setFilesUpload(editItem?.files || []);
    }
  }, [open, editItem, isEditMode]);

  const selectedPostOfficeId = useWatch({ control: form.control, name: 'postOffice' });

  const { data: branchData } = useQuery({
    queryKey: ['violation-filter-branch'],
    queryFn: () => postOfficeService.getListPostOfficeByTenant(''),
  });

  const { data: staffOptions = [] } = useQuery({
    queryKey: ['staff-list', selectedPostOfficeId],
    queryFn: () => postOfficeService.getPostManByTenant(selectedPostOfficeId),
    enabled: !!selectedPostOfficeId,
    select: (res) =>
      res.data.map((item) => ({
        value: String(item.userId),
        label: item.fullName,
        code: item?.code,
      })),
  });

  const optionsBranch = useMemo(() => {
    if (!dataViolatingOffice?.length)
      return (
        branchData?.data?.map((i) => ({
          value: i?.departmentId + '',
          label: i?.code + ' - ' + i?.name,
        })) || []
      );

    const selectedBranches = dataViolatingOffice?.map((i) => i?.violatedOffice?.postId + '');
    const otherBranchs = branchData?.data?.filter(
      (i) => !selectedBranches?.includes(i?.departmentId)
    );

    const options =
      otherBranchs?.map((i) => ({
        value: i?.departmentId + '',
        label: i?.code + ' - ' + i?.name,
      })) || [];

    if (editItem?.id) {
      return [
        {
          value: editItem?.violatedOffice?.postId + '',
          label:
            editItem?.violatedOffice?.postCode + ' - ' + editItem?.violatedOffice?.postName + '',
        },
        ...options,
      ];
    }

    return options;
  }, [branchData, dataViolatingOffice, editItem]);

  const handleClose = () => {
    onClose();
  };
  const handleFilesChange = useCallback((files: UploadItem[]) => setFilesUpload(files), []);

  const onSubmit = async (data: FormValues) => {
    type UploadFileItem = { name?: string; type?: string; path?: string };

    const pendingFiles = filesUpload.filter((f): f is File => f instanceof File);
    const alreadyUploaded = filesUpload.filter((f): f is UploadedFile => !(f instanceof File));

    let allFiles: UploadedFile[] = alreadyUploaded;

    if (pendingFiles.length > 0) {
      setIsProcessing(true);
      try {
        const res = (await violationReportService.uploadFile(pendingFiles)) as {
          data: UploadFileItem[];
        };
        const uploaded: UploadedFile[] = (res?.data ?? []).map((f) => ({
          fileName: f?.name ?? '',
          url: f?.path ?? '',
          fileType: f?.type ?? '',
        }));
        // Persist to state so re-submit after API failure reuses uploaded files without re-uploading
        setFilesUpload([...alreadyUploaded, ...uploaded]);
        allFiles = [...alreadyUploaded, ...uploaded];
        setIsProcessing(false);
      } catch {
        toast.error(t('violationReportConclude.uploadFileError'));
        setIsProcessing(false);
        return;
      }
    }

    if (isEditMode) {
      onEdit({
        id: editItem.id,
        files: allFiles,
        compensationRatio:
          data?.compensationRate != null ? Number(data?.compensationRate) : undefined,
        note: data?.content,
        violatedOffice: {
          postId: data?.postOffice,
          postCode: branchData?.data?.find((i) => i?.departmentId == data?.postOffice)?.code || '',
          postName: branchData?.data?.find((i) => i?.departmentId == data?.postOffice)?.name || '',
        },
        violatedUsers:
          staffOptions
            ?.filter((i) => data?.individual?.includes(i?.value))
            ?.map((i) => ({
              userId: Number(i?.value),
              staffCode: i?.code,
              fullName: i?.label,
            })) || [],
        confirmYesNo: data?.confirmYesNo || 'YES',
        branch: {
          postId:
            branchData?.data?.find((i) => i?.departmentId == data?.postOffice)
              ?.parentDepartmentId || '',
          postCode:
            branchData?.data?.find((i) => i?.departmentId == data?.postOffice)
              ?.parentDepartmentCode || '',
          postName:
            branchData?.data?.find((i) => i?.departmentId == data?.postOffice)
              ?.parentDepartmentName || '',
        },
      });
    } else {
      onCreate({
        id: uuidv4(),
        files: allFiles,
        compensationRatio:
          data?.compensationRate != null ? Number(data?.compensationRate) : undefined,
        note: data?.content,
        violatedOffice: {
          postId: data?.postOffice,
          postCode: branchData?.data?.find((i) => i?.departmentId == data?.postOffice)?.code || '',
          postName: branchData?.data?.find((i) => i?.departmentId == data?.postOffice)?.name || '',
        },
        violatedUsers:
          staffOptions
            ?.filter((i) => data?.individual?.includes(i?.value))
            ?.map((i) => ({
              userId: Number(i?.value),
              staffCode: i?.code,
              fullName: i?.label,
            })) || [],
        confirmYesNo: data?.confirmYesNo || 'YES',
        branch: {
          postId:
            branchData?.data?.find((i) => i?.departmentId == data?.postOffice)
              ?.parentDepartmentId || '',
          postCode:
            branchData?.data?.find((i) => i?.departmentId == data?.postOffice)
              ?.parentDepartmentCode || '',
          postName:
            branchData?.data?.find((i) => i?.departmentId == data?.postOffice)
              ?.parentDepartmentName || '',
        },
      });
    }
    form.reset({});
    setFilesUpload([]);
    handleClose();
  };

  const title = isEditMode
    ? t('violationReportConclude.dialogEditViolationUnit')
    : t('violationReportConclude.dialogAddViolationUnit');

  return (
    <DialogCustom open={open} onclose={handleClose} title={title} className='!max-w-lg h-fit'>
      <div className='py-2'>
        <Form {...form}>
          <form className='flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='postOffice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('violationReportConclude.formUnitLabel')}</FormLabel>
                  <FormControl>
                    <Combobox
                      options={optionsBranch}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        form.setValue('individual', []);
                      }}
                      placeholder={t('violationReportConclude.formUnitPlaceholder')}
                      hasError={!!form.formState.errors.postOffice}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('violationReportConclude.colProcessContent')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('violationReportConclude.formContentPlaceholder')}
                      className='min-h-[90px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='individual'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('violationReportConclude.colViolator')}</FormLabel>
                    <FormControl>
                      <ComboBoxMulti
                        options={staffOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t('violationReportConclude.formViolatorPlaceholder')}
                        disable={!selectedPostOfficeId}
                        hasError={!!form.formState.errors.individual}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmYesNo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('violationReportConclude.colIsCorrect')}</FormLabel>
                    <FormControl>
                      <Combobox
                        options={CONFIRM_OPTIONS.map((i) => ({
                          label: t(i.label),
                          value: i.value,
                        }))}
                        value={field.value || 'YES'}
                        onChange={field.onChange}
                        placeholder={t('violationReportConclude.formConfirmPlaceholder')}
                        hasError={!!form.formState.errors.confirmYesNo}
                        disable={field.value == 'YES'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='compensationRate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('violationReportConclude.formCompensationRateLabel')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('violationReportConclude.formCompensationRatePlaceholder')}
                      onlyNumber
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-col gap-1'>
              <span className='text-sm font-medium'>
                {t('violationReportConclude.lblAttachmentFile')}
              </span>
              <Upload multiple value={filesUpload} onChange={handleFilesChange} maxFiles={3} />
            </div>

            <div className='grid grid-cols-2 gap-4 border-t border-border pt-4'>
              <Button type='button' variant='create' onClick={handleClose} disabled={isProcessing}>
                {t('common.cancel')}
              </Button>
              <Button type='submit' disabled={isProcessing}>
                {isEditMode ? t('common.update') : t('common.confirm')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogCustom>
  );
};

export default DialogCreateViolationPostOffice;
