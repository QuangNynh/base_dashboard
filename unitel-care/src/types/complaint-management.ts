import type { ChannelType, ComplaintType, SeverityType } from '@/constants/options';
import type { OrderJourneyStatusType, ParcelType } from '@/constants/utils';
import type {
  CategoryEvaluationType,
  ExtensionEvaluationType,
  ProcessingQualityType,
  ReceptionQualityType,
} from '@/constants/ttvh-evaluation';

export interface ComplaintHistoryItem {
  status: string;
  complaint_id: number;
  complaint_code: string;
  complaint_category_id: number;
  complaint_category_code: string;
  complaint_category_name: string;
  complaint_count: number;
  processing_postcode: string;
  processing_post_id: string;
  processing_post_office: string;
  created_at: string;
}

export interface ComplaintListItem {
  id: number;
  deadline: string;
  complaintCode: string;
  status: PostOfficeActionStatus;
  priority: string;
  orderCode: string;
  createdDate: string;
  delayTime?: string;
  contactName: string;
  contactPhone: string;
  complaintCount: number;
  categoryName: string;
  receiptChannel: string;
  processingPostOffice: string;
  processingPostcode: string;
  processingPostOfficeName: string;
  createdAt: string;
  deadlineDateTime: string;
  handlerInfo?: string;
  handlerFullName?: string;
  handlerAccount?: string;
  handlerPhoneNumber?: string;
  complaintType?: ComplaintType;
  created_user_id?: string;
}
export interface PostOfficeHistoryItem {
  tenant: number;

  createdAt: string;
  createdBy: UserInfo;
  createdByUsername: string;

  updatedAt: string;
  updatedByUsername: string;

  id: number;
  orderCode: string;

  contactType: 'SENDER' | 'RECEIVER';
  contactName: string;
  contactAddress: string;
  handlerFullName: string;

  orderWeight: number;
  parcelType: string;
  serviceType: string;

  totalFee: number;
  cod: number;

  requestPhoneNumber: string;
  contactPhoneNumber: string;

  code: string;
  receiptChannel: string;

  complaintCategoryId: number;
  categoryName?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

  // 👉 BE trả về array số (date parts)
  deadline: [number, number, number, number, number];
  // [year, month, day, hour, minute]

  content: string;
  errorDescription: string;
  tgttEvaluation: string;

  originPostcode: string;
  originPostOfficeName: string;

  deliveryPostcode: string;
  deliveryPostOfficeName: string;
  deliveryBranchName: string;

  processingPostcode: string;
  processingPostOffice: string;

  currentPostcode: string;
  currentPostOfficeName: string;
  currentBranchCode: string;
  currentBranchName: string;

  customerAddressJson: string; // 👉 JSON string (cần parse)

  status: 'WAITING' | 'PROCESSING' | 'DONE' | string;

  attachmentCount: number;
  complaintCount: number;

  extended: boolean;
  extensionCount: number;
  categoryChanged: boolean;

  customerAttachedFiles: string; // 👉 string JSON "[{}]"

  complaintType: string;

  actionUnitPostcode: string;
  actionUnitPostname: string;
  complaintId: number;

  version: number;
  actionContent: string;

  is_deleted: boolean;
}

export interface HistoryDetailAttachment {
  file_name: string;
  key: string;
  file_type: string;
  file_size: number;
}

export interface HistoryDetail {
  internal_note?: string;
  response_to_customer?: string;
  complaint_category?: string;
  processing_unit?: string;
  extension_reason?: string;
  extension_hours?: string | number;
  fault_unit?: string;
  fault_individual?: string;
  error_cause?: string;
  attachments?: HistoryDetailAttachment[];
}

export interface HistoryDetailResponse {
  success: boolean;
  data: HistoryDetail;
}

export interface DownloadUrlResponse {
  success: boolean;
  data: {
    url: string;
  };
}

export interface PostOfficeHistoryResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: PostOfficeHistoryItem[];
  };
}
export interface ComplaintListResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: ComplaintListItem[];
    summary: ComplaintSummary;
  };
}
export interface ComplaintSummary {
  waiting_count: number;
  assigned_count: number;
  completed_count: number;
}
export interface UpdatedBy {
  id: string;
  username: string;
  fullName: string;
  tenantId: number;
  locale: string;
  postCode: string;
}

export type CreatedBy = UpdatedBy;

