import { ComplaintRateReportTable } from '@/components/pages/complaint-rate-report/ComplaintRateReportTable';
import { FilterComplaintRateReport } from '@/components/pages/complaint-rate-report/FilterComplaintRateReport';
import { complaintService } from '@/services/complaintService';
import type { ComplaintRateReportQueryParams } from '@/types/complaint-management';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import saveAs from 'file-saver';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ComplaintRateReportPage = () => {
  const { t } = useTranslation();
  const [dataFilter, setDataFilter] = useState<ComplaintRateReportQueryParams>({});

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: otherData, isLoading } = useQuery({
    queryKey: ['list-complaint-rate-report', pagination.pageIndex, pagination.pageSize, dataFilter],
    queryFn: () =>
      complaintService.getListComplaintRateReport({
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
        ...dataFilter,
      }),
  });

  const data = otherData?.data?.page_data || [];
  const totalPages = otherData?.data?.pagination?.totalPages;

  const handleSearch = (params: ComplaintRateReportQueryParams) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setDataFilter({ ...params, trigger: Date.now() });
  };

  const { mutateAsync: exportComplaint, isPending: isExporting } = useMutation({
    mutationFn: () =>
      complaintService.exportExcelComplaintRateReport({
        page: pagination.pageIndex + 1,
        size: pagination.pageSize,
        ...dataFilter,
      }),

    onSuccess: (file: Blob) => {
      saveAs(file, `${t('complaintRateReport.fileNameComplaint')}.xlsx`);
    },

    onError: (error) => {
      console.error('Export failed:', error);
      toast.error(t('common.exportError'));
    },
  });

  return (
    <>
      <FilterComplaintRateReport
        onSubmit={handleSearch}
        onExport={exportComplaint}
        onCreate={() => {}}
        loadingExport={isExporting}
      />
      <ComplaintRateReportTable
        data={data}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        pageCount={totalPages}
      />
    </>
  );
};

export default ComplaintRateReportPage;
