export const PostOfficeType = {
  ORIGIN: 'ORIGIN',
  DELIVERY: 'DELIVERY',
  CURRENT: 'CURRENT',
} as const;

export type PostOfficeType = (typeof PostOfficeType)[keyof typeof PostOfficeType];
export const PostOfficeTypeLabelKey: Record<PostOfficeType, string> = {
  [PostOfficeType.ORIGIN]: 'postOffice.origin',
  [PostOfficeType.DELIVERY]: 'postOffice.delivery',
  [PostOfficeType.CURRENT]: 'postOffice.current',
};

export const postOfficeOptions = Object.values(PostOfficeType).map((value) => ({
  value,
  label: PostOfficeTypeLabelKey[value],
}));

export const COMPLAINT_TYPES = {
  ALL: 'ALL',
  INCOMING: 'INCOMING',
  OUTCOMING: 'OUTCOMING',
} as const;
export type ComplaintType = (typeof COMPLAINT_TYPES)[keyof typeof COMPLAINT_TYPES];

export const COMPLAINT_TYPE_LABEL_KEY: Record<ComplaintType, string> = {
  [COMPLAINT_TYPES.ALL]: 'options.all',
  [COMPLAINT_TYPES.INCOMING]: 'options.incoming',
  [COMPLAINT_TYPES.OUTCOMING]: 'options.outcoming',
};
export const COMPLAINT_TYPE_OPTIONS = Object.values(COMPLAINT_TYPES).map((value) => ({
  value,
  label: COMPLAINT_TYPE_LABEL_KEY[value],
}));

export const CHANNEL_TYPES = {
  ALL: 'ALL',
  // WEB_APP_CUSTOMER: 'WEB_APP_CUSTOMER',
  HOTLINE: 'HOTLINE',
  MAIL: 'MAIL',
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
  WEBSITE: 'WEBSITE',
  // INTERNAL_SYSTEM: 'INTERNAL_SYSTEM',
  // POST_OFFICE_CHANNEL: 'POST_OFFICE_CHANNEL',
};

export const CHANNEL_TYPES_NO_ALL = {
  // WEB_APP_CUSTOMER: 'WEB_APP_CUSTOMER',
  HOTLINE: 'HOTLINE',
  MAIL: 'MAIL',
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
  WEBSITE: 'WEBSITE',
};

export type ChannelType = (typeof CHANNEL_TYPES)[keyof typeof CHANNEL_TYPES];

export const CHANNEL_TYPE_LABEL_KEY: Record<ChannelType, string> = {
  [CHANNEL_TYPES.ALL]: 'options.all',
  // [CHANNEL_TYPES.WEB_APP_CUSTOMER]: 'options.webAppCustomer',
  [CHANNEL_TYPES.WEBSITE]: 'options.website',
  [CHANNEL_TYPES.SOCIAL_MEDIA]: 'options.socialMedia',
  [CHANNEL_TYPES.MAIL]: 'options.mail',
  [CHANNEL_TYPES.HOTLINE]: 'options.hotline',
  // [CHANNEL_TYPES.INTERNAL_SYSTEM]: 'options.internalSystem',
  // [CHANNEL_TYPES.POST_OFFICE_CHANNEL]: 'options.postOfficeChannel',
};
export const CHANNEL_TYPE_LABEL_KEY_CREATE: Record<ChannelType, string> = {
  [CHANNEL_TYPES.ALL]: 'options.all',
  // [CHANNEL_TYPES.WEB_APP_CUSTOMER]: 'options.webAppCustomer',
  [CHANNEL_TYPES.WEBSITE]: 'options.website',
  [CHANNEL_TYPES.SOCIAL_MEDIA]: 'options.socialMedia',
  [CHANNEL_TYPES.MAIL]: 'options.mail',
  [CHANNEL_TYPES.HOTLINE]: 'options.hotline',
  // [CHANNEL_TYPES.INTERNAL_SYSTEM]: 'options.internalSystem',
  // [CHANNEL_TYPES.POST_OFFICE_CHANNEL]: 'options.postOfficeChannel',
};
export const CHANNEL_TYPES_OPTIONS = Object.values(CHANNEL_TYPES)
  .filter((value) => value in CHANNEL_TYPE_LABEL_KEY)
  .map((value) => ({
    value,
    label: CHANNEL_TYPE_LABEL_KEY[value],
  }));
export const CHANNEL_TYPES_NO_ALL_OPTIONS = Object.values(CHANNEL_TYPES_NO_ALL).map((value) => ({
  value,
  label: CHANNEL_TYPE_LABEL_KEY[value],
}));
export const CHANNEL_TYPES_NO_ALL_OPTIONS_CREATE = Object.values(CHANNEL_TYPES_NO_ALL).map(
  (value) => ({
    value,
    label: CHANNEL_TYPE_LABEL_KEY_CREATE[value],
  })
);
export const SEVERITY_TYPES = {
  NORMAL: 'NORMAL',
  URGENT: 'URGENT',
  UNIQUE: 'UNIQUE',
  TIMER: 'TIMER',
} as const;
export type SeverityType = (typeof SEVERITY_TYPES)[keyof typeof SEVERITY_TYPES];

