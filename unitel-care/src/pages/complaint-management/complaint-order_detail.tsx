import { HeaderDetail } from '@/components/common/HeaderDetail';
import InformationOrder from '@/components/pages/complaint-order-detail/InformationOrder';
import ListDataInformationOrderDetail from '@/components/pages/complaint-order-detail/ListDataInformationOrderDetail';
import { Card } from '@/components/ui/card';
import { complaintService } from '@/services/complaintService';
import type {
  OrderActionHistoryItem,
  OrderDetail,
  OrderTrackingResponse,
} from '@/types/complaint-management';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const OrderDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<
    OrderTrackingResponse,
    AxiosError<{ message: string }>
  >({
    queryKey: ['order-tracking', id],
    queryFn: () => complaintService.getOrderTracking(id!),
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      navigate(-1);
      toast.error(error.response?.data.message || t('messages.error'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, navigate]);

  const orderDetail: OrderDetail | undefined = data?.data
    ? {
        trackingCode: data?.data?.order_id,
        customerCode: '',
        status: data?.data?.status,
        approvedDate: '',
        partner: data?.data?.partner ?? '',
        service: data?.data?.service,
        extraService: data?.data?.vas?.join(', '),
        goodsType: data?.data?.goods_type,
        senderType: '',
        senderName: data?.data?.sender_name,
        senderPhone: data?.data?.sender_phone,
        senderAddress: data?.data?.sender_address,
        senderProvince: data?.data?.sender_province,
        senderDistrict: data?.data?.sender_district,
        senderVillage: data?.data?.sender_ward,
        receiverType: '',
        receiverName: data?.data?.consignee_name,
        consignee_phone: data?.data?.consignee_phone,
        receiverAddress: data?.data?.consignee_address,
        receiverProvince: data?.data?.consignee_province,
        receiverDistrict: data?.data?.consignee_district,
        receiverVillage: data?.data?.consignee_ward,
        weight: String(data?.data?.order_weight),
        size: data?.data?.dimensions,
        totalFreight: String(data?.data?.total_fees),
        codAmount: String(data?.data?.cod),
        totalAmount: '',
        descStatus: data?.data?.descStatus,
      }
    : undefined;

  const trackingHistory: OrderActionHistoryItem[] =
    data?.data?.tracking?.map((item, index) => ({
      id: String(index + 1),
      status: item.status,
      postOffice: item.postcode,
      province: item.province,
      actionPerson: item.actor,
      actionTime: item.updated_at,
      content: item.content,
      journey_status: item.journey_status,
      licensePlate: item.plate_number,
      destinationPostOffice: item.delivery_postcode,
    })) ?? [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!orderDetail) {
    return <div>No data found</div>;
  }

  return (
    <div className='flex flex-col gap-4'>
      <HeaderDetail title={`${t('common.orderDetail')}: ${id}`} />
      <InformationOrder data={orderDetail} />
      <Card className='p-4'>
        <ListDataInformationOrderDetail data={trackingHistory} />
      </Card>
    </div>
  );
};

export default OrderDetailPage;
