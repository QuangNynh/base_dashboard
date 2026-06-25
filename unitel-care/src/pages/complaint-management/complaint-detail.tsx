import { HeaderDetail } from '@/components/common/HeaderDetail';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { complaintService } from '@/services/complaintService';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import InformationComplaint from '../../components/pages/complaint-detail-handing/InformationComplaint';
import PostOfficeHistoryTab from '../../components/pages/complaint-detail-handing/PostOfficeHistoryTab';
import RatingHistoryTab from '../../components/pages/complaint-detail-handing/RatingHistoryTab';
import { usePageLoading } from '@/hooks/usePageLoading';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { ComplaintDetailResponse } from '@/types/complaint-management';
import type { AxiosError } from 'axios';

const ComplaintDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const tabTrigger = [
    {
      value: 'postOffice',
      labelKey: 'detailComplaint.tabPostOfficeHistory',
      component: <PostOfficeHistoryTab id={id} />,
    },
    {
      value: 'rating',
      labelKey: 'detailComplaint.tabRatingHistory',
      component: <RatingHistoryTab id={id} />,
    },
  ];

  const {
    data: dataDetail,
    isLoading,
    error,
  } = useQuery<ComplaintDetailResponse, AxiosError<{ message: string }>>({
    queryKey: ['detail-complaint', id],
    queryFn: () => complaintService.getComplainDetail(id!),
    staleTime: 0,
  });

  useEffect(() => {
    if (error) {
      navigate(-1);
      toast.error(error.response?.data.message || t('messages.error'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, navigate]);

  usePageLoading(isLoading);

  return (
    <div className='flex flex-col gap-4'>
      <HeaderDetail title={`${t('detailComplaint.title')}: ${dataDetail?.data?.complaint_code}`} />
      {dataDetail?.data && <InformationComplaint data={dataDetail?.data} />}
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

export default ComplaintDetailPage;
