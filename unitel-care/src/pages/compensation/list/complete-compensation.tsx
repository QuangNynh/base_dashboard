import { CompensationProfileCard } from '@/components/pages/compensation/list/CompensationProfileCard';
import { CompensationRateTable } from '@/components/pages/compensation/list/CompensationRateTable';
import { DetailField, SectionPanel } from '@/components/pages/compensation/list/CompensationShared';
import Upload from '@/components/common/Upload';
import type { UploadItem, UploadedFile } from '@/components/common/Upload';
import { Combobox } from '@/components/common/ComboBoxCustom';
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
import { CompleteCompensationSchema, type CompleteCompensationData } from '@/schemas/compensation';
import type { CompensationRateItem, CompleteCompensationDataRequest } from '@/types/compensation';
import type { MinutesDetailFile } from '@/types/violation-report-management';
import { DialogCustom } from '@/components/common/DialogCustom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, ChevronLeft, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import { formatDigit, getCurrency } from '../../../lib/utils';
import { compensationService } from '@/services/compensation';
import { violationReportService } from '@/services/violationReport';
import { useCompensationDetail } from '../../../hooks/useCompensationDetail';

export type UploadFileItem = { name?: string; type?: string; path?: string };

const mapToRequest = (
  data: CompleteCompensationData,
  documentFiles: MinutesDetailFile[]
): CompleteCompensationDataRequest => ({
  bcgCompensationAmount: data.bcgValue ? Number(data.bcgValue) : undefined,
  bcgCompensationContent: data.bcgInfo?.trim() || undefined,
  customerCode: data.customerId ? Number(data.customerId) : undefined,
  customerName: data.customerName?.trim() || undefined,
  customerIdentityNo: data.identifyCus?.trim() || undefined,
  customerPhone: data.phoneCus?.trim() || undefined,
  customerEmail: data.emailCus?.trim() || undefined,
  customerAddress: data.addressCus?.trim() || undefined,
  bankName: data.bankName?.trim() || undefined,
  bankCode: data.bankCode?.trim() || undefined,
  bankAccountNo: data.bankAccoutnNumber?.trim() || undefined,
  beneficiaryName: data.beneficiary?.trim() || undefined,
  // debitAccountNo: data.debitAccount?.trim() || undefined,
  documentFiles,
});

const IS_DECIMAL_TENANT = import.meta.env.VITE_TENANT_CODE === 'VTP_CAM';

const sanitizeBcgValue = (input: string): string => {
  const stripped = input.replace(/,/g, '');
  if (IS_DECIMAL_TENANT) {
    return stripped
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1')
      .replace(/(\.\d{2})\d+/g, '$1');
  }
  return stripped.replace(/[^0-9]/g, '');
};

const toDisplayDigit = (raw: string): string => {
  if (!raw) return '';
  const cleaned = raw.replace(/,/g, '');
  const dotIndex = cleaned.indexOf('.');

  if (dotIndex !== -1) {
    const intPart = cleaned.slice(0, dotIndex);
    const decimalPart = cleaned.slice(dotIndex);
    const n = Number(intPart);
    if (isNaN(n)) return cleaned;
    return `${n === 0 ? '0' : n.toLocaleString('en-US')}${decimalPart}`;
  }

  const n = Number(cleaned);
  return isNaN(n) ? raw : formatDigit(n);
};

