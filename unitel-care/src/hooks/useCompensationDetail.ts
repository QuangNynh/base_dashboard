import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { compensationService } from '@/services/compensation';
import { formatDateTime, handleApiError } from '../lib/utils';
import { FORMAT_DATE } from '../constants/utils';
import type { StatusCompensationType } from '../constants/status';

export const useCompensationDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const numericId = id ? Number(id) : 0;

  const {
    data: detailCompensationResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['compensation-detail', numericId, location.key],
    queryFn: () => compensationService.getDetailCompensation(numericId),
    enabled: !!numericId,
  });

  const detailData = detailCompensationResponse?.data;

  useEffect(() => {
    if (error) handleApiError(error, undefined, 'fetchError');
  }, [error]);

  const infoProfileCard = useMemo(
    () => ({
      createdAt: formatDateTime(detailData?.createdAt, FORMAT_DATE.FULL_DATE_TIME),
      createdUnit: [detailData?.createdPostOfficeCode, detailData?.createdPostOfficeName]
        .filter(Boolean)
        .join(' - '),
      violatingPostOffice: detailData?.violatingPostOfficeSummary ?? '',
      violatingPerson: detailData?.violatingPersonSummary ?? '',
      rootPostOffice: [detailData?.rootPostOfficeCode, detailData?.rootPostOfficeName]
        .filter(Boolean)
        .join(' - '),
      minutesCode: detailData?.minutesCode ?? '',
      errorCode: detailData?.mistakeCode ?? '',
      status: detailData?.status as StatusCompensationType | undefined,
      compensationProfileCode: detailData?.compensationCode,
      waybillCode: detailData?.itemCode,
      content: detailData?.minutesContent,
      attachmentFile: detailData?.minutesFiles ?? [],
    }),
    [detailData]
  );

  return { numericId, detailData, isLoading, infoProfileCard };
};
