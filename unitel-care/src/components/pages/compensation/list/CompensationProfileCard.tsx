import { MinutesFileList } from '@/components/pages/violation-report-conclude/MinutesFileList';
import { CompensationStatusBadge } from '@/components/common/StatusBadge';
import { Card } from '@/components/ui/card';
import type { StatusCompensationType } from '@/constants/status';
import type { MinutesDetailFile } from '@/types/violation-report-management';
import { useTranslation } from 'react-i18next';

export interface CompensationProfileCardData {
  createdAt?: string;
  createdUnit?: string;
  rootPostOffice?: string;
  violatingPostOffice?: string;
  violatingPerson?: string;
  minutesCode?: string;
  errorCode?: string;
  status?: StatusCompensationType;
  compensationProfileCode?: string;
  waybillCode?: string;
  content?: string;
  attachmentFile?: MinutesDetailFile[];
}

interface InfoRowProps {
  label: string;
  value?: string | null;
  children?: React.ReactNode;
}

const InfoRow = ({ label, value, children }: InfoRowProps) => (
  <div className='flex flex-wrap gap-1 text-[15px] text-[#44494D]'>
    <span className='shrink-0 font-semibold'>{label}:</span>
    {children ?? <span className='font-medium whitespace-break-spaces'>{value ?? '—'}</span>}
  </div>
);

interface Props {
  detail: CompensationProfileCardData;
}

export function CompensationProfileCard({ detail }: Props) {
  const { t } = useTranslation();

  return (
    <Card className='p-4'>
      <div className='border grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x'>
        {/* Col 1: Thông tin chung */}
        <div className='flex flex-col'>
          <div className='p-4 bg-[#F4FAFF] border-b'>
            <h4 className='font-semibold text-primary text-sm'>
              {t('compensation.detail.sectionGeneralInfo')}
            </h4>
          </div>
          <div className='flex flex-col p-4 gap-2'>
            <InfoRow label={t('compensation.detail.lblCreatedAt')} value={detail.createdAt} />
            <InfoRow label={t('compensation.detail.lblCreatedUnit')} value={detail.createdUnit} />
            <InfoRow
              label={t('compensation.detail.lblViolatingPostOffice')}
              value={detail.violatingPostOffice}
            />
            <InfoRow
              label={t('compensation.detail.lblViolatingPerson')}
              value={detail.violatingPerson}
            />
            <InfoRow label={t('postOffice.origin')} value={detail.rootPostOffice} />
          </div>
        </div>

        {/* Col 2: Thông tin hồ sơ */}
        <div className='flex flex-col'>
          <div className='p-4 bg-[#F4FAFF] border-b'>
            <h4 className='font-semibold text-primary text-sm'>
              {t('compensation.detail.sectionProfileInfo')}
            </h4>
          </div>
          <div className='flex flex-col p-4 gap-2'>
            <InfoRow label={t('compensation.detail.lblMinutesCode')} value={detail.minutesCode} />
            <InfoRow label={t('compensation.detail.lblErrorCode')} value={detail.errorCode} />
            <InfoRow label={t('compensation.detail.lblStatus')}>
              {detail.status !== undefined && <CompensationStatusBadge status={detail.status} />}
            </InfoRow>
            <InfoRow
              label={t('compensation.detail.lblCompensationProfileCode')}
              value={detail.compensationProfileCode}
            />
            <InfoRow label={t('compensation.detail.lblWaybillCode')} value={detail.waybillCode} />
          </div>
        </div>

        {/* Col 3: Nội dung */}
        <div className='flex flex-col'>
          <div className='p-4 bg-[#F4FAFF] border-b'>
            <h4 className='font-semibold text-primary text-sm'>
              {t('compensation.detail.sectionContent')}
            </h4>
          </div>
          <div className='flex flex-col p-4 gap-2'>
            <InfoRow label={t('compensation.detail.lblContent')} value={detail.content} />
            <InfoRow label={t('compensation.detail.lblAttachmentFile')}>
              <MinutesFileList files={detail.attachmentFile ?? []} />
            </InfoRow>
          </div>
        </div>
      </div>
    </Card>
  );
}
