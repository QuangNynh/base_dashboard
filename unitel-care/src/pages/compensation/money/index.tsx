import { useMemo, useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import Filter, {
  type CompensationMoneyFilterData,
} from '@/components/pages/compensation/money/Filter';
import CompensationMoneyTable from '@/components/pages/compensation/money/Table';
import type { CompensationMoneyItem } from '@/types/compensation';
import { compensationService } from '@/services/compensation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SuccessModal from '@/components/pages/compensation/money/SuccessModal';
import FailedModal from '@/components/pages/compensation/money/FailedModal';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  STATUS_COMPENSATION,
  STATUS_COMPENSATION_TRANSLATION_KEY,
  STATUS_PAYMENT_COMPENSATION,
  STATUS_PAYMENT_COMPENSATION_KEY,
} from '@/constants/status';
import compact from 'lodash/compact';
import { format, startOfMonth } from 'date-fns';
import { violationReportService } from '../../../services/violationReport';

const DATE_FORMAT = 'dd/MM/yyyy';

const Money: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [dataFilter, setDataFilter] = useState<CompensationMoneyFilterData>({
    keyword: '',
    fromDate: format(startOfMonth(new Date()), DATE_FORMAT),
    toDate: format(new Date(), DATE_FORMAT),
  });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [selectedItem, setSelectedItem] = useState<CompensationMoneyItem | null>(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [isSubmittingSuccess, setIsSubmittingSuccess] = useState(false);
  const [openFailedModal, setOpenFailedModal] = useState(false);
  const [isSubmittingFailed, setIsSubmittingFailed] = useState(false);

  const { data: postOfficesRes } = useQuery({
    queryKey: ['compensation-money-all-post-offices'],
    queryFn: () => violationReportService.getListAccessiblePostOffice(''),
    staleTime: 5 * 60 * 1000,
  });

  const postOfficeOptions = useMemo(
    () =>
      (postOfficesRes?.data ?? []).map((item) => ({
        value: item.departmentId,
        label: compact([item.code, item.name]).join(' - '),
      })),
    [postOfficesRes]
  );

  const statusOptions = useMemo(
    () =>
      Object.values(STATUS_COMPENSATION).map((value) => ({
        value: String(value),
        label: t(STATUS_COMPENSATION_TRANSLATION_KEY[value]),
      })),
    [t]
  );

  const paymentStatusOptions = useMemo(
    () =>
      Object.values(STATUS_PAYMENT_COMPENSATION).map((value) => ({
        value: String(value),
        label: t(STATUS_PAYMENT_COMPENSATION_KEY[value]),
      })),
    [t]
  );

  const { data, isLoading } = useQuery({
    queryKey: ['compensationMoneyList', pagination.pageIndex, pagination.pageSize, dataFilter],
    queryFn: () => {
      const { status, postOfficeIds, keyword, fromDate, toDate, paymentStatus } = dataFilter;
      return compensationService.getPaymentList({
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
        keyword,
        fromDate,
        toDate,
        paymentStatus,
        ...(status?.length && { status: status.join(',') }),
        ...(postOfficeIds?.length && { postOfficeIds: postOfficeIds.join(',') }),
      });
    },
    staleTime: 0,
    gcTime: 0,
  });

  const handleSearch = (data: CompensationMoneyFilterData) => {
    setDataFilter(data);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleSuccess = (item: CompensationMoneyItem) => {
    setSelectedItem(item);
    setOpenSuccessModal(true);
  };

  const handleFailed = (item: CompensationMoneyItem) => {
    setSelectedItem(item);
    setOpenFailedModal(true);
  };

  const handleConfirmSuccess = async (files: File[]) => {
    if (!selectedItem) return;
    setIsSubmittingSuccess(true);
    try {
      const signedFiles =
        files.length > 0 ? await compensationService.uploadSignedFiles(files) : [];

      await compensationService.confirmPaymentSuccess({
        compensationCaseId: selectedItem.id,
        signedFiles,
      });

      toast.success(
        t('compensation.moneyModal.toastConfirmSuccess', { code: selectedItem.compensationCode })
      );
      await queryClient.invalidateQueries({ queryKey: ['compensationMoneyList'] });
      setOpenSuccessModal(false);
      setSelectedItem(null);
    } catch (error) {
      const message = error as {
        response?: { data?: { message?: string; detail?: string } };
        message: string;
      };
      toast.error(
        message?.response?.data?.detail ||
          message?.response?.data?.message ||
          message.message ||
          t('common.uploadError')
      );
    } finally {
      setIsSubmittingSuccess(false);
    }
  };

  const handleConfirmFailed = async (reason: string) => {
    if (!selectedItem) return;
    setIsSubmittingFailed(true);
    try {
      await compensationService.confirmPaymentFailed({
        compensationCaseId: selectedItem.id,
        failureReason: reason,
      });

      toast.success(
        t('compensation.moneyModal.toastConfirmFailedRecorded', {
          code: selectedItem.compensationCode,
        })
      );
      await queryClient.invalidateQueries({ queryKey: ['compensationMoneyList'] });
      setOpenFailedModal(false);
      setSelectedItem(null);
    } catch (error) {
      const message = error as {
        response?: { data?: { message?: string; detail?: string } };
        message: string;
      };
      toast.error(
        message?.response?.data?.detail ||
          message?.response?.data?.message ||
          message.message ||
          t('common.uploadError')
      );
    } finally {
      setIsSubmittingFailed(false);
    }
  };

  return (
    <div className='space-y-4'>
      <Filter
        onSubmit={handleSearch}
        statusOptions={statusOptions}
        paymentStatusOptions={paymentStatusOptions}
        postOfficeOptions={postOfficeOptions}
      />
      <CompensationMoneyTable
        data={data?.data?.page_data || []}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        pageCount={data?.data?.pagination?.totalPages || 0}
        onSuccess={handleSuccess}
        onFailed={handleFailed}
      />
      <SuccessModal
        open={openSuccessModal}
        compensationCode={selectedItem?.compensationCode}
        isSubmitting={isSubmittingSuccess}
        onOpenChange={(open) => {
          setOpenSuccessModal(open);
          if (!open) setSelectedItem(null);
        }}
        onConfirm={handleConfirmSuccess}
      />
      <FailedModal
        open={openFailedModal}
        compensationCode={selectedItem?.compensationCode}
        isSubmitting={isSubmittingFailed}
        onOpenChange={(open) => {
          setOpenFailedModal(open);
          if (!open) setSelectedItem(null);
        }}
        onConfirm={handleConfirmFailed}
      />
    </div>
  );
};

export default Money;
