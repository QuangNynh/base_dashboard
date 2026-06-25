import { Badge } from '@/components/ui/badge';
import {
  ACTION_HISTORY_COMPENSATION,
  ACTION_HISTORY_COMPENSATION_TRANSLATION_KEY,
  STATUS,
  STATUS_COMPENSATION,
  STATUS_COMPENSATION_TRANSLATION_KEY,
  STATUS_PAYMENT_COMPENSATION,
  STATUS_PAYMENT_COMPENSATION_KEY,
  STATUS_TRANSLATION_KEY,
  STATUS_VIOLATION_CODE,
  STATUS_VIOLATION_TRANSLATION_KEY,
  VersionStatus,
  VersionStatusLabelKey,
  type ActionHistoryCompensationType,
  type StatusCompensationType,
  type StatusPaymentCompensationType,
} from '@/constants/status';
import { useTranslation } from 'react-i18next';

export type StatusType = (typeof STATUS)[keyof typeof STATUS];
export type VersionStatusType = (typeof VersionStatus)[keyof typeof VersionStatus];

const STATUS_VARIANT_CONFIG = {
  [VersionStatus.DRAFT]: {
    variant: 'outline' as const,
    className: 'border-yellow-200 text-yellow-800 bg-yellow-50 font-semibold',
  },
  [VersionStatus.PENDING_APPROVAL]: {
    variant: 'outline' as const,
    className: 'border-orange-200 text-orange-700 bg-orange-50 font-semibold',
  },
  [VersionStatus.REJECTED]: {
    variant: 'outline' as const,
    className: 'border-red-200 text-red-700 bg-red-50 font-semibold',
  },
  [VersionStatus.SCHEDULED]: {
    variant: 'outline' as const,
    className: 'border-blue-200 text-blue-700 bg-blue-50 font-semibold',
  },
  [VersionStatus.ACTIVE]: {
    variant: 'outline' as const,
    className: 'border-blue-200 text-blue-700 bg-blue-50 font-semibold',
  },
  [VersionStatus.STOPPED]: {
    variant: 'outline' as const,
    className: 'border-gray-200 text-gray-600 bg-gray-50 font-semibold',
  },
};

// Config cho Status (ACTIVE/INACTIVE)
const SIMPLE_STATUS_VARIANT_CONFIG = {
  [STATUS.ALL]: {
    variant: 'outline' as const,
    className: 'border-gray-200 text-gray-600 bg-gray-50',
  },
  [STATUS.ACTIVE]: {
    variant: 'outline' as const,
    className: 'border-green-200 text-green-700 bg-green-50',
  },
  [STATUS.INACTIVE]: {
    variant: 'outline' as const,
    className: 'border-red-200 text-red-700 bg-red-50',
  },
};

const VIOLATION_REPORT_STATUS_VARIANT_CONFIG: Record<number, { className: string }> = {
  [STATUS_VIOLATION_CODE.NOT_EXPLAINED]: {
    className: 'border-orange-200 text-orange-700 bg-orange-50',
  },
  [STATUS_VIOLATION_CODE.CLOSED]: { className: 'border-gray-200 text-gray-600 bg-gray-50' },
  [STATUS_VIOLATION_CODE.INCORRECT]: { className: 'border-red-200 text-red-700 bg-red-50' },
  [STATUS_VIOLATION_CODE.OPINION]: { className: 'border-blue-200 text-blue-700 bg-blue-50' },
  [STATUS_VIOLATION_CODE.CANCELLED]: { className: 'border-gray-200 text-gray-500 bg-gray-50' },
  [STATUS_VIOLATION_CODE.COMPLETED]: { className: 'border-green-200 text-green-700 bg-green-50' },
  [STATUS_VIOLATION_CODE.COMPENSATING]: {
    className: 'border-yellow-200 text-yellow-700 bg-yellow-50',
  },
  [STATUS_VIOLATION_CODE.COMPENSATED]: { className: 'border-green-200 text-green-700 bg-green-50' },
  [STATUS_VIOLATION_CODE.COMPENSATION_CANCELLED]: {
    className: 'border-red-200 text-red-600 bg-red-50',
  },
};

interface ViolationReportStatusBadgeProps {
  status: number;
}

