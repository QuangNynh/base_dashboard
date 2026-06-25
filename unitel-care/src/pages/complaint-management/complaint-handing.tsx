import { HeaderDetail } from '@/components/common/HeaderDetail';
import InformationComplaint from '@/components/pages/complaint-detail-handing/InformationComplaint';
import { PostOfficeHanding } from '@/components/pages/complaint-detail-handing/PostOfficeHanding';
import { PostOfficeHandingAwait } from '@/components/pages/complaint-detail-handing/PostOfficeHandingAwait';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STATUS_COMPLAINT } from '@/constants/status';
import { complaintService } from '@/services/complaintService';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { usePageLoading } from '@/hooks/usePageLoading';
import { useParams } from 'react-router-dom';
import PostOfficeHistoryTab from '../../components/pages/complaint-detail-handing/PostOfficeHistoryTab';
import RatingHistoryTab from '../../components/pages/complaint-detail-handing/RatingHistoryTab';
import type { ComplaintDetail } from '@/types/complaint-management';
import { TTVHEvaluate } from '@/components/pages/complaint-detail-handing/TTVHEvaluate';

interface RenderComponentProps {
  status?: string;
  data?: ComplaintDetail;
}

const RenderComponent = ({ status, data }: RenderComponentProps) => {
  switch (status) {
    case STATUS_COMPLAINT.WAITING:
    case STATUS_COMPLAINT.ASSIGNED:
      return <PostOfficeHandingAwait status={status} data={data} />;
    case STATUS_COMPLAINT.IN_PROGRESS:
    case STATUS_COMPLAINT.PROCESSED:
      return <PostOfficeHanding status={status} data={data} />;
    case STATUS_COMPLAINT.COMPLETED:
      return <TTVHEvaluate data={data} />;
    default:
      return null;
  }
};

const ComplaintHandingPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const tabTrigger = [
    {
      value: 'postOffice',
      labelKey: 'detailComplaint.tabPostOfficeHistory',
      component: <PostOfficeHistoryTab id={id} onDetail={() => {}} />,
    },
    {
      value: 'rating',
      labelKey: 'detailComplaint.tabRatingHistory',
      component: <RatingHistoryTab id={id} />,
    },
  ];

  const { data: dataDetail, isPending } = useQuery({
    queryKey: ['detail-complaint', id],
    queryFn: () => complaintService.getComplainDetail(id!),
    staleTime: 0,
  });

  usePageLoading(isPending);

  return (
    <div className='flex flex-col gap-4'>
      <HeaderDetail title={`${t('complaintHanding.title')}: ${dataDetail?.data?.complaint_code}`} />
      {dataDetail?.data && <InformationComplaint data={dataDetail?.data} />}
      <RenderComponent status={dataDetail?.data?.status} data={dataDetail?.data} />
      <Card className='p-4'>
        <Tabs defaultValue={tabTrigger[0].value}>
          <div className='border-b border-border'>
            <TabsList variant='line' className='py-5 gap-2'>
              {tabTrigger.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  <span className='px-2 py-0 text-base'>{t(tab.labelKey)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {tabTrigger.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default ComplaintHandingPage;