export interface ComplaintDetail {
  id: number;
  order_code: string;
  contact_type: 'SENDER' | 'RECEIVER';
  contact_name: string;
  contact_address: string;
  address?: Address;
  order_weight: number;
  parcel_type: ParcelType;
  service_type: string;
  total_fee: number;
  cod: number;
  request_phone_number: string;
  contact_phone_number: string;
  complaint_code: string;
  receipt_channel: ChannelType;
  processing_postcode: string;
  processing_post_office: string;
  processing_branch_name?: string;
  handler_full_name?: string;
  category_name: string;
  complaint_category_id: number;
  priority: SeverityType;
  complaint_count: number;
  deadline: string;
  content: string;
  error_description: string;
  tgtt_evaluation: string;
  status: string;
  result_content: string;
  internal_note?: string;
  customerAttachedFiles?: string;
  extended: boolean;
  complaint_type: string;
  action_unit_postcode?: string;
  created_at: string;
  created_by?: CreatedBy;
  updated_at: string;
  updated_by?: UpdatedBy;
  error_cause_content?: string;
  // Bưu cục gốc
  origin_postcode?: string;
  origin_post_id?: string;
  origin_post_office_name?: string;
  origin_branch_code?: string;
  origin_branch_id?: string;
  origin_branch_name?: string;
  // Bưu cục phát
  delivery_postcode?: string;
  delivery_post_id?: string;
  delivery_post_office_name?: string;
  delivery_branch_code?: string;
  delivery_branch_id?: string;
  delivery_branch_name?: string;
  // Bưu cục hiện tại
  current_postcode?: string;
  current_post_id?: string;
  current_post_office_name?: string;
  current_branch_code?: string;
  current_branch_id?: string;
  current_branch_name?: string;
  // Các trường cũ không có trong API mới — giữ lại tương thích
  processing_post_id?: string;
  contact_id?: string;
  fault_unit_postcode?: string;
  fault_individual_full_name?: string;
  fault_individual_account?: string;
  fault_individual_phone?: string;
  record_code?: string;
  response_to_customer?: string;
  fault_unit_lv2_name?: string;
  processing_quality?: string;
  category_evaluation?: string;
  reception_quality?: string;
  slow_unit_name?: string;
  handler_id?: string;
  files?: string[];
  extension_reason_id?: number;
  internal_attached_files?: string;
  fault_unit_id?: string;
  error_cause_id?: number | string;
  extension_hours?: number;
  remainingTime?: string;
  fault_individual_id?: number | string;
  ttvh_evaluation?: TtvhEvaluation;
}

export interface TtvhEvaluation {
  id: number;
  complaint_id: number;
  processing_quality: string;
  category_evaluation: string;
  extension_evaluation: string;
  reception_quality: string;
  slow_unit_id: string;
  slow_unit_name: string;
}

export interface ComplaintDetailResponse {
  success: boolean;
  data: ComplaintDetail;
}

export interface AssignmentSetupItem {
  id: number;
  employeeCode: string;
  employeeName: string;
  managingBranches: string[];
}

export interface OrderActionHistoryItem {
  id: string;
  status: string;
  postOffice: string;
  province: string;
  actionPerson: string;
  actionTime: string;
  content: string;
  note?: string;
  journey_status?: string;
  licensePlate: string;
  destinationPostOffice: string;
  jorney_status_desc?: string;
}

export interface OrderDetail {
  // Thông tin đơn hàng
  trackingCode?: string;
  customerCode?: string;
  status?: string;
  approvedDate?: string;
  partner?: string;
  service?: string;
  extraService?: string;
  goodsType?: string;
  // Thông tin người gửi
  senderType?: string;
  senderName?: string;
  senderPhone?: string;
  senderAddress?: string;
  senderProvince?: string;
  senderDistrict?: string;
  senderVillage?: string;
  goodsDescription?: string;
  // Địa chỉ nhận
  // COD
  receiverType?: string;
  receiverName?: string;
  receiverAddress?: string;
  receiverProvince?: string;
  receiverDistrict?: string;
  receiverVillage?: string;
  consignee_phone?: string;
  // COD
  weight: string;
  size?: string;
  totalFreight?: string;
  codAmount?: string;
  totalAmount?: string;
  descStatus?: string;
  paymentName?: string;
  // Thông tin phát
  deliveryDate?: string;
  deliveryUser?: string;
  deliveryGoods?: string;
  deliveryName?: string;
  // Thông tin hoàn
  returnName?: string;
  returnPhone?: string;
  returnAddress?: string;
  //Thông tin liên hệ
  deliveryPostcode?: string;
  deliveryUnitHeadPhone?: string;
  deliveryUnitHead?: string;
  originPostOfficeName?: string;
  originUnitHead?: string;
  originUnitHeadPhone?: string;
  deliveryPostOfficeName?: string;
}

export type PostOfficeActionStatus =
  | 'DONE'
  | 'PROCESSED'
  | 'IN_PROGRESS'
  | 'WAITING'
  | 'COMPLETED'
  | 'ASSIGNED'
  | 'CANCELLED';

export type ReceiptChannel =
  | 'APP_WEB_CUSTOMER'
  | 'CALL_CENTER'
  | 'SOCIAL_MEDIA'
  | 'COUNTER'
  | 'EMAIL';

