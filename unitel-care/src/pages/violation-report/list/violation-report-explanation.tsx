import { DataTable } from '@/components/common/data-table';
import { HeaderDetail } from '@/components/common/HeaderDetail';
import Upload from '@/components/common/Upload';
import type { UploadedFile } from '@/components/common/Upload';
import DialogConfirmExplanation from '@/components/pages/violation-report-conclude/DialogConfirmExplanation';
import DialogHistoryExplaination from '@/components/pages/violation-report-conclude/DialogHistoryExplaination';
import { MinutesFileList } from '@/components/pages/violation-report-conclude/MinutesFileList';
import { MinutesTableSection } from '@/components/pages/violation-report-conclude/MinutesTableSection';
import {
  useTrackingColumns,
  useViolationUnitColumns,
} from '@/components/pages/violation-report-conclude/useMinutesColumns';
import ViolationReportInfoCard, {
  InfoRow,
} from '@/components/pages/violation-report-conclude/ViolationReportInfoCard';
import { ViolationReportStatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime, handleApiError } from '@/lib/utils';
import { violationReportService } from '@/services/violationReport';
import { postOfficeService } from '@/services/postOfficeService';
import type { ViolationUnitItem } from '@/types/violation-report-management';
import type { ProcessExplainViolationData } from '@/types/violation-report';
import type { PostMan, PostManResponse } from '@/types/post-office';

const selectStaffData = (res: PostManResponse): PostMan[] => res?.data ?? [];
import type { PaginationState } from '@tanstack/react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  getViolationNameDetail,
  mapInfoViolationUnitItem,
  SectionTitle,
  showViolatorName,
} from './violation-report-detail';
import { MultiSelectCombobox } from '../../../components/common/MultiSelectCombobox';
import { toast } from 'sonner';

type UploadItem = File | UploadedFile;

