import { HeaderDetail } from '@/components/common/HeaderDetail';
import CreateComplaintForm from '@/components/pages/complaint-create';
import { usePageLoading } from '@/hooks/usePageLoading';
import { ROUTES } from '@/router/routes.config';
import { complaintService } from '@/services/complaintService';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

const EditComplaintPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: dataDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['detail-complaint', id],
    queryFn: () => complaintService.getComplainDetail(id!),
    staleTime: 0,
  });

  usePageLoading(isLoadingDetail);

  // Tự động set tab theo contact_type khi data load xong
  useEffect(() => {
    if (!dataDetail?.data?.contact_type) return;

    const contactType = dataDetail.data.contact_type;
    const tabValue = contactType === 'RECEIVER' ? 'receiver' : 'sender';

    const params = new URLSearchParams(searchParams);
    if (params.get('tab') !== tabValue) {
      params.set('tab', tabValue);
      setSearchParams(params, { replace: true });
    }
  }, [dataDetail, searchParams, setSearchParams]);

  return (
    <>
      <HeaderDetail
        title={t('createComplaint.titleEdit')}
        link={ROUTES.COMPLAINT_MANAGEMENT_LIST}
      />
      <CreateComplaintForm contactType='SENDER' data={dataDetail?.data} id={id} />
    </>
  );
};

export default EditComplaintPage;