export type ComplaintPriority = 'NORMAL' | 'HIGH' | 'URGENT';

export interface ComplaintAttachment {
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
}

export interface CreateComplaintRequest {
  orderCode: string;
  customerId?: string;
  contactName?: string;
  receiptChannel: ReceiptChannel;
  customerProvinceId?: string;
  customerDistrictId?: string;
  customerAddress?: string;
  sendingUnitIdLv1?: string;
  sendingUnitIdLv2?: string;
  destinationUnitIdLv1?: string;
  destinationUnitIdLv2?: string;
  requestPhoneNumber?: string;
  customerPhoneNumber?: string;
  priority?: ComplaintPriority;
  complaintCategoryId?: number;
  deadline?: string;
  errorDescription?: string;
  content: string;
  tgttEvaluation?: string;
  receptionUnitLv1?: string;
  receptionUnitIdLv2?: string;
  originPostcode?: string;
  deliveryPostcode?: string;
  processingPostcode?: string;
  processingPersonalProcess?: string;
  originBranch?: string;
  deliveryBranch?: string;
  processingBranch?: string;
  customerAttachedFiles?: string;
  attachments?: ComplaintAttachment[];
}

export type AddressComponent = {
  id?: string;
  code?: string;
  name: string;
  type: string;
  level: number;
};

export type Address = {
  formattedAddress: string;
  components: AddressComponent[];
};
export type ContactType = 'SENDER' | 'RECEIVER';
export interface TrackingCodeInfo {
  orderCode: string;
  contactId: number;
  contactType: ContactType;
  contactName: string;
  email: string;

  address: Address;

  registered: boolean;

  // 👉 Bưu cục gốc
  originPostcode: string;
  originPostId: string;
  originPostOfficeName: string;
  originBranchCode: string;
  originBranchId: string;
  originBranchName: string;

  // 👉 Bưu cục phát
  deliveryPostcode: string;
  deliveryPostId: string;
  deliveryPostOfficeName: string;
  deliveryBranchCode: string;
  deliveryBranchId: string;
  deliveryBranchName: string;

  // 👉 Bưu cục hiện tại
  currentPostcode: string;
  currentPostId: string;
  currentPostOfficeName: string;
  currentBranchCode: string;
  currentBranchId: string;
  currentBranchName: string;
}

export interface TrackingCodeResponse {
  success: boolean;
  data: TrackingCodeInfo;
}

export interface ComplaintFilter {
  search: string;
  complaintType: string[];
  status: string;
  creationTime: { from: string; to: string };
  branch: string;
  postOffice: string;
  channel: string[];
  secondCategory: string;
  complaintNumber: string;
  severity: string[];
  level: string;
  completionDate: { from: string; to: string };
}

export interface ComplaintItem {
  id: string;
  complaintNumber: string;
  complaintType: string;
  status: string;
  branch: string;
  postOffice: string;
  channel: string;
  createdDate: string;
  completionDate: string;
  level: string;
}

export interface ErrorCauseSearch {
  is_deleted?: boolean;
  page?: number;
  size?: number;
  keyword?: string;
}

export interface UserInfo {
  id: string;
  username: string;
  fullName: string;
  tenantId: number;
  locale?: string;
}

export interface ErrorCause {
  tenant: number;
  id: number;
  code: string;
  description: string;
  is_deleted: boolean;
  created_by: UserInfo;
  updated_by?: UserInfo;
}

export interface ExtensionReason {
  tenant: number;
  id: number;
  code: string;
  reason: string;
  maxHours: number;
  is_deleted: boolean;
  created_by: UserInfo;
  updated_by?: UserInfo;
  createdAt: string;
  updatedAt: string;
}
export interface ExtensionReasonResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: ExtensionReason[];
  };
}

export interface AssignmentSetupResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: AssignmentSetup[];
  };
}

export interface AssignmentSetup {
  id: number;
  employeeCode: string;
  userId: number;
  username: string;
  fullName: string;
  phone: string;
  departments: Department[];
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  departmentType: string;
}

export interface Pagination {
  limit: number;
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface ErrorCauseResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: ErrorCause[];
  };
}
export interface CreateErrorCauseResponse {
  success: boolean;
  data: ErrorCause;
}

export interface FeedbackLevel1Params {
  is_deleted?: boolean;
  page?: number;
  size?: number;
  keyword?: string;
}

