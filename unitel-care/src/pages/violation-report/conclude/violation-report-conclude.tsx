import { DataTable } from '@/components/common/data-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FORMAT_DATE } from '@/constants/utils';
import { formatDateTime, handleApiError } from '@/lib/utils';
import Upload from '@/components/common/Upload';
import type { UploadedFile } from '@/components/common/Upload';
import { TooltipCustom } from '@/components/common/TooltipCustom';
import EditIcon from '@/assets/icons/EditIcon';
import DialogCreateViolationPostOffice from '@/components/pages/violation-report-conclude/DialogCreateViolationPostOffice';
import DialogHistoryExplaination from '@/components/pages/violation-report-conclude/DialogHistoryExplaination';
import { InfoRow } from '@/components/pages/violation-report-conclude/ViolationReportInfoCard';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { violationReportService } from '@/services/violationReport';
import { ViolationReportStatusBadge } from '@/components/common/StatusBadge';
import type { DataViolatedOffice, ViolationReportConcludeData } from '@/types/violation-report';
import { MinutesFileList } from '@/components/pages/violation-report-conclude/MinutesFileList';
import DialogConfirmExplanation from '@/components/pages/violation-report-conclude/DialogConfirmExplanation';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import {
  orDash,
  useTrackingColumns,
} from '@/components/pages/violation-report-conclude/useMinutesColumns';
import compact from 'lodash/compact';
import { STATUS_VIOLATION_CODE } from '@/constants/status';

type UploadItem = File | UploadedFile;

