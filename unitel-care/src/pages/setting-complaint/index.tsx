import TabListCustom from '@/components/common/TabListCustom';
import FeedbackCategorySetup from './feedback-category-setup';
import GeneralSetup from './general-setup';
import { AssignmentSetup } from './assignment-setup';
import WorkingTimeSetup from './working-time-setup';

const SettingComplaintManagement = () => {
  const tabTrigger = [
    {
      value: 'general',
      labelKey: 'settingComplaint.general', // i18n key
      component: <GeneralSetup />,
    },
    {
      value: 'feedback-category',
      labelKey: 'settingComplaint.feedbackCategory',
      component: <FeedbackCategorySetup />,
    },
    {
      value: 'assignment',
      labelKey: 'settingComplaint.assignment',
      component: <AssignmentSetup />,
    },
    {
      value: 'working-time',
      labelKey: 'settingComplaint.workingTime',
      component: <WorkingTimeSetup />,
    },
  ];
  return (
    <>
      <TabListCustom tabTrigger={tabTrigger} />
    </>
  );
};

export default SettingComplaintManagement;