const CompleteCompensation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { numericId, detailData, isLoading, infoProfileCard } = useCompensationDetail();

  const { data: bankOptions = [] } = useQuery({
    queryKey: ['bank-list'],
    queryFn: () => compensationService.getBankList(),
    staleTime: Infinity,
  });

  const [ratePagination, setRatePagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [documents, setDocuments] = useState<UploadItem[]>([]);
  const [dataRates, setDataRates] = useState<CompensationRateItem[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const resolver = useMemo(() => zodResolver(CompleteCompensationSchema(t)), [t]);

  const form = useForm<CompleteCompensationData>({
    resolver,
    mode: 'onBlur',
    defaultValues: {
      bcgValue: '',
      bcgInfo: '',
      customerId: '',
      customerName: '',
      identifyCus: '',
      phoneCus: '',
      emailCus: '',
      addressCus: '',
      bankName: '',
      bankCode: '',
      bankAccoutnNumber: '',
      beneficiary: '',
      // debitAccount: '',
    },
  });

  useEffect(() => {
    if (!detailData) return;
    setDocuments(detailData?.documentFiles ?? []);
    setDataRates(detailData.violatingPostOffices ?? []);
    form.setValue(
      'bcgValue',
      detailData.bcgCompensationAmount != null ? String(detailData.bcgCompensationAmount) : ''
    );
    form.setValue('bcgInfo', detailData.bcgCompensationContent ?? '');
    form.setValue(
      'customerId',
      detailData.customerCode != null ? String(detailData.customerCode) : ''
    );
    form.setValue(
      'customerName',
      detailData.customerName != null ? String(detailData.customerName) : ''
    );
    form.setValue(
      'identifyCus',
      detailData.customerIdentityNo != null ? String(detailData.customerIdentityNo) : ''
    );
    form.setValue(
      'phoneCus',
      detailData.customerPhone != null ? String(detailData.customerPhone) : ''
    );
    form.setValue(
      'emailCus',
      detailData.customerEmail != null ? String(detailData.customerEmail) : ''
    );
    form.setValue(
      'addressCus',
      detailData.customerAddress != null ? String(detailData.customerAddress) : ''
    );
    form.setValue('bankCode', detailData.bankCode != null ? String(detailData.bankCode) : '');
    form.setValue('bankName', detailData.bankName != null ? String(detailData.bankName) : '');
    form.setValue(
      'bankAccoutnNumber',
      detailData.bankAccountNo != null ? String(detailData.bankAccountNo) : ''
    );
    form.setValue(
      'beneficiary',
      detailData.beneficiaryName != null ? String(detailData.beneficiaryName) : ''
    );
    // form.setValue(
    //   'debitAccount',
    //   detailData.debitAccountNo != null ? String(detailData.debitAccountNo) : ''
    // );
  }, [detailData, form]);

  const handleDocumentsChange = useCallback((files: UploadItem[]) => setDocuments(files), []);

  const handleClear = useCallback(() => {
    const customerId = form.getValues('customerId');
    form.reset();
    form.setValue('customerId', customerId);
    setDocuments([]);
    setDataRates(detailData?.violatingPostOffices ?? []);
  }, [form, detailData]);

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsConfirming(true);
    try {
      const pendingFiles = documents.filter((f): f is File => f instanceof File);
      const alreadyUploaded = documents.filter((f): f is UploadedFile => !(f instanceof File));
      let allDocFiles: UploadedFile[] = alreadyUploaded;

      if (pendingFiles.length > 0) {
        try {
          const res = (await violationReportService.uploadFile(pendingFiles)) as {
            data: UploadFileItem[];
          };
          const uploaded: UploadedFile[] = (res?.data ?? []).map((f) => ({
            fileName: f?.name ?? '',
            url: f?.path ?? '',
            fileType: f?.type ?? '',
          }));
          const merged = [...alreadyUploaded, ...uploaded];
          setDocuments(merged);
          allDocFiles = merged;
        } catch {
          toast.error(t('violationReportConclude.uploadFileError'));
          return;
        }
      }

      const data = form.getValues();
      await compensationService.completeCompensation(
        numericId,
        mapToRequest(data, allDocFiles as MinutesDetailFile[])
      );
      toast.success(
        t('compensation.complete.completeSuccess', { code: detailData?.compensationCode ?? '' })
      );
      await queryClient.invalidateQueries({ queryKey: ['list-compensation'] });
      navigate(-1);
    } catch (err) {
      const e = err as { response?: { data?: { detail?: string } }; detail?: string };
      toast.error(e?.response?.data?.detail || e?.detail || t('common.errorDefault'));
    } finally {
      setIsConfirming(false);
    }
  };

  const { isSubmitting } = form.formState;
  const isDisabled = isSubmitting || isConfirming;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {
          if (documents.length === 0) {
            toast.error(t('compensation.complete.documentsRequired'));
            return;
          }
          setShowConfirm(true);
        })}
        className='flex flex-col gap-4'
      >
        {/* Header */}
        <Card className='py-2 px-4'>
          <div className='flex items-center gap-2'>
            <div
              className='bg-primary p-0.5 rounded-full text-background cursor-pointer'
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className='w-4 h-4' />
            </div>
            <span className='text-[17px] font-medium'>
              {t('compensation.complete.title')}: {detailData?.compensationCode ?? '--'}
            </span>
          </div>
        </Card>

        {/* Thông tin hồ sơ - 3 cột */}
        <CompensationProfileCard detail={infoProfileCard} />

        {/* Thông tin tỷ lệ đến bù */}
        <CompensationRateTable
          data={dataRates}
          isLoading={isLoading}
          pagination={ratePagination}
          onPaginationChange={setRatePagination}
        />

        {/* Waybill info + Bank info */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          {/* Thông tin đến bù vận đơn */}
          <SectionPanel
            title={`${t('compensation.detail.sectionWaybillInfo')}: ${detailData?.itemCode ?? '--'}`}
          >
            <div className='flex flex-col gap-3'>
              <div className='grid grid-cols-2 gap-3'>
                <DetailField
                  label={`${t('compensation.detail.lblGoodsValue')} (${getCurrency()})`}
                  value={formatDigit(detailData?.goodsValue)}
                  className='bg-gray-100'
                />
                <DetailField
                  label={`${t('compensation.detail.lblCod')} (${getCurrency()})`}
                  value={formatDigit(detailData?.codAmount)}
                  className='bg-gray-100'
                />
              </div>
              <DetailField
                label={t('compensation.detail.lblService')}
                value={
                  [detailData?.serviceName, ...(detailData?.vasName ?? [])]
                    .filter(Boolean)
                    .join(', ') || '—-'
                }
                className='bg-gray-100'
              />

              <FormField
                control={form.control}
                name='bcgValue'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {`${t('compensation.detail.lblBcgValue')} (${getCurrency()})`}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('compensation.complete.placeholderBcgValue')}
                        {...field}
                        value={toDisplayDigit(field.value)}
                        disabled={isDisabled}
                        onChange={(e) => field.onChange(sanitizeBcgValue(e.target.value))}
                        onBlur={() => {
                          field.onBlur();
                          const rawBcg = form.getValues('bcgValue');
                          if (!rawBcg) return;
                          const bcg = Number(rawBcg);
                          if (isNaN(bcg)) return;
                          setDataRates((prev) =>
                            prev.map((item) => ({
                              ...item,
                              compensationAmount: (bcg * (item.compensationRatio ?? 0)) / 100,
                            }))
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bcgInfo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('compensation.detail.lblBcgInfo')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        maxLength={100}
                        placeholder={t('compensation.complete.placeholderBcgInfo')}
                        disabled={isDisabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='col-span-2 flex flex-col gap-4'>
                <span className='text-sm font-semibold leading-none'>
                  {t('compensation.detail.lblDocuments')}{' '}
                  <span className='text-destructive'>*</span>
                </span>
                <Upload
                  multiple
                  accept='.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.pdf'
                  value={documents}
                  disabled={isDisabled}
                  onChange={handleDocumentsChange}
                />
              </div>
            </div>
          </SectionPanel>

          {/* Thông tin chuyển khoản */}
          <SectionPanel title={t('compensation.detail.sectionBankInfo')}>
            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='customerId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('compensation.detail.lblCustomerId')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('compensation.complete.placeholderCustomerId')}
                        {...field}
                        readOnly
                        className='bg-gray-100 cursor-default focus-visible:ring-0'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='customerName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('compensation.detail.lblCustomerName')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('compensation.complete.placeholderCustomerName')}
                        disabled={isDisabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='identifyCus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('compensation.detail.lblIdNumber')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('compensation.complete.placeholderIdNumber')}
                        disabled={isDisabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneCus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('compensation.detail.lblPhone')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('compensation.complete.placeholderPhone')}
                        disabled={isDisabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='emailCus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('compensation.detail.lblEmail')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        maxLength={100}
                        placeholder={t('compensation.complete.placeholderEmail')}
                        disabled={isDisabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='addressCus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('compensation.detail.lblAddress')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        maxLength={350}
                        placeholder={t('compensation.complete.placeholderAddress')}
                        disabled={isDisabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bankCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('compensation.detail.lblBank')} <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Combobox
                        options={bankOptions}
                        value={field.value}
                        onChange={field.onChange}
                        onChangeOption={(option) => {
                          form.setValue('bankName', option.label ?? '');
                        }}
                        placeholder={t('compensation.complete.placeholderBank')}
                        hasError={!!form.formState.errors.bankCode}
                        disable={isDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bankAccoutnNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('compensation.detail.lblAccountNumber')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('compensation.complete.placeholderAccountNumber')}
                        disabled={isDisabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='beneficiary'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('compensation.detail.lblBeneficiary')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('compensation.complete.placeholderBeneficiary')}
                        disabled={isDisabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name='debitAccount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('compensation.detail.lblDebitAccount')}{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('compensation.complete.placeholderDebitAccount')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
          </SectionPanel>

          {/* Thông tin phản hồi từ PTC */}
          {detailData?.paymentFailedReason && (
            <SectionPanel title={t('compensation.detail.lblPTCReply')}>
              <div className={`font-medium text-sm min-h-[38px] text-[#44494D] ${'bg-white'}`}>
                {detailData.paymentFailedReason}
              </div>
            </SectionPanel>
          )}
        </div>

        {/* Submit */}
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => setShowClearConfirm(true)}
            disabled={isDisabled}
          >
            {t('compensation.complete.clearForm')}
          </Button>
          <Button type='submit' disabled={isDisabled}>
            {isConfirming && <Loader2 className='w-4 h-4 animate-spin mr-2' />}
            {t('common.update')}
          </Button>
        </div>
      </form>

      <DialogCustom
        open={showClearConfirm}
        onclose={() => setShowClearConfirm(false)}
        title={t('compensation.complete.clearForm')}
        className='!w-[586px] !max-w-[90vw] h-fit'
      >
        <div className='flex flex-col items-center gap-4 py-4'>
          <p className='text-base text-foreground text-center'>
            {t('compensation.complete.clearConfirmDesc')}
          </p>
          <div className='grid grid-cols-2 gap-4 w-full pt-2'>
            <Button variant='outline' onClick={() => setShowClearConfirm(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={() => {
                handleClear();
                setShowClearConfirm(false);
              }}
            >
              {t('common.confirm')}
            </Button>
          </div>
        </div>
      </DialogCustom>

      <DialogCustom
        open={showConfirm}
        onclose={() => {
          if (!isConfirming) setShowConfirm(false);
        }}
        title={t('compensation.complete.confirmTitle')}
        className='!w-[586px] !max-w-[90vw] h-fit'
      >
        <div className='flex flex-col items-center gap-4 py-4'>
          <div className='flex items-center justify-center w-20 h-20 rounded-full bg-primary'>
            <Bell className='w-9 h-9 text-white' strokeWidth={1.8} />
          </div>

          <div className='flex flex-col items-center gap-2 text-center px-2'>
            <p className='text-base text-foreground'>{t('compensation.complete.confirmDesc')}</p>
          </div>

          <div className='grid grid-cols-2 gap-4 w-full pt-2'>
            <Button variant='outline' onClick={() => setShowConfirm(false)} disabled={isConfirming}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleConfirm} disabled={isConfirming}>
              {isConfirming && <Loader2 className='w-4 h-4 animate-spin mr-2' />}
              {t('common.confirm')}
            </Button>
          </div>
        </div>
      </DialogCustom>
    </Form>
  );
};

export default CompleteCompensation;
