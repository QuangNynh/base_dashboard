import { FeedbackLevel1Page } from '../../components/pages/feedback-category-setup/feedback-level-1';
import { FeedbackLevel2Page } from '../../components/pages/feedback-category-setup/feedback-level-2';

const FeedbackCategorySetup = () => {
  return (
    <div className='space-y-4'>
      <FeedbackLevel1Page />
      <FeedbackLevel2Page />
    </div>
  );
};

export default FeedbackCategorySetup;
