import TabListCustom from '@/components/common/TabListCustom';
import GeneralSetup from './general';
import ErrorCodeSetup from './error-code';

const ViolationReportConfig = () => {
  const tabTrigger = [
    {
      value: 'general',
      labelKey: 'violationReport.general',
      component: <GeneralSetup />,
    },
    {
      value: 'error-config',
      labelKey: 'violationReport.errorConfig',
      component: <ErrorCodeSetup />,
    },
  ];

  return (
    <>
      <TabListCustom tabTrigger={tabTrigger} />
    </>
  );
};

export default ViolationReportConfig;
