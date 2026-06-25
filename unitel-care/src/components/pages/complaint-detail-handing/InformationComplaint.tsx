import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CHANNEL_TYPE_LABEL_KEY, SEVERITY_TYPE_LABEL_KEY } from '@/constants/options';
import {
  STATUS_COMPLAINT_COLOR,
  STATUS_COMPLAINT_TRANSLATION_KEY,
  type StatusComplaintType,
} from '@/constants/status';
import {
  CATEGORY_EVALUATION_LABEL_KEY,
  EXTENSION_EVALUATION_LABEL_KEY,
  PROCESSING_QUALITY_LABEL_KEY,
  RECEPTION_QUALITY_LABEL_KEY,
} from '@/constants/ttvh-evaluation';
import { CENTAL, FORMAT_DATE, PARCEL_TYPE_LABEL_KEY } from '@/constants/utils';
import { TimeFormatter, type LanguageCode } from '@/lib/timeFormatter';
import { convertGtoKG, formatDateTime, formatToTwoDecimal, getCurrency } from '@/lib/utils';
import { postOfficeService } from '@/services/postOfficeService';
import type { ComplaintDetail } from '@/types/complaint-management';
import type { PostOffice, PostOfficeResponse } from '@/types/post-office';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface InfoRowProps {
  label: string;
  value?: string | number;
  children?: React.ReactNode;
}

interface InfoRowLinkProps extends InfoRowProps {
  link: string;
}

const InfoRow = ({ label, value, children }: InfoRowProps) => (
  <div className='flex flex-wrap gap-1 text-sm'>
    <span className='text-muted-foreground shrink-0'>{label}:</span>
    {children ?? <span className='font-medium break-all'>{value ?? '—'}</span>}
  </div>
);
const InfoRowLink = ({ label, value, children, link }: InfoRowLinkProps) => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-wrap gap-1 text-sm'>
      <span className='text-muted-foreground shrink-0'>{label}:</span>
      {children ?? (
        <span
          className='font-medium break-all text-[#3B82F6] cursor-pointer'
          onClick={() => navigate(link)}
        >
          {value ? value : '—'}
        </span>
      )}
    </div>
  );
};

interface Props {
  data: ComplaintDetail;
}

