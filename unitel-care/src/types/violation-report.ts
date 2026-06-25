import type { MinutesDetailFile } from './violation-report-management';

export interface ViolationReportGeneralFilter {
  employee?: string;
  branch?: string[];
}

export interface ViolationReportGeneralRow {
  id: number;
  employee_id: number;
  employee_code: string;
  employee_name: string;
  assigned_branches: Array<{
    branch_code: string;
    branch_name: string;
    branch_id: number;
  }>;
}

export interface ViolationErrorGeneralListResponse {
  data: {
    page_data: ViolationReportGeneralRow[];
    pagination: {
      totalPages: number;
      totalElements: number;
      page: number;
      size: number;
    };
  };
}
export interface ViolationErrorDetailData {
  mistakeGroupId: number | string;
  mistakeCode: string;
  mistakeDescription: string;
  processExpiredTime: number;
  concludeExpiredTime: number;
  isAutoClose: boolean;
  isUnique: boolean;
  isCompensatory: boolean;
  individualPenaltyScore: number;
  moneyPenalty: number;
  individualBonusScore: number;
  managerPenaltyScore: number;
  agencyPenaltyScore: number;
}

export interface ViolationErrorDetailRow {
  id: number;
  mistakeGroupCode: string;
  mistakeGroupName: string;
  mistakeCode: string;
  mistakeName: string;
  mistakeDescription: string;
  processExpiredTime: number;
  concludeExpiredTime: number;
  isAutoClose: boolean;
  isUnique: boolean;
  isCompensatory: boolean;
  individualPenaltyScore: number;
  moneyPenalty: number;
  individualBonusScore: number;
  managerPenaltyScore: number;
  agencyPenaltyScore: number;
  effectiveFrom: string; // ISO datetime
  effectiveTo: string; // ISO datetime
}

export interface ViolationErrorDetailListResponse {
  data: {
    page_data: ViolationErrorDetailRow[];
    pagination: {
      totalPages: number;
      totalElements: number;
      page: number;
      size: number;
    };
  };
}

export interface ViolationDetailErrorDetailData {
  mistakeGroup: {
    code: string;
    name: string;
  };
  mistakeInfo: {
    tenant: number;
    createdAt: string;
    createdBy: {
      id: string;
      username: string;
      fullName: string;
      tenantId: number;
      locale: string;
      postCode: string;
    };
    createdByUsername: string;
    updatedAt: string;
    updatedByUsername: string;
    id: number;
    mistakeGroupId: number;
    mistakeCode: string;
    mistakeDescription: string;
    processExpiredTime: number;
    concludeExpiredTime: number;
    isAutoClose: boolean;
    isUnique: boolean;
    isCompensatory: boolean;
    individualPenaltyScore: number;
    moneyPenalty: number;
    individualBonusScore: number;
    managerPenaltyScore: number;
    agencyPenaltyScore: number;
    effectiveFrom: number[]; // hoặc [number, number, number, number, number, number] nếu API luôn cố định
    effectiveTo: number[]; // tương tự
    is_deleted: boolean;
  };
}

export interface CreateMinutesItem {
  itemType: string;
  itemCode: string;
  rootPostOfficeId: number;
  rootPostOfficeCode: string;
  rootPostOfficeName: string;
  loadCode: string;
  complaintCodes: string;
}

export interface CreateMinutesViolatingPerson {
  personId: number;
  personCode: string;
  personName: string;
}

export interface CreateMinutesRequest {
  mistakeId: number;
  targetBranchId: string;
  targetPostOfficeId: string;
  refMinutesCode?: string;
  content: string;
  items: CreateMinutesItem[];
  createdViolatingPersons: CreateMinutesViolatingPerson[];
  attachedFiles: MinutesDetailFile[];
}

export interface CreateMinutesResponse {
  data: {
    id: number;
    minutesCode: string;
  };
  success: boolean;
}

export interface ViolationHistoryErrorDetailData {
  id: number;
  mistakeGroupId: number;
  mistakeGroupCode: string;
  mistakeGroupName: string;
  mistakeCode: string;
  mistakeDescription: string;
  processExpiredTime: number;
  concludeExpiredTime: number;
  isAutoClose: boolean;
  isUnique: boolean;
  isCompensatory: boolean;
  individualPenaltyScore: number;
  moneyPenalty: number;
  individualBonusScore: number;
  managerPenaltyScore: number;
  agencyPenaltyScore: number;
  effectiveFrom: string;
  effectiveTo: string;
  updatedAt: string;
  updatedByUsername: string;
}

export interface ViolationUserBranchData {
  employee_id: number;
  employee_code: string;
  employee_name: string;
  assigned_branches: Array<{
    branch_id: number;
    branch_code: string;
    branch_name: string;
  }>;
}

export interface BranchUnConfigData {
  departmentId: string;
  code: string;
  name: string;
  parentDepartmentId: string;
  parentDepartmentCode: string;
}

export interface ProcessExplainViolationData {
  minutesId?: number;
  content?: string;
  attachedFiles?: {
    fileName?: string;
    url?: string;
    fileType?: string;
  }[];
  confirmType?: string;
  violatedUsers?: {
    userId?: number;
    staffCode?: string;
    fullName?: string;
  }[]; // có khi là giải trình biên bản đến
}

export interface DataViolatedOffice {
  id: string;
  violatedOffice: {
    postId: number | string;
    postCode: string;
    postName: string;
  };
  note: string;
  compensationRatio?: number | string;
  files: Array<{
    fileName: string;
    url: string;
    fileType: string;
  }>;
  violatedUsers: Array<{
    userId: number | string;
    staffCode: string;
    fullName: string;
  }>;
  confirmYesNo: string;
  branch?: {
    postId?: number | string;
    postCode?: string;
    postName?: string;
  };
}

export interface ViolationReportConcludeData {
  minutesId: number;
  content: string;
  attachedFiles: {
    fileName: string;
    url: string;
    fileType: string;
  }[];
  confirmType: 'YES' | 'NO'; // thêm giá trị nếu cần
  items: {
    violatedOffice: {
      postId: number | string;
      postCode: string;
      postName: string;
    };
    note: string;
    compensationRatio?: number | string;
    attachedFiles: {
      fileName: string;
      url: string;
      fileType: string;
    }[];
    violatedUsers: {
      userId: number | string;
      staffCode: string;
      fullName: string;
    }[];
  }[];
}