const ViolationReportConcludeSubmit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [trackingPagination, setTrackingPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [violationPagination, setViolationPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [dataViolatingOffice, setDataViolatingOffice] = useState<DataViolatedOffice[]>([]);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['minutes-detail conclude', id, location.key],
    queryFn: () => violationReportService.getDetailMinutesDetail(Number(id)),
    enabled: id != null,
  });

  const detail = response?.data;

  const [filesUpload, setFilesUpload] = useState<UploadItem[]>([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [openUnitDialog, setOpenUnitDialog] = useState(false);
  const [editItem, setEditItem] = useState<DataViolatedOffice | undefined>(undefined);
  const [conclusionContent, setConclusionContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmType, setConfirmType] = useState<'correct' | 'incorrect' | null>(null);

  const handleOpenCreate = useCallback(() => {
    setEditItem(undefined);
    setOpenUnitDialog(true);
  }, []);

  const handleOpenEdit = useCallback((item: DataViolatedOffice) => {
    setEditItem(item);
    setOpenUnitDialog(true);
  }, []);

  const handleDelete = useCallback((e: MouseEvent<HTMLButtonElement>, item: DataViolatedOffice) => {
    e.preventDefault();
    e.stopPropagation();

    setDataViolatingOffice((prev) => prev.filter((i) => i.id !== item.id));
  }, []);

  const handleCloseHistory = useCallback(() => setOpenHistory(false), []);

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setConclusionContent(e.target.value),
    []
  );
  const handleFilesChange = useCallback((files: UploadItem[]) => setFilesUpload(files), []);

  const handleConfirmIncorrect = useCallback(() => setConfirmType('incorrect'), []);
  const handleConfirmCorrect = useCallback(() => {
    setConfirmType('correct');
  }, []);
  const handleCloseConfirm = useCallback(() => setConfirmType(null), []);

  const handleConfirm = async () => {
    if (!confirmType || id == undefined) return;

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

    const violations = dataViolatingOffice?.filter((i) => i?.confirmYesNo == 'YES');

    if (!violations.length && confirmType == 'correct') {
      toast.error(t('violationReportConclude.confirmViolation'));
      setIsProcessing(false);
      return;
    }

    const payload: ViolationReportConcludeData = {
      minutesId: Number(id),
      content: conclusionContent,
      attachedFiles: allFiles.map((f) => ({
        fileName: f.fileName,
        url: f.url,
        fileType: f.fileType,
      })),
      confirmType: confirmType == 'correct' ? 'YES' : 'NO',
      items:
        confirmType == 'correct'
          ? violations.map((item) => ({
              violatedOffice: item.violatedOffice,
              note: item.note,
              attachedFiles: item.files,
              violatedUsers: item.violatedUsers,
              compensationRatio: item.compensationRatio,
            }))
          : [],
    };

    try {
      await violationReportService.processConcludeViolation(payload);
      toast.success(
        t(
          confirmType == 'correct'
            ? 'violationReportConclude.processSuccessCorrect'
            : 'violationReportConclude.processSuccessInCorrect'
        )
      );
      setConfirmType(null);
      navigate(-1);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } }; detail?: string };
      toast.error(e?.response?.data?.detail || e?.detail || t('common.errorDefault'));
    } finally {
      setIsProcessing(false);
    }
  };

  const statusBadge = useMemo(
    () => (detail?.status != null ? <ViolationReportStatusBadge status={detail.status} /> : null),
    [detail]
  );

  const violatorNames = useMemo(
    () =>
      (detail?.createdViolatingPersons ?? [])
        .map((p) => p.personName)
        .filter(Boolean)
        .join(', ') || '-',
    [detail?.createdViolatingPersons]
  );
  const attachmentFiles = useMemo(() => detail?.attachedFiles ?? [], [detail?.attachedFiles]);
  const minutesProcessHistories = useMemo(
    () => detail?.minutesProcessHistories ?? [],
    [detail?.minutesProcessHistories]
  );

  const trackingColumns = useTrackingColumns();
  const trackingItems = useMemo(() => detail?.items ?? [], [detail?.items]);

  const violationUnitColumns = useMemo<ColumnDef<DataViolatedOffice>[]>(
    () => [
      {
        id: 'stt',
        size: 40,
        header: () => <span>{t('common.stt')}</span>,
        cell: ({ row }) => <span>{row.index + 1}</span>,
        meta: { className: 'px-3 whitespace-break-spaces' },
      },
      {
        id: 'actions',
        header: t('common.actions'),
        cell: ({ row }) => (
          <div className='flex gap-2 items-center justify-center'>
            <TooltipCustom content={t('common.edit')}>
              <Button size='sm' variant='icon' onClick={() => handleOpenEdit(row.original)}>
                <EditIcon className='!w-5.5 !h-5.5 ' />
              </Button>
            </TooltipCustom>
            <TooltipCustom content={t('common.delete')}>
              <Button
                size='sm'
                variant='icon'
                className='text-destructive hover:text-destructive'
                onClick={(e) => handleDelete(e, row.original)}
              >
                <Trash2 className='w-4 h-4' color='#8F9294' />
              </Button>
            </TooltipCustom>
          </div>
        ),
        size: 120,
        meta: {
          className: 'px-3 max-w-[120px] text-center',
        },
      },
      {
        accessorKey: 'postOffice',
        header: t('violationReportConclude.colUnit'),
        cell: ({ row }) => (
          <span>
            {[row.original?.violatedOffice?.postCode, row.original?.violatedOffice?.postName]
              ?.filter(Boolean)
              .join(' - ') ?? '--'}
          </span>
        ),
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 200,
      },
      {
        accessorKey: 'branchName',
        header: t('violationReportConclude.colBranch'),
        cell: ({ row }) => (
          <span>
            {orDash(
              compact([row.original?.branch?.postCode, row.original?.branch?.postName]).join(' - ')
            )}
          </span>
        ),
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 200,
      },
      {
        accessorKey: 'content',
        header: t('violationReportConclude.colProcessContent'),
        cell: ({ row }) => <span>{row.original?.note || '--'}</span>,
        size: 300,
        meta: {
          className: 'px-3 whitespace-break-spaces',
        },
      },
      {
        accessorKey: 'individual',
        header: t('violationReportConclude.colViolator'),
        cell: ({ row }) => (
          <span>{row.original?.violatedUsers?.map((i) => i?.fullName)?.join(', ') || '--'}</span>
        ),
        size: 300,
        meta: {
          className: 'px-3 whitespace-break-spaces',
        },
      },
      {
        accessorKey: 'confirmYesNo',
        header: t('violationReportConclude.colIsCorrect'),
        cell: ({ row }) => {
          const key = row.original?.confirmYesNo?.trim();
          // key is an i18n path (e.g. 'ttvhEvaluation.categoryEvaluation.correct') or '--'

          const text =
            key && key !== '--'
              ? t(
                  key == 'NO'
                    ? 'ttvhEvaluation.categoryEvaluation.incorrect'
                    : 'ttvhEvaluation.categoryEvaluation.correct'
                )
              : '';
          return <span>{text}</span>;
        },
        meta: { className: 'px-3 whitespace-break-spaces' },
        size: 80,
      },
      {
        accessorKey: 'attachmentFile',
        header: t('violationReportConclude.colAttachmentFile'),
        cell: ({ row }) => <MinutesFileList files={row.original?.files || []} />,
        meta: {
          className: 'px-3 whitespace-break-spaces',
        },
        size: 300,
      },
      {
        accessorKey: 'compensationRate',
        header: t('violationReportConclude.colCompensationRate'),
        cell: ({ row }) => (
          <span>
            {row.original?.compensationRatio != null ? `${row.original?.compensationRatio}%` : '--'}
          </span>
        ),
        meta: {
          className: 'px-3',
        },
        size: 80,
      },
    ],
    [t, handleDelete, handleOpenEdit]
  );

  useEffect(() => {
    if (error) handleApiError(error, undefined, 'fetchError');
  }, [error]);

  useEffect(() => {
    if (!!detail && !!detail?.minutesProcessViolatingHistories?.length) {
      const _history = detail?.minutesProcessViolatingHistories ?? [];
      setDataViolatingOffice(
        _history.map((h) => ({
          id: uuidv4(),
          violatedOffice: {
            postCode: h?.actorPostOfficeCode || '',
            postName: h?.actorPostOfficeName || '',
            postId: h?.actorPostOfficeId || '',
          },
          note: h?.content || '',
          files: h?.attachedFiles ?? [],
          violatedUsers:
            h?.violatingUsers?.map((u) => ({
              userId: u.userId || '',
              fullName: u.fullName || '',
              staffCode: u.staffCode || '',
            })) ?? [],
          compensationRatio: h.compensationRatio,
          confirmYesNo: h?.confirmYesNo || 'NO',
          branch: h?.branch,
        }))
      );
    }
  }, [detail]);

  return (
    <div className='flex flex-col gap-4'>
      <Card className='py-2 px-4'>
        <div className='flex items-center gap-2'>
          <div
            className='bg-primary p-0.5 rounded-full text-background cursor-pointer'
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className='w-4 h-4' />
          </div>
          <span className='text-[17px] font-medium'>
            {t('violationReportConclude.titleConcludeDetail')}
          </span>
        </div>
      </Card>

      {/* Thông tin biên bản */}
      <Card className='p-4'>
        <div className='border grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x'>
          {/* Col 1: Thông tin chung */}
          <div className='flex flex-col'>
            <div className='p-4 bg-[#F4FAFF] border-b'>
              <h4 className='font-semibold text-primary mb-1 text-sm'>
                {t('violationReportConclude.sectionGeneralInfo')}
              </h4>
            </div>
            <div className='flex flex-col p-4 gap-2'>
              <InfoRow
                label={t('violationReportConclude.lblRecordCreator')}
                value={detail?.createdByEmployeeName}
              />
              <InfoRow
                label={t('violationReportConclude.lblRecordCode')}
                value={detail?.minutesCode}
              />
              <InfoRow
                label={t('violationReportConclude.lblReferenceCode')}
                value={detail?.refMinutesCode}
              />
              <InfoRow
                label={t('violationReportConclude.lblCreatingPostOffice')}
                value={
                  [detail?.createdPostOfficeCode, detail?.createdPostOfficeName]
                    ?.filter(Boolean)
                    .join(' - ') ?? '--'
                }
              />
              <InfoRow
                label={t('violationReportConclude.lblTargetPO')}
                value={
                  [detail?.targetPostOfficeCode, detail?.targetPostOfficeName]
                    ?.filter(Boolean)
                    .join(' - ') ?? '--'
                }
              />
              <InfoRow
                label={t('violationReportConclude.lblCreatedDate')}
                value={formatDateTime(detail?.createdAt, FORMAT_DATE.FULL_DATE_TIME)}
              />
            </div>
          </div>

          {/* Col 2: Thông tin lỗi */}
          <div className='flex flex-col'>
            <div className='p-4 bg-[#F4FAFF] border-b'>
              <h4 className='font-semibold text-primary mb-1 text-sm'>
                {t('violationReportConclude.sectionErrorInfo')}
              </h4>
            </div>
            <div className='flex flex-col p-4 gap-2'>
              <InfoRow
                label={t('violationReportConclude.lblErrorCode')}
                value={detail?.mistakeCode}
              />
              <InfoRow
                label={t('violationReportConclude.lblErrorIndicator')}
                value={detail?.mistakeDescription}
              />
              <InfoRow label={t('violationReportConclude.lblStatus')}>{statusBadge}</InfoRow>
              {detail?.status != null &&
                ![STATUS_VIOLATION_CODE.COMPLETED, STATUS_VIOLATION_CODE.CANCELLED].includes(
                  detail?.status
                ) && (
                  <InfoRow label={t('violationReportConclude.lblViolator')} value={violatorNames} />
                )}
            </div>
          </div>

          {/* Col 3: Nội dung */}
          <div className='flex flex-col'>
            <div className='p-4 bg-[#F4FAFF] border-b'>
              <h4 className='font-semibold text-primary mb-1 text-sm'>
                {t('violationReportConclude.sectionContent')}
              </h4>
            </div>
            <div className='flex flex-col p-4 gap-2'>
              <InfoRow
                label={t('violationReportConclude.lblRecordContent')}
                value={detail?.content}
              />
              <InfoRow label={t('violationReportConclude.lblAttachmentFile')}>
                <MinutesFileList files={attachmentFiles} />
              </InfoRow>
              <InfoRow
                label={t('violationReportConclude.lblKpiDeadline')}
                value={formatDateTime(detail?.concludeExpiredAt, FORMAT_DATE.FULL_DATE_TIME)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Danh sách vận đơn / tải / CCDC */}
      <Card className='p-0 gap-0'>
        <div className='mb-4 bg-[#F8F8FA] px-4 py-3 rounded-t-md'>
          <h3 className='text-primary font-semibold'>
            {t('violationReportConclude.sectionTrackingListShort')}
          </h3>
        </div>
        <div className='px-4 pb-6'>
          <DataTable
            columns={trackingColumns}
            data={trackingItems}
            pagination={trackingPagination}
            onPaginationChange={setTrackingPagination}
            manualPagination
            isLoading={isLoading}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            pageCount={trackingItems?.length}
            errorMessage={t('violationReportConclude.noData')}
          />
        </div>
      </Card>

      {/* Đơn vị vi phạm */}
      <Card className='p-0 gap-0'>
        <div className='mb-4 bg-[#F8F8FA] px-4 py-3 rounded-t-md'>
          <h3 className='text-primary font-semibold'>
            {t('violationReportConclude.sectionViolationUnit')}
          </h3>
        </div>
        <div className='pb-3 px-4'>
          <Button variant='create' size='sm' onClick={handleOpenCreate}>
            {t('common.addNew')}
          </Button>
        </div>
        <div className='px-4 pb-6'>
          <DataTable
            columns={violationUnitColumns}
            data={dataViolatingOffice}
            pagination={violationPagination}
            onPaginationChange={setViolationPagination}
            manualPagination
            isLoading={isLoading}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            pageCount={trackingItems?.length}
            errorMessage={t('violationReportConclude.noData')}
          />
        </div>
      </Card>

      {/* Kết luận */}
      <Card className='p-0 gap-0'>
        <div className='mb-4 bg-[#F8F8FA] px-4 py-3 rounded-t-md'>
          <h3 className='text-primary font-semibold'>
            {t('violationReportConclude.sectionConclusion')}
          </h3>
        </div>
        <div className='flex flex-col gap-3 px-4 pb-6'>
          <div>
            <Button
              className='bg-[#AE4A6F] rounded-md'
              variant='destructive'
              onClick={() => setOpenHistory(true)}
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
              <Upload multiple value={filesUpload} onChange={handleFilesChange} maxFiles={3} />
            </div>
          </div>
        </div>
      </Card>

      <div className='flex justify-end gap-3'>
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

      <DialogCreateViolationPostOffice
        open={openUnitDialog}
        onClose={() => setOpenUnitDialog(false)}
        editItem={editItem}
        dataViolatingOffice={dataViolatingOffice}
        onCreate={(data) => setDataViolatingOffice([...dataViolatingOffice, data])}
        onEdit={(data) => {
          setDataViolatingOffice(
            dataViolatingOffice.map((item) => (item.id === data.id ? data : item))
          );
        }}
      />

      {confirmType && (
        <DialogConfirmExplanation
          open={!!confirmType}
          type={confirmType}
          isLoading={isProcessing}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirm}
          configs={{
            correct: {
              question: t('violationReportConclude.dialogConfirmCorrectMsg'),
              description: t('violationReportConclude.dialogConfirmCorrectNote'),
            },
            incorrect: {
              question: t('violationReportConclude.dialogConfirmIncorrectMsg'),
              description: t('violationReportConclude.dialogConfirmIncorrectNoteConclude'),
            },
          }}
        />
      )}
    </div>
  );
};

export default ViolationReportConcludeSubmit;
