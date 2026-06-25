import { DataTable } from '@/components/common/data-table';
import { HeaderDetail } from '@/components/common/HeaderDetail';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import Upload from '@/components/common/Upload';
import type { UploadedFile } from '@/components/common/Upload';
import { orDash } from '@/components/pages/violation-report-conclude/useMinutesColumns';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/common/ComboBoxCustom';
import { ComboBoxMulti } from '../../../components/common/ComboBoxMuilti';
import {
  CreateViolationReportSchema,
  type CreateViolationReportData,
} from '@/schemas/violation-report';
import TrackingCodeInput, {
  type OrderSearchViolation,
} from '@/components/pages/violation-report-conclude/TrackingCodeInput';
import { violationReportService } from '@/services/violationReport';
import { postOfficeService } from '@/services/postOfficeService';
import type {
  Option,
  PostOffice,
  PostMan,
  PostOfficeResponse,
  PostManResponse,
} from '@/types/post-office';
import type { CreateMinutesRequest, ViolationErrorDetailRow } from '@/types/violation-report';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { Loader2, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isEmpty } from 'lodash';
import DialogConfirmCreateMinutesAutoClose from '../../../components/pages/violation-report-conclude/DialogConfirmCreateMinutesAutoClose';

type UploadItem = File | UploadedFile;

// Module-level stable select functions — prevents new array references on every render
const selectErrorGroups = (res: {
  data: Array<{ id: number; code: string; name: string }>;
}): Option[] =>
  (res.data ?? [])
    .filter((item) => item?.code != null)
    .map((item) => ({ value: String(item.id), label: item.name || item.code }));

const selectMistakeDetail = (res: { data: ViolationErrorDetailRow[] }): ViolationErrorDetailRow[] =>
  res?.data ?? [];

const selectPostOffices = (res: PostOfficeResponse): PostOffice[] => res.data ?? [];

const selectStaff = (res: PostManResponse): PostMan[] => res.data ?? [];

const CreateViolationReportPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [trackingItems, setTrackingItems] = useState<OrderSearchViolation[]>([]);
  const [filesUpload, setFilesUpload] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [trackingPagination, setTrackingPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const refErrorDetailAutoClose = useRef(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<CreateViolationReportData | null>(
    null
  );

  // Memoized resolver — prevents schema recreation on every render
  const resolver = useMemo(() => zodResolver(CreateViolationReportSchema(t)), [t]);

  const form = useForm<CreateViolationReportData>({
    resolver,
    defaultValues: {
      nhomLoi: '',
      chiTietLoi: '',
      maLoi: '',
      buuCucBiLap: '',
      caNhanViPham: [],
      maBienBanThamChieu: '',
      noiDung: '',
    },
  });

  const selectedNhomLoi = useWatch({ control: form.control, name: 'nhomLoi' });
  const selectedBuuCuc = useWatch({ control: form.control, name: 'buuCucBiLap' });

  const { data: errorGroupOptions = [] } = useQuery<
    { data: Array<{ id: number; code: string; name: string }> },
    Error,
    Option[]
  >({
    queryKey: ['error-group-list'],
    queryFn: () => violationReportService.getAllErrorGroup(),
    select: selectErrorGroups,
  });

  const { data: mistakeDetailData = [] } = useQuery<
    { data: ViolationErrorDetailRow[] },
    Error,
    ViolationErrorDetailRow[]
  >({
    queryKey: ['mistake-from-group', selectedNhomLoi],
    queryFn: () => violationReportService.getListMistakeFromGroup(Number(selectedNhomLoi)),
    enabled: !!selectedNhomLoi,
    select: selectMistakeDetail,
  });

  const errorDetailOptions = useMemo<Option[]>(
    () =>
      mistakeDetailData
        .filter((item) => item?.mistakeCode != null)
        .map((item) => ({
          value: String(item.id),
          label: `${item.mistakeCode} - ${item.mistakeDescription}`,
        })),
    [mistakeDetailData]
  );

  const { data: postOfficeData } = useQuery<PostOfficeResponse, Error, PostOffice[]>({
    queryKey: ['all-post-office-list'],
    queryFn: () => postOfficeService.getListPostOfficeByTenant(''),
    select: selectPostOffices,
  });

  const postOfficeOptions = useMemo<Option[]>(
    () =>
      (postOfficeData ?? []).map((item) => ({
        value: item.departmentId,
        label: `${item.code ?? ''} - ${item.name}`,
      })),
    [postOfficeData]
  );

  const { data: staffData } = useQuery<PostManResponse, Error, PostMan[]>({
    queryKey: ['staff-list', selectedBuuCuc],
    queryFn: () => postOfficeService.getPostManByTenant(selectedBuuCuc),
    enabled: !!selectedBuuCuc,
    select: selectStaff,
  });

  const staffOptions = useMemo<Option[]>(
    () => (staffData ?? []).map((item) => ({ value: String(item.userId), label: item.fullName })),
    [staffData]
  );

  const refCodeState = useRef<'valid' | 'invalid' | 'unchecked'>('unchecked');
  const [isCheckingRef, setIsCheckingRef] = useState(false);

  const checkReferenceCode = useCallback(
    async (code: string): Promise<boolean> => {
      if (!code) return true;
      setIsCheckingRef(true);
      try {
        // TODO: thay bằng service thực tế để kiểm tra mã biên bản tồn tại
        const exists = true; // placeholder
        refCodeState.current = exists ? 'valid' : 'invalid';
        if (!exists) {
          form.setError('maBienBanThamChieu', {
            type: 'manual',
            message: t('violationReportConclude.validationReferenceNotFound'),
          });
        } else {
          form.clearErrors('maBienBanThamChieu');
        }
        return exists;
      } catch {
        refCodeState.current = 'unchecked';
        form.clearErrors('maBienBanThamChieu');
        return true;
      } finally {
        setIsCheckingRef(false);
      }
    },
    [form, t]
  );

  const handleDeleteTracking = useCallback((code: string) => {
    setTrackingItems((prev) => prev.filter((item) => item.code !== code));
  }, []);

  const handleFilesChange = useCallback((files: UploadItem[]) => setFilesUpload(files), []);

  // Pagination excluded from deps — STT reads from table.getState() so columns don't recreate on page change
  const trackingColumns = useMemo<ColumnDef<OrderSearchViolation>[]>(
    () => [
      {
        id: 'stt',
        size: 70,
        header: () => <span className='pl-2'>{t('common.stt')}</span>,
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return <span className='pl-3'>{row.index + 1 + pageIndex * pageSize}</span>;
        },
      },
      {
        id: 'actions',
        header: t('common.actions'),
        cell: ({ row }) => (
          <TooltipCustom content={t('common.delete')}>
            <Button
              type='button'
              size='sm'
              variant='icon'
              onClick={() => handleDeleteTracking(row.original.code)}
            >
              <Trash2 className='w-4 h-4 text-destructive' />
            </Button>
          </TooltipCustom>
        ),
      },
      {
        accessorKey: 'code',
        header: t('violationReportConclude.colTrackingCodeShort'),
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
      },
      {
        accessorKey: 'type',
        header: t('violationReportConclude.colType'),
        cell: ({ getValue }) => {
          const type = getValue<string | undefined>()?.trim();
          if (type === 'ORDER')
            return <span>{t('violationReportConclude.trackingTypeVanDon')}</span>;
          if (type === 'PACKAGE')
            return <span>{t('violationReportConclude.trackingTypeTaiKien')}</span>;
          return <span>{orDash(type)}</span>;
        },
      },
      {
        accessorKey: 'origin_postcode',
        header: t('violationReportConclude.colOriginPostOffice'),
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
      },
      {
        accessorKey: 'current_package_code',
        header: t('violationReportConclude.colShipmentCode'),
        cell: ({ getValue }) => <span>{orDash(getValue<string>())}</span>,
      },
      {
        accessorKey: 'complaint_count',
        header: t('violationReportConclude.colComplaintCount'),
        // complaint_count is a number — orDash only handles strings
        cell: ({ getValue }) => {
          const val = getValue<number | undefined>();
          return <span>{val != null ? String(val) : '--'}</span>;
        },
      },
    ],
    [t, handleDeleteTracking]
  );

  const { mutateAsync: submitCreateMinutes, isPending: isSubmitting } = useMutation({
    mutationFn: (payload: CreateMinutesRequest) => violationReportService.createMinutes(payload),
  });

  const resetPage = useCallback(() => {
    form.reset();
    setTrackingItems([]);
    setFilesUpload([]);
    refErrorDetailAutoClose.current = false;
    refCodeState.current = 'unchecked';
  }, [form]);

  const handleCreateMinutes = async (data: CreateViolationReportData) => {
    const refCode = data.maBienBanThamChieu?.trim() ?? '';
    if (refCode && refCodeState.current !== 'valid') {
      const valid = await checkReferenceCode(refCode);
      if (!valid) return;
    }

    const pendingFiles = filesUpload.filter((f): f is File => f instanceof File);
    const alreadyUploaded = filesUpload.filter((f): f is UploadedFile => !(f instanceof File));

    let allFiles: UploadedFile[] = alreadyUploaded;

    if (pendingFiles.length > 0) {
      setIsUploading(true);
      try {
        type UploadFileItem = { name?: string; type?: string; path?: string };
        const res = (await violationReportService.uploadFile(pendingFiles)) as {
          data: UploadFileItem[];
        };
        const uploaded: UploadedFile[] = (res?.data ?? []).map((f) => ({
          fileName: f?.name ?? '',
          url: f?.path ?? '',
          fileType: f?.type ?? '',
        }));
        // Persist uploaded results so re-submit after create failure reuses them without re-uploading
        setFilesUpload([...alreadyUploaded, ...uploaded]);
        allFiles = [...alreadyUploaded, ...uploaded];
      } catch {
        toast.error(t('violationReportConclude.uploadFileError'));
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const selectedPostOffice = (postOfficeData ?? []).find(
      (p) => p.departmentId === data.buuCucBiLap
    );
    const selectedStaff = (staffData ?? []).filter((s) =>
      (data.caNhanViPham ?? []).includes(String(s.userId))
    );

    try {
      await submitCreateMinutes({
        mistakeId: Number(data.chiTietLoi) || 0,
        targetBranchId: selectedPostOffice?.parentDepartmentId ?? '',
        targetPostOfficeId: data.buuCucBiLap,
        refMinutesCode: refCode || undefined,
        content: data.noiDung,
        items: trackingItems.map((item) => ({
          itemType: item.type,
          itemCode: item.code,
          rootPostOfficeId: Number(item.origin_post_code_id),
          rootPostOfficeCode: item.origin_postcode,
          rootPostOfficeName: item.origin_post_code_name,
          loadCode: item.current_package_code,
          complaintCodes: '',
        })),
        createdViolatingPersons: selectedStaff.map((item) => ({
          personId: item.userId,
          personCode: item.code,
          personName: item.fullName,
        })),
        attachedFiles: allFiles,
      });

      toast.success(t('violationReportConclude.createSuccess'));
      resetPage();
      queryClient.invalidateQueries({ queryKey: ['violation-report-list'] });
      navigate('/violation-report/list?tab=outgoing');
    } catch (err: unknown) {
      const e = err as {
        response?: { data?: { message?: string; detail?: string } };
        message?: string;
      };
      toast.error(
        e?.response?.data?.message ||
          e?.response?.data?.detail ||
          e?.message ||
          t('common.errorDefault')
      );
    }
  };

  const onSubmit = async (data: CreateViolationReportData) => {
    if (refErrorDetailAutoClose.current) {
      setPendingSubmitData(data);
    } else {
      await handleCreateMinutes(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
        <HeaderDetail title={t('violationReportConclude.titleCreate')} />

        <div>
          <div className='py-2 px-3 bg-[#F8F8FA]'>
            <span className='text-[17px] font-semibold'>
              {t('violationReportConclude.sectionGeneralInfo')}
            </span>
          </div>
          <Card className='p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4'>
            <FormField
              control={form.control}
              name='nhomLoi'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('violationReportConclude.formErrorGroupLabel')}{' '}
                    <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={errorGroupOptions}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        form.setValue('chiTietLoi', '');
                        form.setValue('maLoi', '');
                      }}
                      placeholder={t('violationReportConclude.formErrorGroupPlaceholder')}
                      hasError={!!form.formState.errors.nhomLoi}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='chiTietLoi'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('violationReportConclude.formErrorDetailLabel')}{' '}
                    <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={errorDetailOptions}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        const selected = mistakeDetailData.find((d) => String(d.id) === val);
                        refErrorDetailAutoClose.current = selected?.isAutoClose ?? false;
                        form.setValue('maLoi', selected?.mistakeCode ?? '', {
                          shouldValidate: true,
                        });
                      }}
                      placeholder={t('violationReportConclude.formErrorDetailPlaceholder')}
                      disable={!selectedNhomLoi}
                      hasError={!!form.formState.errors.chiTietLoi}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='maLoi'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('violationReportConclude.colErrorCode')}{' '}
                    <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder={t('violationReportConclude.formErrorCodePlaceholder')}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='buuCucBiLap'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('violationReportConclude.lblPostOfficeFiled')}{' '}
                    <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={postOfficeOptions}
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        form.setValue('caNhanViPham', []);
                      }}
                      placeholder={t('violationReportConclude.formPostOfficeFiledPlaceholder')}
                      hasError={!!form.formState.errors.buuCucBiLap}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='caNhanViPham'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('violationReportConclude.colViolator')}{' '}
                    <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBoxMulti
                      options={staffOptions}
                      checkbox
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder={t('violationReportConclude.formStaffPlaceholder')}
                      disable={!selectedBuuCuc}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='maBienBanThamChieu'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('violationReportConclude.lblReferenceCode')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('violationReportConclude.formReferenceCodePlaceholder')}
                      disabled={isCheckingRef}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        refCodeState.current = 'unchecked';
                        form.clearErrors('maBienBanThamChieu');
                      }}
                      onBlur={async () => {
                        field.onBlur();
                        await checkReferenceCode(
                          form.getValues('maBienBanThamChieu')?.trim() ?? ''
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        </div>

        <Card className='p-4 gap-y-4'>
          <p className='text-sm font-medium text-[#44494D]'>
            {t('violationReportConclude.sectionTrackingInput')}
          </p>
          <TrackingCodeInput value={trackingItems} onChange={setTrackingItems} />
          <DataTable
            columns={trackingColumns}
            data={trackingItems}
            pagination={trackingPagination}
            onPaginationChange={setTrackingPagination}
            manualPagination={false}
            errorMessage={t('violationReportConclude.noData')}
          />
        </Card>

        <div>
          <div className='py-2 px-3 bg-[#F8F8FA]'>
            <span className='text-[17px] font-semibold'>
              {t('violationReportConclude.sectionContent')}
            </span>
          </div>
          <Card className='p-4'>
            <div className='flex items-start gap-6'>
              <FormField
                control={form.control}
                name='noiDung'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>
                      {t('violationReportConclude.sectionContent')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('violationReportConclude.formContentPlaceholder')}
                        className='min-h-[100px] resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex flex-col gap-2 flex-1'>
                <span className='text-sm font-medium leading-none'>
                  {t('violationReportConclude.lblAttachmentFile')}
                </span>
                <Upload
                  multiple
                  accept='.mp3,.mp4,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.avi,.pdf'
                  value={filesUpload}
                  onChange={handleFilesChange}
                  maxFiles={3}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={isCheckingRef || isUploading || isSubmitting || isEmpty(trackingItems)}
          >
            {(isUploading || isSubmitting) && <Loader2 className='w-4 h-4 animate-spin mr-2' />}
            {t('violationReportConclude.btnTransfer')}
          </Button>
        </div>
      </form>
      <DialogConfirmCreateMinutesAutoClose
        open={!!pendingSubmitData}
        onClose={() => setPendingSubmitData(null)}
        onConfirm={async () => {
          if (!pendingSubmitData) return;

          await handleCreateMinutes(pendingSubmitData);
          setPendingSubmitData(null);
        }}
      />
    </Form>
  );
};

export default CreateViolationReportPage;