export const ViolationReportStatusBadge = ({ status }: ViolationReportStatusBadgeProps) => {
  const { t } = useTranslation();
  const config = VIOLATION_REPORT_STATUS_VARIANT_CONFIG[status];
  const translationKey = STATUS_VIOLATION_TRANSLATION_KEY[status];

  if (!config || !translationKey) return null;

  return (
    <Badge variant='outline' className={config.className}>
      {t(translationKey)}
    </Badge>
  );
};

interface StatusVersionBadgeProps {
  status: VersionStatusType;
}

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusVersionBadge = ({ status }: StatusVersionBadgeProps) => {
  const { t } = useTranslation();
  const config = STATUS_VARIANT_CONFIG[status];
  const translationKey = VersionStatusLabelKey[status];

  if (!config || !translationKey) {
    return null;
  }

  return (
    <Badge variant={config.variant} className={config.className}>
      {t(translationKey)}
    </Badge>
  );
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { t } = useTranslation();
  const config = SIMPLE_STATUS_VARIANT_CONFIG[status];
  const translationKey = STATUS_TRANSLATION_KEY[status];

  if (!config || !translationKey) {
    return null;
  }

  return (
    <Badge variant={config.variant} className={config.className}>
      {t(translationKey)}
    </Badge>
  );
};

const COMPENSATION_STATUS_VARIANT_CONFIG: Record<StatusCompensationType, { className: string }> = {
  [STATUS_COMPENSATION.COMPLETING]: {
    className: 'border-yellow-200 text-yellow-700 bg-yellow-50',
  },
  [STATUS_COMPENSATION.PAYING]: {
    className: 'border-blue-200 text-blue-700 bg-blue-50',
  },
  [STATUS_COMPENSATION.PAID]: {
    className: 'border-green-200 text-green-700 bg-green-50',
  },
};

interface CompensationStatusBadgeProps {
  status: StatusCompensationType;
}

export const CompensationStatusBadge = ({ status }: CompensationStatusBadgeProps) => {
  const { t } = useTranslation();
  const config = COMPENSATION_STATUS_VARIANT_CONFIG[status];
  const translationKey = STATUS_COMPENSATION_TRANSLATION_KEY[status];

  if (!config || !translationKey) return null;

  return (
    <Badge variant='outline' className={config.className}>
      {t(translationKey)}
    </Badge>
  );
};

const ACTION_HISTORY_COMPENSATION_CONFIG: Record<
  ActionHistoryCompensationType,
  { className: string }
> = {
  [ACTION_HISTORY_COMPENSATION.COMPLETE]: {
    className: 'border-yellow-200 text-yellow-700 bg-yellow-50',
  },
  [ACTION_HISTORY_COMPENSATION.PAYMENT_FAILED]: {
    className: 'border-red-200 text-red-600 bg-red-50',
  },
  [ACTION_HISTORY_COMPENSATION.PAYMENT_SUCCESS]: {
    className: 'border-green-200 text-green-700 bg-green-50',
  },
};

interface ActionHistoryCompensationBadgeProps {
  status: ActionHistoryCompensationType;
}

export const ActionHistoryCompensationBadge = ({ status }: ActionHistoryCompensationBadgeProps) => {
  const { t } = useTranslation();
  const config = ACTION_HISTORY_COMPENSATION_CONFIG[status];
  const translationKey = ACTION_HISTORY_COMPENSATION_TRANSLATION_KEY[status];

  if (!config || !translationKey) return null;

  return (
    <Badge variant='outline' className={config.className}>
      {t(translationKey)}
    </Badge>
  );
};

const COMPENSATION_PAYMENT_STATUS_VARIANT_CONFIG: Record<
  StatusPaymentCompensationType,
  { className: string }
> = {
  [STATUS_PAYMENT_COMPENSATION.FAILED]: {
    className: 'border-yellow-200 text-yellow-700 bg-red-50',
  },
  [STATUS_PAYMENT_COMPENSATION.SUCCESS]: {
    className: 'border-green-200 text-green-700 bg-green-50',
  },
};

interface CompensationPaymentStatusBadgeProps {
  status: StatusPaymentCompensationType;
}

export const CompensationPaymentStatusBadge = ({ status }: CompensationPaymentStatusBadgeProps) => {
  const { t } = useTranslation();
  const config = COMPENSATION_PAYMENT_STATUS_VARIANT_CONFIG[status];
  const translationKey = STATUS_PAYMENT_COMPENSATION_KEY[status];

  if (!config || !translationKey) return null;

  return (
    <Badge variant='outline' className={config.className}>
      {t(translationKey)}
    </Badge>
  );
};
