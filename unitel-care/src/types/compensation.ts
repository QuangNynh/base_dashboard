import type { MinutesDetailFile } from './violation-report-management';
import type { Pagination } from './complaint-management';
export interface CompensationListFilterData {
  fromDate?: string;
  toDate?: string;
  status?: number[];
  keyword?: string;
  postOfficeIds?: string[];
}

export interface CompensationListQueryParams {
  page?: number;
  size?: number;
  fromDate?: string;
  toDate?: string;
  status?: string;
  keyword?: string;
  postOfficeIds?: string;
}

export interface CompensationListResponse {
  success: boolean;
  data: {
    pagination: {
      limit: number;
      totalElements: number;
      totalPages: number;
      currentPage: number;
    };
    page_data: CompensationListItem[];
  };
}

export interface CompensationMoneyFilterParams {
  fromDate?: string;
  toDate?: string;
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
  paymentStatus?: string;
  postOfficeIds?: string;
}

export interface CompensationListItem {
  id: string | number;
  compensationCode?: string;
  minutesCode?: string;
  itemCode?: string;
  itemType?: string;
  status?: number;
  caseType?: string;
  violatingPostOfficeSummary?: string;
  createdPostOfficeCode?: string;
  createdPostOfficeName?: string;
  rootPostOfficeCode?: string;
  rootPostOfficeName?: string;
  goodsValue?: number;
  createdAt?: string;
}

export interface CompensationRateItem {
  id: number;
  compensationCaseId: number;
  postOfficeId: string;
  postOfficeCode: string;
  postOfficeName: string;
  compensationRatio: number;
  compensationAmount: number;
  createdAt: string;
}

export interface CompensationActionHistory {
  id: number;
  compensationCaseId: number;
  actionType: string;
  caseType: string;
  actorId: number;
  actorCode: string;
  actorName: string;
  actorPostOfficeId: string;
  actorPostOfficeCode: string;
  actorPostOfficeName: string;
  content: string;
  files: MinutesDetailFile[];
  createdAt: string;
}

export interface CompensationDetailData {
  id: number;
  compensationCode: string;
  minutesId: number;
  minutesCode: string;
  minutesContent: string;
  minutesFiles: MinutesDetailFile[];
  violatingPostOfficeSummary: string;
  violatingPersonSummary: string;
  mistakeId: number;
  mistakeCode: string;
  mistakeDescription: string;
  minutesItemId: number;
  itemType: string;
  itemCode: string;
  caseType: string;
  status: number;
  createdPostOfficeId: string;
  createdPostOfficeCode: string;
  createdPostOfficeName: string;
  rootPostOfficeId: string;
  rootPostOfficeCode: string;
  rootPostOfficeName: string;
  goodsValue: number;
  invoiceValue: number;
  codAmount: number;
  serviceName: string;
  vasName: string[];
  goodsContent: string;
  customerCode: number;
  customerName: string;
  customerIdentityNo: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  bankName: string;
  bankCode: string;
  bankAccountNo: string;
  beneficiaryName: string;
  paymentFailedReason: string;
  debitAccountNo: string;
  documentFiles: MinutesDetailFile[];
  bcgCompensationAmount: number;
  bcgCompensationContent: string;
  createdAt: string;
  violatingPostOffices?: CompensationRateItem[];
  actionHistories?: CompensationActionHistory[];
}
export interface CompensationDetailResponse {
  success: boolean;
  data: CompensationDetailData;
}

export interface CompleteCompensationDataRequest {
  goodsValue?: number;
  invoiceValue?: number;
  codAmount?: number;
  serviceName?: string;
  goodsContent?: string;
  documentFiles?: MinutesDetailFile[];
  bcgCompensationAmount?: number;
  bcgCompensationContent?: string;
  customerCode?: number;
  customerName?: string;
  customerIdentityNo?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  bankName?: string;
  bankCode?: string;
  bankAccountNo?: string;
  beneficiaryName?: string;
  debitAccountNo?: string;
}

export interface CompensationMoneyResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: CompensationMoneyItem[];
  };
}

export interface CompensationMoneyItem {
  id: number;
  compensationCode: string;
  minutesCode: string;
  itemCode: string;
  itemType: string;
  status: number;
  caseType: string;
  customerName: string;
  beneficiaryName: string;
  bankName: string;
  bankAccountNo: string;
  createdAt: string;
  paymentStatus?: string;
  rootPostOfficeName?: string;
  rootPostOfficeCode?: string;
  attachedFiles?: MinutesDetailFile[];
}

export interface BankListItem {
  bankCode: string;
  bankName: string;
}

export interface BankOption {
  value: string;
  label: string;
}

export interface ConfirmPaymentSuccessData {
  compensationCaseId: number;
  signedFiles?: SignedFile[];
}

export interface ConfirmPaymentFailedData {
  compensationCaseId: number;
  failureReason: string;
}

export interface SignedFile {
  fileName: string;
  url: string;
  fileType: string;
}

export interface CompensationReportFilterParams {
  branchId?: string;
  /** Comma-separated post office IDs when multiple */
  postOfficeIds?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export interface CompensationReportItem {
  region: string;
  branchId: string;
  branchName: string;
  completing: number;
  paymentDone: number;
  paymentProcessing: number;
  postOfficeId: string;
  postOfficeName: string;
  postOfficeCode: string;
}

export interface CompensationReportResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: CompensationReportItem[];
  };
}
