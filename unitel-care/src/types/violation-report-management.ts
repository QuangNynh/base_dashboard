export interface ViolationReportListItem {
  id?: number;
  minutesCode?: string;
  createdAt?: string;
  createdBranchId?: string;
  createdBranchName?: string;
  createdPostOfficeId?: string;
  createdPostOfficeName?: string;
  createdPostOfficeCode?: string;
  createdByEmployeeCode?: string;
  createdByEmployeeName?: string;
  targetBranchId?: string;
  targetBranchName?: string;
  targetPostOfficeId?: string;
  targetPostOfficeName?: string;
  targetPostOfficeCode?: string;
  violatingPostOfficeName?: string;
  refMinutesCode?: string;
  status: number;
  mistakeId: number;
  mistakeCode?: string;
  mistakeDescription?: string;
  itemCodes?: string;
  createdViolatingPersons?: string;
  remainingExplainSeconds?: number;
  remainingConcludeSeconds?: number;
}

export interface ViolationReportListResponse {
  success: boolean;
  data: {
    pagination: {
      limit: number;
      totalElements: number;
      totalPages: number;
      currentPage: number;
    };
    page_data: ViolationReportListItem[];
  };
}

export interface ViolationReportQueryParams extends Omit<
  ViolationReportFilterData,
  'status' | 'mistakeCode' | 'postOfficeId'
> {
  page?: number;
  size?: number;
  status?: string;
  mistakeCode?: string;
  postOfficeId?: string;
}

export interface MinutesDetailItem {
  itemType?: string;
  itemCode?: string;
  rootPostOfficeId?: number;
  rootPostOfficeCode?: string;
  rootPostOfficeName?: string;
  loadCode?: string;
  complaintCodes?: string;
}

export interface MinutesDetailViolatingPerson {
  personId?: number;
  personCode?: string;
  personName?: string;
}

export interface MinutesDetailFile {
  fileName: string;
  url: string;
  fileType: string;
}

export interface MinutesDetailActionHistory {
  id?: number;
  actionBranchName?: string;
  actionPostOfficeName?: string;
  actorName?: string;
  actionType?: string;
  content?: string;
  files?: MinutesDetailFile[];

  fromStatus?: number;
  toStatus?: number;
  actorType?: string;
  actorId?: number;
  actorCode?: string;

  actorPostOfficeId?: number;
  actorPostOfficeCode?: string;
  actorPostOfficeName?: string;
  createdAt?: string;
}

export interface MinutesDetailExplainHistory {
  id?: number;
  minutesId?: number;
  processType?: string;
  actorId?: number;
  actorCode?: string;
  actorPostOfficeId?: number;
  actorPostOfficeCode?: string;
  actorPostOfficeName?: string;
  decision?: string;
  content?: string;
  attachedFiles?: MinutesDetailFile[];
  createdAt?: string;
  createdByUsername?: string;
  updatedAt?: string;
  updatedByUsername?: string;
}

export interface MinutesDetailData {
  id?: number;
  minutesCode?: string;
  refMinutesCode?: string;
  status?: number;
  createdAt?: string;
  createdPostOfficeId?: string;
  createdPostOfficeCode?: string;
  createdPostOfficeName?: string;
  createdBranchId?: string;
  createdBranchName?: string;
  createdByEmployeeId?: string;
  createdByEmployeeCode?: string;
  createdByEmployeeName?: string;
  targetBranchId?: string;
  targetPostOfficeId?: string;
  targetPostOfficeCode?: string;
  targetPostOfficeName?: string;
  targetBranchName?: string;
  mistakeId?: number;
  mistakeCode?: string;
  mistakeDescription?: string;
  content?: string;
  createdViolatingPersons?: MinutesDetailViolatingPerson[]; // người vi phạm
  attachedFiles?: MinutesDetailFile[];
  actions?: MinutesDetailActionHistory[]; // lịch sử tác động

  items?: MinutesDetailItem[]; // danh sách đơn hàng
  minutesProcessHistories?: MinutesDetailExplainHistory[]; // Lịch sử giải trình
  minutesProcessViolatingHistories?: MinutesProcessViolation[]; // Đơn vị vi phạm
  isCompensatory?: boolean;
  explainExpiredAt?: string;
  concludeExpiredAt?: string;
}

export interface MinutesDetailResponse {
  success: boolean;
  data: MinutesDetailData;
}

export interface ViolationReportFilterData {
  keyword?: string;
  fromDate?: string;
  toDate?: string;
  branchId?: string;
  postOfficeId?: string[];
  status?: number[];
  mistakeCode?: string[];
}

export interface MinutesProcessViolation {
  actorPostOfficeId?: number;
  actorPostOfficeCode?: string;
  actorPostOfficeName?: string;
  branch?: {
    postId?: number;
    postCode?: string;
    postName?: string;
  };
  violatingUsers?: {
    userId?: number;
    staffCode?: string;
    fullName?: string;
  }[];
  content?: string;
  confirmYesNo?: string;
  compensationRatio?: number;
  attachedFiles?: MinutesDetailFile[];
}

export interface ViolationUnitItem {
  postOffice: string;
  content: string;
  individual: string;
  branchName?: string;
  isCorrect: string;
  attachedFiles?: MinutesDetailFile[];
  compensationRate: string;
}

export interface ViolationRateReportItem {
  zone?: string;
  branchId?: string;
  branchName?: string;
  postOfficeId?: string;
  postOfficeName?: string;
  newIncoming?: number;
  closedIncoming?: number;
  doneIncoming?: number;
  wrongIncoming?: number;
  opinionIncoming?: number;
  cancelledIncoming?: number;
  compensatingIncoming?: number;
  cancelCompIncoming?: number;
  compensatedIncoming?: number;
  newOutgoing?: number;
  closedOutgoing?: number;
  doneOutgoing?: number;
  wrongOutgoing?: number;
  opinionOutgoing?: number;
  cancelledOutgoing?: number;
  compensatingOutgoing?: number;
  cancelCompOutgoing?: number;
  compensatedOutgoing?: number;
  explainTotal?: number;
  explainOnTime?: number;
  explainOverdue?: number;
  explainOverdueRate?: number;
  explainOnTimeRate?: number;
  concludeTotal?: number;
  concludeOnTime?: number;
  concludeOverdue?: number;
  concludeOverdueRate?: number;
  concludeOnTimeRate?: number;
  totalPenaltyScore?: number;
  totalBonusScore?: number;
}

export interface ViolationRateReportQueryParams {
  dateFrom?: string;
  dateTo?: string;
  branchId?: string;
  postOfficeIds?: string[];
  // page?: number;
  // size?: number;
}

export interface ViolationRateReportListResponse {
  success: boolean;
  // data: {
  //   pagination: {
  //     limit: number;
  //     totalElements: number;
  //     totalPages: number;
  //     currentPage: number;
  //   };
  //   page_data: ViolationRateReportItem[];
  // };
  data: ViolationRateReportItem[];
}