export const SEVERITY_TYPE_LABEL_KEY: Record<SeverityType, string> = {
  [SEVERITY_TYPES.NORMAL]: 'options.normal',
  [SEVERITY_TYPES.URGENT]: 'options.urgent',
  [SEVERITY_TYPES.UNIQUE]: 'options.unique',
  [SEVERITY_TYPES.TIMER]: 'options.timer',
};
export const SEVERITY_TYPES_OPTIONS = Object.values(SEVERITY_TYPES).map((value) => ({
  value,
  label: SEVERITY_TYPE_LABEL_KEY[value],
}));

export const DEADLINE_STATUS = {
  ALL: 'ALL',
  IN_PROGRESS: 'IN_PROGRESS',
  NEAR_DEADLINE: 'NEAR_DEADLINE',
  OVERDUE: 'OVERDUE',
} as const;
export type DeadlineStatus = (typeof DEADLINE_STATUS)[keyof typeof DEADLINE_STATUS];

export const DEADLINE_STATUS_LABEL_KEY: Record<DeadlineStatus, string> = {
  [DEADLINE_STATUS.ALL]: 'options.all',
  [DEADLINE_STATUS.IN_PROGRESS]: 'options.inProgress',
  [DEADLINE_STATUS.NEAR_DEADLINE]: 'options.nearDeadline',
  [DEADLINE_STATUS.OVERDUE]: 'options.overdue',
};
export const DEADLINE_STATUS_OPTIONS = Object.values(DEADLINE_STATUS).map((value) => ({
  value,
  label: DEADLINE_STATUS_LABEL_KEY[value],
}));

export const VIOLATION_ACTION_TYPE = {
  CREATE: 'CREATE',
  AUTO_CLOSE: 'AUTO_CLOSE',
  EXPIRE_CONFIRM: 'EXPIRE_CONFIRM',
  COMPLETE: 'COMPLETE',
  OPINION: 'OPINION',
  CANCEL: 'CANCEL',
  MARK_WRONG: 'MARK_WRONG',
  TTVH_CORRECT: 'TTVH_CORRECT',
  TTVT_WRONG: 'TTVT_WRONG',
  COMPENSATION_START: 'COMPENSATION_START',
  COMPENSATION_PROCESSING: 'COMPENSATION_PROCESSING',
  COMPENSATION_DONE: 'COMPENSATION_DONE',
  COMPENSATION_CANCEL: 'COMPENSATION_CANCEL',
} as const;

export type ViolationActionType =
  (typeof VIOLATION_ACTION_TYPE)[keyof typeof VIOLATION_ACTION_TYPE];

export const VIOLATION_ACTION_TYPE_LABEL_KEY: Record<ViolationActionType, string> = {
  [VIOLATION_ACTION_TYPE.CREATE]: 'violationReportConclude.actionType.create',
  [VIOLATION_ACTION_TYPE.AUTO_CLOSE]: 'violationReportConclude.actionType.autoClose',
  [VIOLATION_ACTION_TYPE.EXPIRE_CONFIRM]: 'violationReportConclude.actionType.expireConfirm',
  [VIOLATION_ACTION_TYPE.COMPLETE]: 'violationReportConclude.actionType.complete',
  [VIOLATION_ACTION_TYPE.OPINION]: 'violationReportConclude.actionType.opinion',
  [VIOLATION_ACTION_TYPE.CANCEL]: 'violationReportConclude.actionType.cancel',
  [VIOLATION_ACTION_TYPE.MARK_WRONG]: 'violationReportConclude.actionType.markWrong',
  [VIOLATION_ACTION_TYPE.TTVH_CORRECT]: 'violationReportConclude.actionType.ttvhCorrect',
  [VIOLATION_ACTION_TYPE.TTVT_WRONG]: 'violationReportConclude.actionType.ttvtWrong',
  [VIOLATION_ACTION_TYPE.COMPENSATION_START]:
    'violationReportConclude.actionType.compensationStart',
  [VIOLATION_ACTION_TYPE.COMPENSATION_PROCESSING]:
    'violationReportConclude.actionType.compensationStart',
  [VIOLATION_ACTION_TYPE.COMPENSATION_DONE]: 'violationReportConclude.actionType.compensationDone',
  [VIOLATION_ACTION_TYPE.COMPENSATION_CANCEL]:
    'violationReportConclude.actionType.compensationCancel',
};
