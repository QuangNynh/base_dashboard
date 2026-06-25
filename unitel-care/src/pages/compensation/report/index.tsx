import { format, parse, subDays } from 'date-fns';
import { useState } from 'react';
import type { PaginationState } from '@tanstack/react-table';
import CompensationReportFilter, {
  type CompensationReportFilterData,
} from '@/components/pages/compensation/report/Filter';
import CompensationReportTable from '@/components/pages/compensation/report/Table';
import { compensationService } from '@/services/compensation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FORMAT_DATE } from '@/constants/utils';
import { useTranslation } from 'react-i18next';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { extractBlobApiError } from '../../../lib/utils';

const DEFAULT_DATE_FMT = 'dd/MM/yyyy';

function toApiDate(ddmmyyyy: string): string {
  if (!ddmmyyyy) return '';
  return format(parse(ddmmyyyy, DEFAULT_DATE_FMT, new Date()), FORMAT_DATE.YYYYMMDD);
}

const CompensationReport: React.FC = () => {
  const { t } = useTranslation();

  const [appliedFilter, setAppliedFilter] = useState<CompensationReportFilterData>(() => ({
    fromDate: format(subDays(new Date(), 7), DEFAULT_DATE_FMT),
    toDate: format(new Date(), DEFAULT_DATE_FMT),
    branchId: undefined,
    postOfficeIds: [],
  }));
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleSearch = (values: CompensationReportFilterData) => {
    setAppliedFilter(values);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const { data: reportRes, isLoading: isLoadingReport } = useQuery({
    queryKey: ['compensation-report', appliedFilter, pagination.pageIndex, pagination.pageSize],
    queryFn: () => {
      const { postOfficeIds, fromDate, toDate, branchId } = appliedFilter;
      return compensationService.getCompensationReport({
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
        fromDate: toApiDate(fromDate),
        toDate: toApiDate(toDate),
        branchId,
        ...(postOfficeIds?.length && { postOfficeIds: postOfficeIds.join(',') }),
      });
    },
    staleTime: 0,
    gcTime: 0,
  });

  const { mutateAsync: exportReport, isPending: isExportingReport } = useMutation({
    mutationFn: () => {
      const { postOfficeIds, fromDate, toDate, branchId } = appliedFilter;
      return compensationService.getCompensationReportExcel({
        fromDate: toApiDate(fromDate),
        toDate: toApiDate(toDate),
        branchId,
        ...(postOfficeIds?.length && { postOfficeIds: postOfficeIds.join(',') }),
      });
    },
    onSuccess: (file: Blob) => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      saveAs(file, `Baocaohosoboithuong_${dd}${mm}${yyyy}.xlsx`);
    },
    onError: async (err: unknown) => {
      const message = await extractBlobApiError(err, t('common.exportError'));
      toast.error(message);
    },
  });

  const { mutateAsync: exportReportDetail, isPending: isExportingReportDetail } = useMutation({
    mutationFn: () => {
      const { postOfficeIds, fromDate, toDate, branchId } = appliedFilter;
      return compensationService.getCompensationReportExcelDetail({
        fromDate: toApiDate(fromDate),
        toDate: toApiDate(toDate),
        branchId,
        ...(postOfficeIds?.length && { postOfficeIds: postOfficeIds.join(',') }),
      });
    },
    onSuccess: (file: Blob) => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      saveAs(file, `BaocaochitietHSBT_${dd}${mm}${yyyy}.xlsx`);
    },
    onError: async (err: unknown) => {
      const message = await extractBlobApiError(err, t('common.exportError'));
      toast.error(message);
    },
  });

  const tableData = reportRes?.data?.page_data ?? [];
  const totalPages = reportRes?.data?.pagination.totalPages || 1;

  return (
    <>
      <div className='mb-4'>
        <CompensationReportFilter
          onSubmit={handleSearch}
          onExport={exportReport}
          loadingExport={isExportingReport}
          onExportDetail={exportReportDetail}
          loadingExportDetail={isExportingReportDetail}
        />
      </div>
      <CompensationReportTable
        data={tableData}
        pagination={pagination}
        setPagination={setPagination}
        pageCount={totalPages}
        isLoading={isLoadingReport}
      />
    </>
  );
};

export default CompensationReport;
