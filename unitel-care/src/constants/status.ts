import type { PostOfficeActionStatus } from '@/types/complaint-management';

export const VersionStatus = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  REJECTED: 'REJECTED',
  SCHEDULED: 'SCHEDULED',
  ACTIVE: 'ACTIVE',
  STOPPED: 'STOPPED',
} as const;

export const STATUS_COMPLAINT = {
  ALL: 'ALL',
  WAITING: 'WAITING',
  ASSIGNED: 'ASSIGNED',
  IN_PROGRESS: 'IN_PROGRESS',
  PROCESSED: 'PROCESSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const STATUS = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type VersionStatusType = (typeof VersionStatus)[keyof typeof VersionStatus];
export const VersionStatusLabelKey: Record<VersionStatusType, string> = {
  [VersionStatus.DRAFT]: 'status.draft',
  [VersionStatus.PENDING_APPROVAL]: 'status.pendingApproval',
  [VersionStatus.REJECTED]: 'status.rejected',
  [VersionStatus.SCHEDULED]: 'status.scheduled',
  [VersionStatus.ACTIVE]: 'status.active',
  [VersionStatus.STOPPED]: 'status.stopped',
};

export const versionStatusOptions = Object.values(VersionStatus).map((value) => ({
  value,
  label: VersionStatusLabelKey[value],
}));

export type StatusType = (typeof STATUS)[keyof typeof STATUS];
export const STATUS_TRANSLATION_KEY: Record<StatusType, string> = {
  [STATUS.ALL]: 'status.all',
  [STATUS.ACTIVE]: 'status.active',
  [STATUS.INACTIVE]: 'status.inactive',
};

export const STATUS_OPTIONS = Object.values(STATUS).map((value) => ({
  value,
  label: STATUS_TRANSLATION_KEY[value],
}));

export type StatusComplaintType = (typeof STATUS_COMPLAINT)[keyof typeof STATUS_COMPLAINT];
export const STATUS_COMPLAINT_TRANSLATION_KEY: Record<StatusComplaintType, string> = {
  [STATUS_COMPLAINT.ALL]: 'status.all',
  [STATUS_COMPLAINT.WAITING]: 'status.waiting',
  [STATUS_COMPLAINT.ASSIGNED]: 'status.assigned',
  [STATUS_COMPLAINT.IN_PROGRESS]: 'status.inProgress',
  [STATUS_COMPLAINT.COMPLETED]: 'status.completed',
  [STATUS_COMPLAINT.CANCELLED]: 'status.cancelled',
  [STATUS_COMPLAINT.PROCESSED]: 'status.processed',
};

export const STATUS_COMPLAINT_COLOR: Record<StatusComplaintType, string> = {
  [STATUS_COMPLAINT.ALL]: '#6B7280',
  [STATUS_COMPLAINT.WAITING]: '#3B82F6',
  [STATUS_COMPLAINT.ASSIGNED]: '#A855F7',
  [STATUS_COMPLAINT.IN_PROGRESS]: '#F9A006',
  [STATUS_COMPLAINT.COMPLETED]: '#84CC16',
  [STATUS_COMPLAINT.CANCELLED]: '#EE0033',
  [STATUS_COMPLAINT.PROCESSED]: '#F9A006',
};

export const STATUS_COMPLAINT_OPTIONS = Object.values(STATUS_COMPLAINT).map((value) => ({
  value,
  label: STATUS_COMPLAINT_TRANSLATION_KEY[value],
}));

//===========================Quản lý biên bản =======================
export const STATUS_VIOLATION_CODE = {
  NOT_EXPLAINED: 100,
  CLOSED: 110,
  INCORRECT: 125,
  OPINION: 130,
  CANCELLED: 140,
  COMPLETED: 120,
  COMPENSATING: 150,
  COMPENSATED: 160,
  COMPENSATION_CANCELLED: 155,
};

export const STATUS_VIOLATION_TRANSLATION_KEY: Record<number, string> = {
  [STATUS_VIOLATION_CODE.NOT_EXPLAINED]: 'violationReportConclude.status.not_explained',
  [STATUS_VIOLATION_CODE.CLOSED]: 'violationReportConclude.status.closed',
  [STATUS_VIOLATION_CODE.INCORRECT]: 'violationReportConclude.status.incorrect',
  [STATUS_VIOLATION_CODE.OPINION]: 'violationReportConclude.status.opinion',
  [STATUS_VIOLATION_CODE.CANCELLED]: 'violationReportConclude.status.cancelled',
  [STATUS_VIOLATION_CODE.COMPLETED]: 'violationReportConclude.status.completed',
  [STATUS_VIOLATION_CODE.COMPENSATING]: 'violationReportConclude.status.compensating',
  [STATUS_VIOLATION_CODE.COMPENSATED]: 'violationReportConclude.status.compensated',
  [STATUS_VIOLATION_CODE.COMPENSATION_CANCELLED]:
    'violationReportConclude.status.compensation_cancelled',
};

export const STATUS_VIOLATION_OPTIONS = Object.values(STATUS_VIOLATION_CODE).map((code) => ({
  value: String(code),
  label: STATUS_VIOLATION_TRANSLATION_KEY[code],
}));

export const STATUS_DELETED = {
  ACTIVE: 'false',
  INACTIVE: 'true',
} as const;
export type StatusDeletedType = (typeof STATUS_DELETED)[keyof typeof STATUS_DELETED];
export const STATUS_DELETED_TRANSLATION_KEY: Record<StatusDeletedType, string> = {
  [STATUS_DELETED.ACTIVE]: 'status.active',
  [STATUS_DELETED.INACTIVE]: 'status.inactive',
};

export const STATUS_DELETED_OPTIONS = Object.values(STATUS_DELETED).map((value) => ({
  value,
  label: STATUS_DELETED_TRANSLATION_KEY[value],
}));

export const removeStatusPrefix = (status: string | undefined): string => {
  if (!status) return '';
  return status.replace(/^s/i, '');
};

export const getStatusLabel = (
  code: string | undefined,
  enumMap: Record<string, string> | undefined,
  fallback?: string
): string => {
  if (!code) return fallback ?? '';
  return enumMap?.[code.toUpperCase()] ?? fallback ?? code;
};

export const STATUS_CONFIG: Record<PostOfficeActionStatus, { label: string; className: string }> = {
  DONE: {
    label: 'detailComplaint.statusDone',
    className: 'bg-[#E2F7E1] text-[#20481F]',
  },
  PROCESSED: {
    label: 'detailComplaint.statusProcessed',
    className: 'bg-[#E9FCCB] text-[#3A5314]',
  },
  IN_PROGRESS: {
    label: 'detailComplaint.statusProcessing',
    className: 'bg-[#FFF4C6] text-[#7A360D]',
  },
  WAITING: {
    label: 'detailComplaint.statusWaiting',
    className: 'bg-[#DBE8FE] text-[#1E478A]',
  },
  COMPLETED: {
    label: 'detailComplaint.statusCompleted',
    className: 'bg-[#E2F7E1] text-[#20481F]',
  },
  ASSIGNED: {
    label: 'detailComplaint.statusAssigned',
    className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200',
  },
  CANCELLED: {
    label: 'status.cancelled',
    className: 'bg-[#FFE6E1] text-[#20481F]',
  },
};
//======================Quản lý Bồi thường ======================
export const STATUS_COMPENSATION = {
  COMPLETING: 100,
  PAYING: 200,
  PAID: 300,
} as const;

export type StatusCompensationType = (typeof STATUS_COMPENSATION)[keyof typeof STATUS_COMPENSATION];

export const STATUS_COMPENSATION_TRANSLATION_KEY: Record<StatusCompensationType, string> = {
  [STATUS_COMPENSATION.COMPLETING]: 'compensation.status.completing',
  [STATUS_COMPENSATION.PAYING]: 'compensation.status.paying',
  [STATUS_COMPENSATION.PAID]: 'compensation.status.paid',
};

export const STATUS_COMPENSATION_OPTIONS = Object.values(STATUS_COMPENSATION).map((code) => ({
  value: String(code),
  label: STATUS_COMPENSATION_TRANSLATION_KEY[code],
}));

export const CASE_COMPENSATION = {
  SUPPLEMENT: 'SUPPLEMENT',
  NEW: 'NEW',
};

export type CaseCompensationType = (typeof CASE_COMPENSATION)[keyof typeof CASE_COMPENSATION];

export const CASE_COMPENSATION_TRANSLATION_KEY: Record<CaseCompensationType, string> = {
  [CASE_COMPENSATION.SUPPLEMENT]: 'compensation.case.supplement',
  [CASE_COMPENSATION.NEW]: 'compensation.case.new',
};

export const ACTION_HISTORY_COMPENSATION = {
  COMPLETE: 'COMPLETE',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
};

export type ActionHistoryCompensationType =
  (typeof ACTION_HISTORY_COMPENSATION)[keyof typeof ACTION_HISTORY_COMPENSATION];

export const ACTION_HISTORY_COMPENSATION_TRANSLATION_KEY: Record<
  ActionHistoryCompensationType,
  string
> = {
  [ACTION_HISTORY_COMPENSATION.COMPLETE]: 'compensation.actionHistory.complete',
  [ACTION_HISTORY_COMPENSATION.PAYMENT_FAILED]: 'compensation.actionHistory.paymentFail',
  [ACTION_HISTORY_COMPENSATION.PAYMENT_SUCCESS]: 'compensation.actionHistory.paymentSuccess',
};
export const STATUS_PAYMENT_COMPENSATION = {
  SUCCESS: 'PAYMENT_SUCCESS',
  FAILED: 'PAYMENT_FAILED',
};

export type StatusPaymentCompensationType =
  (typeof STATUS_PAYMENT_COMPENSATION)[keyof typeof STATUS_PAYMENT_COMPENSATION];

export const STATUS_PAYMENT_COMPENSATION_KEY: Record<StatusPaymentCompensationType, string> = {
  [STATUS_PAYMENT_COMPENSATION.SUCCESS]: 'compensation.success',
  [STATUS_PAYMENT_COMPENSATION.FAILED]: 'compensation.failed',
};
