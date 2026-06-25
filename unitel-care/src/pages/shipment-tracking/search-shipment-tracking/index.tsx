import TabListCustom from '@/components/common/TabListCustom';
import { Card } from '@/components/ui/card';
import type {
  ComplaintHistoryItem,
  OrderActionHistoryItem,
  OrderDetail,
} from '@/types/complaint-management';
import ComplaintHistoryTab from './ComplaintHistoryTab';
import RecordsHistoryTab from './RecordsHistoryTab';
import InformationOrderShipmentTracking from './InformationOrderShipmentTracking';
import ListDataInformationOrderDetailTracking from './ListDataInformationOrderDetailTracking';
import { t } from 'i18next';

interface Props {
  orderCode: string;
  orderDetail: OrderDetail;
  trackingHistory: OrderActionHistoryItem[];
  complaintHistory: ComplaintHistoryItem[];
  isLoading?: boolean;
}

const SearchShipmentTracking = ({
  orderCode,
  orderDetail,
  trackingHistory,
  complaintHistory,
  isLoading,
}: Props) => {
  const tabTrigger = [
    {
      value: 'order-info',
      labelKey: 'journeyHistory.infoOrder',
      component: (
        <div className='flex flex-col gap-4 mt-4'>
          <InformationOrderShipmentTracking data={orderDetail} />
          <Card className='p-4'>
            <h4 className='font-semibold text-primary '>{t('journeyHistory.trip')}</h4>
            <ListDataInformationOrderDetailTracking data={trackingHistory} isLoading={isLoading} />
          </Card>
        </div>
      ),
    },
    {
      value: 'complaint-history',
      labelKey: 'journeyHistory.complaintHistory',
      component: <ComplaintHistoryTab data={complaintHistory} />,
    },
    {
      value: 'records-history',
      labelKey: 'journeyHistory.minutesHistory',
      component: <RecordsHistoryTab orderCode={orderCode} />,
    },
  ];

  return <TabListCustom tabTrigger={tabTrigger} />;
};

export default SearchShipmentTracking;