export interface AssignmentSetupParam {
  page?: number;
  size?: number;
  keyword?: string;
}
export interface FeedbackLevel2Params {
  is_deleted?: boolean;
  page?: number;
  size?: number;
  keyWord?: string;
  level_1_keyword?: string;
  level_1_id?: string;
}
export interface FeedbackLevel {
  tenant: number;
  id: number;
  level: number;
  code: string;
  name: string;
  is_deleted: boolean;
  created_by: UserInfo;
  updated_by: UserInfo;
  parent_id: number;
  resolution_time_hours: number;
  processing_office: string;
  updatedAt: string;
  createdAt: string;
  parent_code: string;
  parent_name: string;
  error_cause_ids: number[];
}
export interface FeedbackLevelResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: FeedbackLevel[];
  };
}
export interface FeedbackLevelDetailResponse {
  success: boolean;
  data: FeedbackLevel;
}
export interface ComplaintQueryParams extends ComplaintFilterData {
  page?: number; // default: 1
  size?: number; // default: 10
}
export interface ComplaintFilterData {
  keyword?: string;
  complaintType?: string;
  status?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
  branchId?: string;
  postOfficeId?: string;
  receiptChannel?: string;
  complaintCategoryId?: string;
  complaintCount?: string;
  priority?: string;
  completedDateFrom?: string;
  completedDateTo?: string;
  deadlineStatus?: string;
}
// ─── Complaint Rate Report ────────────────────────────────────────────────────

export interface ComplaintRateReportItem {
  branchId?: string;
  branchName?: string;
  postOfficeId?: string;
  postOfficeName?: string;
  overdueComplaints?: number;
  processedOverdue?: number;
  processedOnTime?: number;
  totalProcessed?: number;
  totalMustProcess?: number;
  pendingInDeadline?: number;
  onTimeResolutionRate?: number;
  successResolutionRate?: number;
}

// ─── Order Tracking ──────────────────────────────────────────────────────────

export interface OrderTrackingItem {
  jorney_status_desc: string;
  status: string;
  postcode: string;
  province: string;
  actor: string;
  updated_at: string;
  content: string;
  journey_status: OrderJourneyStatusType;
  plate_number: string;
  delivery_postcode: string;
}

export interface OrderTrackingData {
  delivery_post_office_name: string | undefined;
  origin_unit_head_phone: string | undefined;
  origin_unit_head: string | undefined;
  delivery_name: string | undefined;
  delivery_unit_head: string | undefined;
  delivery_goods: string | undefined;
  delivery_user: string | undefined;
  return_address: string | undefined;
  return_name: string | undefined;
  return_phone: string | undefined;
  origin_post_office_name: string | undefined;
  delivery_unit_head_phone: string | undefined;
  delivery_postcode: string | undefined;
  lookup_type?: string;
  delivery_date: string | undefined;
  payment_name: string | undefined;
  goods_description: string;
  order_id: string;
  status: string;
  descStatus?: string;
  partner: string | null;
  service: string;
  service_name: string;
  vas: string[];
  goods_type: string;
  sender_name: string;
  sender_phone: string;
  sender_address: string;
  sender_province: string;
  sender_district: string;
  sender_ward: string;
  consignee_name: string;
  consignee_phone: string;
  consignee_address: string;
  consignee_province: string;
  consignee_district: string;
  consignee_ward: string;
  order_weight: number;
  dimensions: string;
  total_fees: number;
  cod: number;
  tracking: OrderTrackingItem[];
  complaint_history?: ComplaintHistoryItem[];
}

export interface OrderTrackingResponse {
  success: boolean;
  data: OrderTrackingData;
}

// ─── TTVH Evaluation History ─────────────────────────────────────────────────

export interface HistoryRatingItem {
  id: number;
  evaluationId: number;
  complaintId: number;
  processingQuality: ProcessingQualityType;
  categoryEvaluation: CategoryEvaluationType;
  extensionEvaluation: ExtensionEvaluationType;
  receptionQuality: ReceptionQualityType;
  slowUnitId: string;
  slowUnitName: string;
  slowUnitPostcode: string;
  createdAt: string;
  updatedAt: string;
  updatedByUsername: string;
  isDeleted: boolean;
}

export interface HistoryRatingResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: HistoryRatingItem[];
  };
}

export interface ComplaintRateReportQueryParams {
  reportDateFrom?: string;
  reportDateTo?: string;
  branchIds?: string;
  postOfficeIds?: string;
  complaintCount?: number | string;
  priorities?: string;
  deadlineStatuses?: string;
  page?: number;
  size?: number;
  priority?: string;
  trigger?: number;
}

export type ComplaintRateReportResponse<T> = {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: T;
  };
};
// ─── Records / Biên bản ───────────────────────────────────────────────────────

export interface RecordItem {
  id: number;
  status: string;
  recordCode: string;
  createdAt: string;
  creatingPostOffice: string;
  creator: string;
  affectedPostOffice: string;
  errorCode: string;
  errorName: string;
  remainingTime: string;
}

export interface RecordListResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: RecordItem[];
  };
}

export interface CreateTtvhEvaluation {
  complaintId: number;
  processingQuality: string;
  categoryEvaluation: string;
  extensionEvaluation: string;
  receptionQuality: string;
  slowUnitId?: string;
}