const ViolationReportExplanation = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const location = useLocation();
  const { state, key } = location;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tabKey: 'incoming' | 'outgoing' = state?.tabKey ?? 'incoming';

  const [openHistory, setOpenHistory] = useState(false);
  const [confirmType, setConfirmType] = useState<'correct' | 'incorrect' | null>(null);
  const [conclusionContent, setConclusionContent] = useState('');
  const [filesUpload, setFilesUpload] = useState<UploadItem[]>([]);
  const [selectedViolators, setSelectedViolators] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [trackingPagination, setTrackingPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [unitPagination, setUnitPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const numericId = id ? Number(id) : 0;

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['minutes-detail', numericId, key],
    queryFn: () => violationReportService.getDetailMinutesDetail(numericId),
    enabled: !!numericId,
  });

  useEffect(() => {
    if (error) handleApiError(error, undefined, 'fetchError');
  }, [error]);

  const detail = response?.data;

  const { data: staffData = [] } = useQuery<PostManResponse, Error, PostMan[]>({
    queryKey: ['staff-list', detail?.targetPostOfficeId],
    queryFn: () => postOfficeService.getPostManByTenant(detail!.targetPostOfficeId!),
    enabled: !!detail?.targetPostOfficeId,
    select: selectStaffData,
  });

  const violatorOptions = useMemo(
    () =>
      staffData.map((s) => ({ value: String(s.userId), label: `${s?.userId} - ${s?.fullName}` })),
    [staffData]
  );

  const handleConfirm = async () => {
    if (!confirmType || !numericId) return;

    setIsProcessing(true);

    type UploadFileItem = { name?: string; type?: string; path?: string };

    const pendingFiles = filesUpload.filter((f): f is File => f instanceof File);
    const alreadyUploaded = filesUpload.filter((f): f is UploadedFile => !(f instanceof File));

    let allFiles: UploadedFile[] = alreadyUploaded;

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
        // Persist to state so re-submit after API failure reuses uploaded files without re-uploading
        setFilesUpload([...alreadyUploaded, ...uploaded]);
        allFiles = [...alreadyUploaded, ...uploaded];
      } catch {
        toast.error(t('violationReportConclude.uploadFileError'));
        setIsProcessing(false);
        return;
      }
    }

    const payload: ProcessExplainViolationData = {
      minutesId: numericId,
      content: conclusionContent || undefined,
      attachedFiles: allFiles.length > 0 ? allFiles : undefined,
      confirmType: confirmType === 'correct' ? 'YES' : 'NO',
      violatedUsers:
        tabKey === 'incoming'
          ? selectedViolators
              .map((vid) => staffData.find((s) => String(s.userId) === vid))
              .filter((s): s is PostMan => s !== undefined)
              .map((staff) => ({
                userId: staff.userId,
                staffCode: staff.code,
                fullName: staff.fullName,
              }))
          : undefined,
    };

    try {
      if (tabKey === 'incoming') {
        await violationReportService.processExplainViolation(payload);
      } else {
        await violationReportService.processOpinionViolation(payload);
      }
      toast.success(
        t(
          tabKey === 'incoming'
            ? confirmType === 'correct'
              ? 'violationReportConclude.processSuccessCorrect'
              : 'violationReportConclude.processSuccessInCorrect'
            : confirmType === 'correct'
              ? 'violationReportConclude.processSuccessCorrectConclude'
              : 'violationReportConclude.processSuccessInCorrectConclude'
        )
      );
      setConfirmType(null);
      queryClient.invalidateQueries({ queryKey: ['violation-report-list'] });
      navigate(-1);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } }; detail?: string };
      toast.error(e?.response?.data?.detail || e?.detail || t('common.errorDefault'));
    } finally {
      setIsProcessing(false);
    }
  };

  const isShowViolationName = useMemo(() => showViolatorName(detail?.status), [detail?.status]);

  const violatorNames = useMemo(() => {
    return getViolationNameDetail(detail);
  }, [detail]);

  // Shared column definitions — from hooks to avoid duplication with violation-report-detail
  const trackingColumns = useTrackingColumns();
  const violationUnitColumns = useViolationUnitColumns();

  // Stable data references — prevents TanStack Table autoResetPageIndex infinite loop
  const trackingItems = useMemo(() => detail?.items ?? [], [detail?.items]);
  const minutesProcessHistories = useMemo(
    () => detail?.minutesProcessHistories ?? [],
    [detail?.minutesProcessHistories]
  );
  const violationUnitItems = useMemo<ViolationUnitItem[]>(
    () => mapInfoViolationUnitItem(detail?.minutesProcessViolatingHistories),
    [detail?.minutesProcessViolatingHistories]
  );
  const attachmentFiles = useMemo(() => detail?.attachedFiles ?? [], [detail]);

  // Stable callbacks — prevents cascade re-renders from inline arrows
  const handleOpenHistory = useCallback(() => setOpenHistory(true), []);
  const handleCloseHistory = useCallback(() => setOpenHistory(false), []);
  const handleCloseConfirm = useCallback(() => setConfirmType(null), []);
  const handleFilesChange = useCallback((files: UploadItem[]) => setFilesUpload(files), []);
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setConclusionContent(e.target.value),
    []
  );
  const handleConfirmIncorrect = useCallback(() => setConfirmType('incorrect'), []);
  const handleConfirmCorrect = useCallback(() => {
    if (tabKey === 'incoming' && selectedViolators.length === 0) {
      toast.warning(t('violationReportConclude.validationViolatorRequired'));
      return;
    }
    setConfirmType('correct');
  }, [tabKey, selectedViolators, t]);

  useEffect(() => {
    if (!!detail && !!detail?.minutesProcessHistories?.length) {
      const history = detail?.minutesProcessHistories?.[0];

      setConclusionContent(history?.content || '');
      setFilesUpload(history?.attachedFiles || []);
    }
  }, [detail]);

  return (
    <div className='flex flex-col gap-4'>
      <HeaderDetail
        title={`${t(tabKey == 'outgoing' ? 'violationReportConclude.opinion' : 'common.explain')}: ${detail?.minutesCode ?? id ?? ''}`}
      />

      <ViolationReportInfoCard
        generalInfo={
          <>
            <InfoRow
              label={t('violationReportConclude.lblCreatedDate')}
              value={
                detail?.createdAt
                  ? formatDateTime(detail.createdAt, FORMAT_DATE.DDMMYYYY)
                  : undefined
              }
            />
            <InfoRow
              label={t('violationReportConclude.lblCreatingPostOffice')}
              value={detail?.createdPostOfficeName}
            />
            <InfoRow
              label={t('violationReportConclude.lblPostOfficeFiled')}
              value={detail?.targetPostOfficeName}
            />
            <InfoRow
              label={t('violationReportConclude.lblRecordCode')}
              value={detail?.minutesCode}
            />
            <InfoRow
              label={t('violationReportConclude.lblReferenceCode')}
              value={detail?.refMinutesCode}
            />
            <InfoRow label={t('violationReportConclude.lblStatus')}>
              {detail?.status != null ? (
                <ViolationReportStatusBadge status={detail.status} />
              ) : null}
            </InfoRow>
          </>
        }
        errorInfo={
          <>
            <InfoRow
              label={t('violationReportConclude.lblErrorRecord')}
              value={detail?.mistakeCode}
            />
            <InfoRow
              label={t('violationReportConclude.lblErrorDetailShort')}
              value={detail?.mistakeDescription}
            />
            {isShowViolationName && (
              <InfoRow label={t('violationReportConclude.lblViolator')} value={violatorNames} />
            )}
          </>
        }
        contentInfo={
          <>
            <InfoRow
              label={t('violationReportConclude.lblRecordContent')}
              value={detail?.content}
            />
            <InfoRow label={t('violationReportConclude.lblAttachmentFile')}>
              <MinutesFileList files={attachmentFiles} />
            </InfoRow>
            <InfoRow
              label={t('violationReportConclude.lblKpiExplainDeadline')}
              value={formatDateTime(detail?.explainExpiredAt, FORMAT_DATE.FULL_DATE_TIME)}
            />
          </>
        }
      />

      <MinutesTableSection title={t('violationReportConclude.sectionTrackingListShort')}>
        <DataTable
          columns={trackingColumns}
          data={trackingItems}
          emptyHeight='h-40'
          pagination={trackingPagination}
          onPaginationChange={setTrackingPagination}
          manualPagination={false}
          isLoading={isLoading}
          errorMessage={t('violationReportConclude.noData')}
        />
      </MinutesTableSection>

      {tabKey === 'outgoing' && (
        <MinutesTableSection title={t('violationReportConclude.sectionViolationUnit')}>
          <DataTable
            columns={violationUnitColumns}
            data={violationUnitItems}
            emptyHeight='h-40'
            pagination={unitPagination}
            onPaginationChange={setUnitPagination}
            manualPagination={false}
            isLoading={isLoading}
            errorMessage={t('violationReportConclude.noData')}
          />
        </MinutesTableSection>
      )}

      <div>
        <Card className='p-0'>
          <SectionTitle title={t('violationReportConclude.sectionProcessInfo')} />
          <div className='flex flex-col gap-3 px-4 pb-6'>
            <div>
              <Button
                className='bg-[#AE4A6F] rounded-md'
                variant='destructive'
                onClick={handleOpenHistory}
              >
                {t('violationReportConclude.btnExplainHistory')}
              </Button>
            </div>

            <div className='flex items-start gap-4'>
              <div className='flex flex-col gap-1 flex-1'>
                <span className='text-[15px] font-semibold text-[#44494D]'>
                  {t('violationReportConclude.lblConclusionContent')}
                </span>
                <Textarea
                  value={conclusionContent}
                  maxLength={500}
                  onChange={handleContentChange}
                  placeholder={t('violationReportConclude.formContentPlaceholder')}
                  className='min-h-[80px] resize-none'
                />
              </div>

              <div className='flex flex-col gap-1 text-sm flex-1'>
                <span className='text-[15px] font-semibold text-[#44494D]'>
                  {t('violationReportConclude.lblAttachmentFile')}:
                </span>
                <Upload
                  accept='.mp3,.mp4,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.avi,.pdf'
                  multiple
                  value={filesUpload}
                  onChange={handleFilesChange}
                  maxFiles={tabKey === 'incoming' ? 10 : 3}
                />
              </div>
            </div>

            {tabKey === 'incoming' && (
              <div className='flex flex-col gap-1 flex-1'>
                <span className='text-[15px] font-semibold text-[#44494D]'>
                  {t('violationReportConclude.colViolator')}
                </span>
                <MultiSelectCombobox
                  options={violatorOptions}
                  value={selectedViolators}
                  onChange={setSelectedViolators}
                  placeholder={t('violationReportConclude.formStaffPlaceholder')}
                />
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className='flex justify-end gap-3 pt-2'>
        <Button variant='outline' disabled={isProcessing} onClick={handleConfirmIncorrect}>
          {t('violationReportConclude.btnConfirmIncorrect')}
        </Button>
        <Button
          className='bg-orange-500 hover:bg-orange-600 text-white'
          disabled={isProcessing}
          onClick={handleConfirmCorrect}
        >
          {t('violationReportConclude.btnConfirmCorrect')}
        </Button>
      </div>

      <DialogHistoryExplaination
        open={openHistory}
        onClose={handleCloseHistory}
        data={minutesProcessHistories}
      />
      {confirmType && (
        <DialogConfirmExplanation
          open={!!confirmType}
          type={confirmType}
          isLoading={isProcessing}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirm}
          configs={
            tabKey == 'outgoing'
              ? {
                  correct: {
                    question: t('violationReportConclude.dialogConfirmCorrectMsg'),
                    description: t('violationReportConclude.dialogConfirmCorrectNoteConclude'),
                  },
                  incorrect: {
                    question: t('violationReportConclude.dialogConfirmIncorrectMsg'),
                    description: t('violationReportConclude.dialogConfirmIncorrectNoteConclude'),
                  },
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default ViolationReportExplanation;
