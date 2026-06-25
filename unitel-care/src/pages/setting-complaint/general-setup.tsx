import { ErrorsCause } from '../../components/pages/general-setup/errors-cause';
import { ExtensionReasonPage } from '../../components/pages/general-setup/extension-reason-setup';

const GeneralSetup = () => {
  return (
    <div className='space-y-4'>
      <ExtensionReasonPage />
      <ErrorsCause />
    </div>
  );
};

export default GeneralSetup;
