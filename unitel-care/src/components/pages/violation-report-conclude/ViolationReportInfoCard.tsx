import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface InfoRowProps {
  label: string;
  value?: string | number | null;
  children?: React.ReactNode;
}

export const InfoRow = ({ label, value, children }: InfoRowProps) => (
  <div className='flex flex-wrap gap-1 text-[15px] text-[#44494D]'>
    <span className='shrink-0 font-semibold'>{label}:</span>
    {children ?? <span className='font-medium break-all'>{value ?? '—'}</span>}
  </div>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div className='flex flex-col'>
    <div className='p-4 bg-[#F4FAFF] border-b'>
      <h4 className='font-semibold text-primary text-sm'>{title}</h4>
    </div>
    <div className='flex flex-col p-4 gap-2'>{children}</div>
  </div>
);

interface Props {
  generalInfo: React.ReactNode;
  errorInfo: React.ReactNode;
  contentInfo: React.ReactNode;
}

const ViolationReportInfoCard = ({ generalInfo, errorInfo, contentInfo }: Props) => {
  const { t } = useTranslation();
  return (
    <Card className='p-4'>
      <div className='border grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x'>
        <Section title={t('violationReportConclude.sectionGeneralInfo')}>{generalInfo}</Section>
        <Section title={t('violationReportConclude.sectionErrorInfo')}>{errorInfo}</Section>
        <Section title={t('violationReportConclude.sectionContent')}>{contentInfo}</Section>
      </div>
    </Card>
  );
};

export default ViolationReportInfoCard;
