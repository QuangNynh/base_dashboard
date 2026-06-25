import TextStatus from '@/components/common/TextStatus';
import { Card } from '@/components/ui/card';
import { convertGtoKG, formatDimensions, formatToTwoDecimal, getCurrency } from '@/lib/utils';
import { getStatusLabel, removeStatusPrefix } from '@/constants/status';
import i18n from '@/i18n';
import { complaintService } from '@/services/complaintService';
import type { OrderDetail } from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { CENTAL, PARCEL_TYPE_LABEL_KEY, type ParcelType } from '@/constants/utils';

interface InfoRowProps {
  label: string;
  value?: string | number;
  children?: React.ReactNode;
}

const InfoRow = ({ label, value, children }: InfoRowProps) => (
  <div className='flex flex-wrap gap-1 text-sm'>
    <span className='text-muted-foreground shrink-0'>{label}:</span>
    {children ?? <span className='font-medium break-all'>{value ?? '—'}</span>}
  </div>
);

interface Props {
  data: OrderDetail;
}

const InformationOrder = ({ data }: Props) => {
  const { t } = useTranslation();

  const { data: enumData } = useQuery({
    queryKey: ['tracking-status-enum', i18n.language],
    queryFn: () => complaintService.getTrackingStatusEnum(),
    staleTime: Infinity,
  });

  const statusLabel = getStatusLabel(data.status, enumData?.TrackingOrderStatus, data.descStatus);
  return (
    <Card className='p-4'>
      <div className='border border-gray-200 rounded-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y lg:divide-y-0 lg:divide-x divide-gray-200 text-sm'>
        {/* COL 1: Thông tin đơn hàng */}
        <div className='p-4 flex flex-col gap-2'>
          <h4 className='font-semibold text-primary mb-1'>{t('orderDetail.orderInfo')}</h4>
          <InfoRow label={t('orderDetail.trackingCode')} value={data.trackingCode} />
          <InfoRow label={t('orderDetail.status')}>
            <TextStatus status={removeStatusPrefix(data.status)} contentStatus={statusLabel} />
          </InfoRow>
          <InfoRow label={t('orderDetail.partner')} value={data.partner} />
          <InfoRow label={t('orderDetail.service')} value={data.service} />
          <InfoRow label={t('orderDetail.extraService')} value={data.extraService} />
          <InfoRow
            label={t('orderDetail.goodsType')}
            value={t(PARCEL_TYPE_LABEL_KEY[data?.goodsType as ParcelType])}
          />
        </div>

        {/* COL 2: Thông tin người gửi */}
        <div className='p-4 flex flex-col gap-2'>
          <h4 className='font-semibold text-primary mb-1'>{t('orderDetail.senderInfo')}</h4>
          <InfoRow label={t('orderDetail.customerName')} value={data.senderName} />
          <InfoRow label={t('orderDetail.phone')} value={data.senderPhone} />
          <InfoRow label={t('orderDetail.address')} value={data.senderAddress} />
          <InfoRow label={t('orderDetail.province')} value={data.senderProvince} />
          <InfoRow label={t('orderDetail.district')} value={data.senderDistrict} />
          <InfoRow label={t('orderDetail.village')} value={data.senderVillage} />
        </div>

        {/* COL 3: Địa chỉ nhận */}
        <div className='p-4 flex flex-col gap-2'>
          <h4 className='font-semibold text-primary mb-1'>{t('orderDetail.receiverAddress')}</h4>
          <InfoRow label={t('orderDetail.phone')} value={data.consignee_phone} />
          <InfoRow label={t('orderDetail.receiverName')} value={data.receiverName} />
          <InfoRow label={t('orderDetail.address')} value={data.receiverAddress} />
          <InfoRow label={t('orderDetail.province')} value={data.receiverProvince} />
          <InfoRow label={t('orderDetail.district')} value={data.receiverDistrict} />
          <InfoRow label={t('orderDetail.village')} value={data.receiverVillage} />
        </div>

        {/* COL 4: COD */}
        <div className='p-4 flex flex-col gap-2'>
          <h4 className='font-semibold text-primary mb-1'>{t('orderDetail.cod')}</h4>
          <InfoRow
            label={t('orderDetail.weight')}
            value={
              data?.goodsType === 'SPECIFIC'
                ? data?.weight + ' ' + CENTAL
                : `${convertGtoKG(data?.weight ?? 0)} ${CENTAL}`
            }
          />
          <InfoRow label={t('orderDetail.size')} value={formatDimensions(data?.size || '')} />
          <InfoRow
            label={t('orderDetail.totalFreight')}
            value={
              data?.totalFreight != null
                ? `${formatToTwoDecimal(data.totalFreight)} ${getCurrency()}`
                : undefined
            }
          />
          <InfoRow
            label={t('orderDetail.codAmount')}
            value={
              data?.codAmount != null
                ? `${formatToTwoDecimal(data.codAmount)} ${getCurrency()}`
                : undefined
            }
          />
        </div>
      </div>
    </Card>
  );
};

export default InformationOrder;
