import { HeaderDetail } from '@/components/common/HeaderDetail';
import CreateComplaintForm from '@/components/pages/complaint-create';
import { ROUTES } from '@/router/routes.config';
import { useTranslation } from 'react-i18next';

const CreateComplaintPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <HeaderDetail
        title={t('createComplaint.titleCreate')}
        link={ROUTES.COMPLAINT_MANAGEMENT_LIST}
      />
      <CreateComplaintForm contactType='SENDER' />
    </>
  );
};

export default CreateComplaintPage;