const InformationComplaint = ({ data }: Props) => {
  const { t, i18n } = useTranslation();

  const { data: postOfficeAllData } = useQuery<PostOfficeResponse, Error, PostOffice[]>({
    queryKey: ['post-office-all-list'],
    queryFn: () => postOfficeService.getAllListPostOffice(),
    select: (res) => res.data,
  });

  const postOfficeOptions = useMemo(
    () =>
      postOfficeAllData?.map((item) => ({
        value: item.departmentId.toString(),
        label:
          item?.code && item?.name ? `${item?.code} - ${item?.name}` : item?.code || item?.name,
      })) ?? [],
    [postOfficeAllData]
  );

  return (
    <Card className='p-4'>
      <div className='border border-gray-200 rounded-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y lg:divide-y-0 lg:divide-x divide-gray-200 text-sm'>
        {/* COL 1: Order information */}
        <div className='p-4 flex flex-col gap-2'>
          <h4 className='font-semibold text-primary mb-1'>{t('detailComplaint.orderInfo')}</h4>
          <InfoRowLink
            label={t('detailComplaint.trackingCode')}
            value={data?.order_code}
            link={`/complaint-management/list/order/${data?.order_code}`}
          />
          {/* TODO 260417: hidden customer code and address */}
          {/* <InfoRow label={t('detailComplaint.customerCode')} value={data?.contact_id} />
          <InfoRow label={t('detailComplaint.address')} value={data?.contact_address} /> */}
          <InfoRow
            label={t('detailComplaint.weight')}
            value={
              data?.parcel_type === 'SPECIFIC'
                ? data?.order_weight + ' ' + CENTAL
                : `${convertGtoKG(data?.order_weight ?? 0)} ${CENTAL}`
            }
          />
          <InfoRow
            label={t('detailComplaint.goodsType')}
            value={t(PARCEL_TYPE_LABEL_KEY[data?.parcel_type])}
          />
          <InfoRow label={t('detailComplaint.service')} value={data?.service_type} />
          <InfoRow
            label={t('detailComplaint.totalFreight')}
            value={
              data?.total_fee != null
                ? `${formatToTwoDecimal(data.total_fee)} ${getCurrency()}`
                : undefined
            }
          />
          <InfoRow
            label={t('detailComplaint.codAmount')}
            value={
              data?.cod != null ? `${formatToTwoDecimal(data.cod)} ${getCurrency()}` : undefined
            }
          />
          <InfoRow
            label={t('detailComplaint.callCenterPhone')}
            value={data?.request_phone_number || '—'}
          />
          <InfoRow
            label={t('detailComplaint.contactPhone')}
            value={data?.contact_phone_number || '—'}
          />
        </div>

        {/* COL 2: Complaint information */}
        <div className='p-4 flex flex-col gap-2'>
          <h4 className='font-semibold text-primary mb-1'>{t('detailComplaint.complaintInfo')}</h4>
          <InfoRow label={t('detailComplaint.complaintCode')} value={data?.complaint_code} />
          <InfoRow
            label={t('detailComplaint.receptionChannel')}
            value={t(CHANNEL_TYPE_LABEL_KEY[data?.receipt_channel])}
          />
          {/* <InfoRow
            label={t('detailComplaint.processingUnit')}
            value={data?.processing_post_office}
          />
          <InfoRow label={t('detailComplaint.personalProcess')} value={data?.handler_full_name} />
          <InfoRow label={t('detailComplaint.feedbackCategory')} value={data?.category_name} /> */}
          <InfoRow
            label={t('detailComplaint.level')}
            value={t(SEVERITY_TYPE_LABEL_KEY[data?.priority])}
          />
          <InfoRow label={t('detailComplaint.feedbackCount')} value={data?.complaint_count} />
          <InfoRow
            label={t('detailComplaint.deadline')}
            value={
              data?.deadline
                ? formatDateTime(data?.deadline, FORMAT_DATE.FULL_DATE_TIME_NO_SECONDS)
                : '—'
            }
          />
          <InfoRow
            label={t('detailComplaint.remainingTime')}
            value={
              data?.remainingTime
                ? TimeFormatter.formatWithDays(
                    data?.remainingTime,
                    (i18n?.language ?? 'en') as LanguageCode
                  )
                : '-'
            }
          />
          <InfoRow label={t('detailComplaint.content')} value={data?.content} />
          <InfoRow label={t('detailComplaint.minutesCode')} value={data?.record_code} />
        </div>

        {/* COL 3: Result */}
        <div className='p-4 flex flex-col gap-2'>
          <h4 className='font-semibold text-primary mb-1'>{t('detailComplaint.resultInfo')}</h4>
          <InfoRow label={t('detailComplaint.status')}>
            <Badge
              className='text-white text-xs'
              style={{
                backgroundColor:
                  STATUS_COMPLAINT_COLOR[data?.status as StatusComplaintType] ?? '#6B7280',
              }}
            >
              {t(`${STATUS_COMPLAINT_TRANSLATION_KEY[data?.status as StatusComplaintType]}`)}
            </Badge>
          </InfoRow>
          <InfoRow label={t('detailComplaint.result')} value={data?.internal_note} />
          <InfoRow label={t('detailComplaint.customerReply')} value={data?.response_to_customer} />
          <InfoRow label={t('detailComplaint.faultUnit')} value={data?.fault_unit_lv2_name} />
          <InfoRow
            label={t('detailComplaint.faultPerson')}
            value={data?.fault_individual_full_name}
          />
        </div>

        {/* COL 4: Comment GQKN */}
        <div className='p-4 flex flex-col gap-2'>
          <h4 className='font-semibold text-primary mb-1'>{t('detailComplaint.qualityInfo')}</h4>
          <InfoRow
            label={t('detailComplaint.processingQuality')}
            value={
              PROCESSING_QUALITY_LABEL_KEY[
                data?.ttvh_evaluation
                  ?.processing_quality as keyof typeof PROCESSING_QUALITY_LABEL_KEY
              ]
                ? t(
                    PROCESSING_QUALITY_LABEL_KEY[
                      data?.ttvh_evaluation
                        ?.processing_quality as keyof typeof PROCESSING_QUALITY_LABEL_KEY
                    ]
                  )
                : '—'
            }
          />
          <InfoRow
            label={t('detailComplaint.complaintCategory')}
            value={
              CATEGORY_EVALUATION_LABEL_KEY[
                data?.ttvh_evaluation
                  ?.category_evaluation as keyof typeof CATEGORY_EVALUATION_LABEL_KEY
              ]
                ? t(
                    CATEGORY_EVALUATION_LABEL_KEY[
                      data?.ttvh_evaluation
                        ?.category_evaluation as keyof typeof CATEGORY_EVALUATION_LABEL_KEY
                    ]
                  )
                : '—'
            }
          />
          <InfoRow
            label={t('detailComplaint.extension')}
            value={
              EXTENSION_EVALUATION_LABEL_KEY[
                data?.ttvh_evaluation
                  ?.extension_evaluation as keyof typeof EXTENSION_EVALUATION_LABEL_KEY
              ]
                ? t(
                    EXTENSION_EVALUATION_LABEL_KEY[
                      data?.ttvh_evaluation
                        ?.extension_evaluation as keyof typeof EXTENSION_EVALUATION_LABEL_KEY
                    ]
                  )
                : '—'
            }
          />
          <InfoRow
            label={t('detailComplaint.receptionQuality')}
            value={
              RECEPTION_QUALITY_LABEL_KEY[
                data?.ttvh_evaluation?.reception_quality as keyof typeof RECEPTION_QUALITY_LABEL_KEY
              ]
                ? t(
                    RECEPTION_QUALITY_LABEL_KEY[
                      data?.ttvh_evaluation
                        ?.reception_quality as keyof typeof RECEPTION_QUALITY_LABEL_KEY
                    ]
                  )
                : '—'
            }
          />
          <InfoRow
            label={t('detailComplaint.postOfficeLate')}
            value={
              postOfficeOptions.find((item) => item.value === data?.ttvh_evaluation?.slow_unit_id)
                ?.label
            }
          />
        </div>
      </div>
    </Card>
  );
};

export default InformationComplaint;
