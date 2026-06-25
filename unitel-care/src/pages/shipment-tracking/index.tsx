import ButtonLoading from '@/components/common/ButtonLoading';
import { EmptyData } from '@/components/common/EmptyData';
import { InputSearch } from '@/components/common/InputSearch';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { complaintService } from '@/services/complaintService';
import type {
  ComplaintHistoryItem,
  OrderActionHistoryItem,
  OrderDetail,
} from '@/types/complaint-management';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import IconNotData from '@/assets/icons/IconNotData';
import ComplaintHistoryTab from './search-shipment-tracking/ComplaintHistoryTab';
import SearchShipmentTracking from './search-shipment-tracking';

const shipmentTrackingSchema = (t: (key: string) => string) =>
  z.object({
    trackingCode: z.string().trim().min(1, t('shipmentTracking.validationRequired')),
  });

type ShipmentTrackingForm = z.infer<ReturnType<typeof shipmentTrackingSchema>>;

const ShipmentTrackingPage = () => {
  const { t } = useTranslation();
  const [searchCode, setSearchCode] = useState<string>('');

  const form = useForm<ShipmentTrackingForm>({
    resolver: zodResolver(shipmentTrackingSchema(t)),
    defaultValues: { trackingCode: '' },
  });

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['shipment-tracking', searchCode],
    queryFn: () => complaintService.getOrderTracking(searchCode!),
    enabled: !!searchCode,
    retry: false,
    staleTime: 0,
  });

  const onSubmit = (values: ShipmentTrackingForm) => {
    const trimmed = values.trackingCode.trim();
    if (!trimmed) return;

    if (trimmed === searchCode) {
      refetch();
    } else {
      setSearchCode(trimmed);
    }
  };

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
        goodsDescription: data?.data?.goods_description,
        paymentName: data?.data?.payment_name,
        deliveryDate: data?.data?.delivery_date,
        deliveryPostcode: data?.data?.delivery_postcode,
        deliveryUnitHeadPhone: data?.data?.delivery_unit_head_phone,
        deliveryUnitHead: data?.data?.delivery_unit_head,
        originPostOfficeName: data?.data?.origin_post_office_name,
        returnName: data?.data?.return_name,
        returnPhone: data?.data?.return_phone,
        returnAddress: data?.data?.return_address,
        deliveryUser: data?.data?.delivery_user,
        deliveryGoods: data?.data?.delivery_goods,
        deliveryName: data?.data?.delivery_name,
        originUnitHead: data?.data?.origin_unit_head,
        originUnitHeadPhone: data?.data?.origin_unit_head_phone,
        deliveryPostOfficeName: data?.data?.delivery_post_office_name,
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
      jorneyStatusDesc: item?.jorney_status_desc,
    })) ?? [];

  const complaintHistory: ComplaintHistoryItem[] = data?.data?.complaint_history ?? [];

  const isSearching = isLoading || isFetching;

  return (
    <div className='flex flex-col gap-4'>
      {/* Search form */}
      <Card className='p-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='mb-4'>
              <FormLabel>{t('common.search')}</FormLabel>
              <div className='flex flex-row items-start gap-2 mt-2'>
                <FormField
                  control={form.control}
                  name='trackingCode'
                  render={({ field }) => (
                    <FormItem className='flex-1 max-w-[30%]'>
                      <FormControl>
                        <InputSearch
                          {...field}
                          placeholder={t('shipmentTracking.placeholderTrackingCode')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ButtonLoading type='submit' loading={isSearching} className='shrink-0'>
                  {t('common.search')}
                </ButtonLoading>
              </div>
            </div>
          </form>
        </Form>
      </Card>

      {/* Empty state */}
      {!searchCode && (
        <Card className='p-4'>
          <EmptyData title={t('shipmentTracking.emptyPrompt')} icon={<IconNotData />} />
        </Card>
      )}

      {/* Loading state */}
      {searchCode && isSearching && (
        <Card className='p-4'>
          <EmptyData title={t('shipmentTracking.searching')} />
        </Card>
      )}

      {/* Error state */}
      {searchCode && !isSearching && isError && (
        <Card className='p-4'>
          <EmptyData title={t('common.trackingCodeNotFound')} />
        </Card>
      )}

      {/* Result: COMPLAINT lookup → hiển thị thẳng bảng lịch sử khiếu nại */}
      {searchCode && !isSearching && !isError && data?.data?.lookup_type === 'COMPLAINT' && (
        <div className='flex flex-col gap-2'>
          <h3 className='text-primary font-semibold text-base'>
            {t('journeyHistory.complaintHistory')}
          </h3>
          <ComplaintHistoryTab data={complaintHistory} />
        </div>
      )}

      {/* Result: default → hiển thị tab đầy đủ */}
      {searchCode &&
        !isSearching &&
        !isError &&
        orderDetail &&
        data?.data?.lookup_type !== 'COMPLAINT' && (
          <SearchShipmentTracking
            orderCode={searchCode}
            orderDetail={orderDetail}
            trackingHistory={trackingHistory}
            complaintHistory={complaintHistory}
            isLoading={isSearching}
          />
        )}
    </div>
  );
};

export default ShipmentTrackingPage;
