import { FilterViolationRateReport } from '@/components/pages/violation-report-rate-report/FilterViolationRateReport';
import { ViolationRateReportTable } from '@/components/pages/violation-report-rate-report/ViolationRateReportTable';
import type { ViolationRateReportQueryParams } from '@/types/violation-report-management';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format, isValid, parse, subDays } from 'date-fns';
import saveAs from 'file-saver';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { violationReportService } from '../../../services/violationReport';

const DATE_INPUT_FORMAT = 'dd/MM/yyyy';
const DATE_API_FORMAT = 'yyyy-MM-dd';

const toApiDate = (value: string | undefined) => {
  if (!value) return undefined;
  const parsed = parse(value, DATE_INPUT_FORMAT, new Date());
  return isValid(parsed) ? format(parsed, DATE_API_FORMAT) : undefined;
};

const buildApiParams = (filter: ViolationRateReportQueryParams) => {
  const { postOfficeIds, dateFrom, dateTo, ...rest } = filter;
  return {
    ...rest,
    ...{ fromDate: toApiDate(dateFrom), toDate: toApiDate(dateTo) },
    ...(Array.isArray(postOfficeIds) && postOfficeIds.length > 0
      ? { postOfficeId: postOfficeIds.join(',') }
      : {}),
  };
};

const ViolationRateReportPage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [dataFilter, setDataFilter] = useState<ViolationRateReportQueryParams>({
    dateFrom: format(subDays(new Date(), 30), DATE_INPUT_FORMAT),
    dateTo: format(new Date(), DATE_INPUT_FORMAT),
  });

  const handleSearch = useCallback((params: ViolationRateReportQueryParams) => {
    setDataFilter(params);
  }, []);

  const { mutate: handleExport, isPending: isExporting } = useMutation({
    mutationFn: (): Promise<Blob> =>
      violationReportService.exportViolationRateReport(buildApiParams(dataFilter)),
    onSuccess: (file) => {
      saveAs(
        file,
        `${t('violationRateReport.fileNameExel')}_${format(new Date(), 'ddMMyyyy')}.xlsx`
      );
    },
    onError: async (err: unknown) => {
      const e = err as { response?: { data?: Blob | { message?: string } }; message?: string };
      let errorMessage = t('common.exportError');

      if (e?.response?.data instanceof Blob) {
        try {
          const text = await (e.response.data as Blob).text();
          const jsonError = JSON.parse(text) as { message?: string };
          errorMessage = jsonError?.message || errorMessage;
        } catch {
          // blob parse failed — keep default errorMessage
        }
      } else if ((e?.response?.data as { message?: string })?.message) {
        errorMessage = (e.response!.data as { message: string }).message;
      } else if (e?.message) {
        errorMessage = e.message;
      }

      toast.error(errorMessage);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['violation-report-rate-list', dataFilter, location.key],
    queryFn: () => violationReportService.getLisReportRate(buildApiParams(dataFilter)),
  });

  return (
    <>
      <FilterViolationRateReport
        onSubmit={handleSearch}
        onExport={handleExport}
        loadingExport={isExporting}
      />
      <ViolationRateReportTable data={data?.data ?? []} isLoading={isLoading} />
    </>
  );
};

export default ViolationRateReportPage;
