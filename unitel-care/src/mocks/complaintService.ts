import type {
  CreateErrorCauseData,
  CreateExtensionReasonData,
  CreateFeedbackLevel1Data,
  CreateFeedbackLevel2Data,
} from '@/schemas/settingComplaintSchema';
import type { PaginationSearch } from '@/types/common';
import type {
  AssignmentSetupParam,
  AssignmentSetupResponse,
  ComplaintDetailResponse,
  ComplaintListResponse,
  ComplaintQueryParams,
  ComplaintRateReportItem,
  ComplaintRateReportQueryParams,
  ComplaintRateReportResponse,
  CreateTtvhEvaluation,
  DownloadUrlResponse,
  ErrorCauseResponse,
  ErrorCauseSearch,
  ExtensionReasonResponse,
  FeedbackLevel1Params,
  FeedbackLevel2Params,
  FeedbackLevelDetailResponse,
  FeedbackLevelResponse,
  HistoryDetailResponse,
  HistoryRatingResponse,
  OrderTrackingResponse,
  PostOfficeHistoryResponse,
  RecordListResponse,
  TrackingCodeResponse,
  ErrorCause,
  ExtensionReason,
  FeedbackLevel,
  ComplaintListItem,
  PostOfficeHistoryItem,
} from '@/types/complaint-management';

let mockComplaints: ComplaintListItem[] = [
  {
    id: 1,
    deadline: [2026, 6, 26, 17, 0] as any,
    complaintCode: 'KN-000001',
    status: 'WAITING',
    priority: 'NORMAL',
    orderCode: 'ORD-123456',
    createdDate: [2026, 6, 23, 8, 0] as any,
    contactName: 'Trần Văn B',
    contactPhone: '0988776655',
    complaintCount: 1,
    categoryName: 'Khiếu nại dịch vụ',
    receiptChannel: 'COUNTER',
    processingPostOffice: 'BC_DD',
    processingPostcode: 'BC_DD',
    processingPostOfficeName: 'Bưu cục Đống Đa',
    createdAt: '2026-06-23T08:00:00Z',
    deadlineDateTime: '2026-06-26T17:00:00Z',
    handlerFullName: 'Nguyễn Văn A',
  },
  {
    id: 2,
    deadline: [2026, 6, 27, 17, 0] as any,
    complaintCode: 'KN-000002',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    orderCode: 'ORD-987654',
    createdDate: [2026, 6, 24, 9, 30] as any,
    contactName: 'Lê Thị C',
    contactPhone: '0911223344',
    complaintCount: 1,
    categoryName: 'Khiếu nại hàng hóa',
    receiptChannel: 'APP_WEB_CUSTOMER',
    processingPostOffice: 'BC_Q1',
    processingPostcode: 'BC_Q1',
    processingPostOfficeName: 'Bưu cục Quận 1',
    createdAt: '2026-06-24T09:30:00Z',
    deadlineDateTime: '2026-06-27T17:00:00Z',
    handlerFullName: 'Nguyễn Văn A',
  },
];

let mockErrorCauses: ErrorCause[] = [
  {
    tenant: 1,
    id: 1,
    code: 'LOI_VAN_CHUYEN',
    description: 'Lỗi tài xế chạy ẩu làm hỏng hàng',
    is_deleted: false,
    created_by: {
      id: '1',
      username: 'admin',
      fullName: 'Admin User',
      tenantId: 1,
    },
  },
  {
    tenant: 1,
    id: 2,
    code: 'LOI_PHAN_LOAI',
    description: 'Lỗi chia chọn sai bưu cục',
    is_deleted: false,
    created_by: {
      id: '1',
      username: 'admin',
      fullName: 'Admin User',
      tenantId: 1,
    },
  },
];

let mockExtensionReasons: ExtensionReason[] = [
  {
    tenant: 1,
    id: 1,
    code: 'LAY_YK_KH',
    reason: 'Chờ lấy ý kiến đồng thuận từ khách hàng',
    maxHours: 48,
    is_deleted: false,
    created_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
    updated_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
    createdAt: '2026-06-20T00:00:00Z',
    updatedAt: '2026-06-20T00:00:00Z',
  },
];

let mockFeedbackLevels: FeedbackLevel[] = [
  {
    tenant: 1,
    id: 1,
    level: 1,
    code: 'DV_CHAM',
    name: 'Dịch vụ giao chậm',
    is_deleted: false,
    created_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
    updated_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
    parent_id: 0,
    resolution_time_hours: 24,
    processing_office: 'BC_DD',
    createdAt: '2026-06-20T00:00:00Z',
    updatedAt: '2026-06-20T00:00:00Z',
    parent_code: '',
    parent_name: '',
    error_cause_ids: [],
  },
  {
    tenant: 1,
    id: 2,
    level: 1,
    code: 'HH_VO',
    name: 'Hàng hóa bể vỡ',
    is_deleted: false,
    created_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
    updated_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
    parent_id: 0,
    resolution_time_hours: 48,
    processing_office: 'BC_DD',
    createdAt: '2026-06-20T00:00:00Z',
    updatedAt: '2026-06-20T00:00:00Z',
    parent_code: '',
    parent_name: '',
    error_cause_ids: [],
  },
];

class MockComplaintService {
  async getListComplaint(data: ComplaintQueryParams): Promise<ComplaintListResponse> {
    const page = data.page ?? 1;
    const size = data.size ?? 10;

    return {
      success: true,
      data: {
        pagination: {
          limit: size,
          totalElements: mockComplaints.length,
          totalPages: Math.ceil(mockComplaints.length / size),
          currentPage: page,
        },
        page_data: mockComplaints.slice((page - 1) * size, page * size),
        summary: {
          waiting_count: mockComplaints.filter((c) => c.status === 'WAITING').length,
          assigned_count: mockComplaints.filter((c) => c.status === 'IN_PROGRESS').length,
          completed_count: mockComplaints.filter((c) => c.status === 'DONE' || c.status === 'COMPLETED').length,
        },
      },
    };
  }

  async getHistoryPostOfficeComplaint(
    data: PaginationSearch,
    id: string
  ): Promise<PostOfficeHistoryResponse> {
    const historyItem: PostOfficeHistoryItem = {
      tenant: 1,
      createdAt: '2026-06-24T10:00:00Z',
      createdBy: { id: '1', username: 'admin', fullName: 'Nguyễn Văn A', tenantId: 1 },
      createdByUsername: 'admin',
      updatedAt: '2026-06-24T10:00:00Z',
      updatedByUsername: 'admin',
      id: 1,
      orderCode: 'ORD-123456',
      contactType: 'SENDER',
      contactName: 'Trần Văn B',
      contactAddress: 'Hà Nội',
      handlerFullName: 'Nguyễn Văn A',
      orderWeight: 1.5,
      parcelType: 'DOCUMENT',
      serviceType: 'VCN',
      totalFee: 50000,
      cod: 0,
      requestPhoneNumber: '0901234567',
      contactPhoneNumber: '0901234567',
      code: 'KN-000001',
      receiptChannel: 'COUNTER',
      complaintCategoryId: 1,
      categoryName: 'Khiếu nại dịch vụ',
      priority: 'HIGH',
      deadline: [2026, 6, 26, 17, 0],
      content: 'Nội dung khiếu nại',
      errorDescription: 'Không',
      tgttEvaluation: 'Tốt',
      originPostcode: 'BC_DD',
      originPostOfficeName: 'Bưu cục Đống Đa',
      deliveryPostcode: 'BC_CG',
      deliveryPostOfficeName: 'Bưu cục Cầu Giấy',
      deliveryBranchName: 'Chi nhánh Hà Nội',
      processingPostcode: 'BC_DD',
      processingPostOffice: 'Bưu cục Đống Đa',
      currentPostcode: 'BC_DD',
      currentPostOfficeName: 'Bưu cục Đống Đa',
      currentBranchCode: 'CN_HN',
      currentBranchName: 'Chi nhánh Hà Nội',
      customerAddressJson: '{}',
      status: 'PROCESSING',
      attachmentCount: 0,
      complaintCount: 1,
      extended: false,
      extensionCount: 0,
      categoryChanged: false,
      customerAttachedFiles: '[]',
      complaintType: 'SERVICE',
      actionUnitPostcode: 'BC_DD',
      actionUnitPostname: 'Bưu cục Đống Đa',
      complaintId: Number(id),
      version: 1,
      actionContent: 'Đã tiếp nhận khiếu nại và chuyển xử lý',
      is_deleted: false,
    };

    return {
      success: true,
      data: {
        pagination: {
          limit: data.size ?? 10,
          totalElements: 1,
          totalPages: 1,
          currentPage: data.page ?? 1,
        },
        page_data: [historyItem],
      },
    };
  }

  async getHistoryDetail(_historyId: number): Promise<HistoryDetailResponse> {
    return {
      success: true,
      data: {
        internal_note: 'Chuyển thông tin phối hợp bưu cục Quận 1 xử lý.',
        response_to_customer: 'Chúng tôi đang xử lý khiếu nại của quý khách.',
        complaint_category: 'Khiếu nại dịch vụ',
        processing_unit: 'Bưu cục Quận 1',
        extension_reason: '',
        extension_hours: 0,
        fault_unit: '',
        fault_individual: '',
        error_cause: '',
        attachments: [],
      },
    };
  }

  async getHistoryAttachmentDownloadUrl(key: string, name: string): Promise<DownloadUrlResponse> {
    return {
      success: true,
      data: {
        url: `https://fake-s3-storage.example.com/download/${key}?name=${encodeURIComponent(name)}`,
      },
    };
  }

  async createTtvhEvaluation(_id: string, _data: CreateTtvhEvaluation) {
    return { success: true, data: null };
  }

  async getHistoryRatingComplaint(
    data: PaginationSearch,
    _id: string
  ): Promise<HistoryRatingResponse> {
    return {
      success: true,
      data: {
        pagination: {
          limit: data.size ?? 10,
          totalElements: 0,
          totalPages: 0,
          currentPage: data.page ?? 1,
        },
        page_data: [],
      },
    };
  }

  async exportComplaint(_data: ComplaintQueryParams) {
    return new Blob(['fake complaints export'], { type: 'application/vnd.ms-excel' });
  }

  async getComplainDetail(id: string): Promise<ComplaintDetailResponse> {
    const complaint = mockComplaints.find((c) => c.id.toString() === id) || mockComplaints[0];
    return {
      success: true,
      data: {
        id: complaint.id,
        complaint_code: complaint.complaintCode,
        order_code: complaint.orderCode,
        contact_type: 'SENDER',
        contact_name: complaint.contactName,
        contact_address: 'Hà Nội',
        address: {
          formattedAddress: 'Hà Nội',
          components: [],
        },
        order_weight: 1.5,
        parcel_type: 'DOCUMENT' as any,
        service_type: 'VCN',
        total_fee: 50000,
        cod: 0,
        request_phone_number: complaint.contactPhone,
        contact_phone_number: complaint.contactPhone,
        receipt_channel: 'COUNTER' as any,
        processing_postcode: complaint.processingPostcode,
        processing_post_office: complaint.processingPostOffice,
        processing_branch_name: 'Chi nhánh Hà Nội',
        handler_full_name: complaint.handlerFullName,
        category_name: complaint.categoryName,
        complaint_category_id: 1,
        priority: 'NORMAL',
        complaint_count: 1,
        deadline: '2026-06-26T17:00:00Z',
        content: 'Nội dung khiếu nại',
        error_description: 'Không',
        tgtt_evaluation: 'Tốt',
        status: complaint.status,
        result_content: '',
        internal_note: '',
        extended: false,
        complaint_type: 'SERVICE',
        created_at: complaint.createdAt,
        updated_at: complaint.createdAt,
      },
    };
  }

  async getListErrorCauses(data: ErrorCauseSearch): Promise<ErrorCauseResponse> {
    const page = data.page ?? 1;
    const size = data.size ?? 10;
    return {
      success: true,
      data: {
        pagination: {
          limit: size,
          totalElements: mockErrorCauses.length,
          totalPages: Math.ceil(mockErrorCauses.length / size),
          currentPage: page,
        },
        page_data: mockErrorCauses.slice((page - 1) * size, page * size),
      },
    };
  }

  async createErrorCause(data: CreateErrorCauseData): Promise<ErrorCauseResponse> {
    const newItem: ErrorCause = {
      tenant: 1,
      id: mockErrorCauses.length + 1,
      code: data.code,
      description: data.description,
      is_deleted: data.is_deleted || false,
      created_by: {
        id: '1',
        username: 'admin',
        fullName: 'Admin User',
        tenantId: 1,
      },
    };
    mockErrorCauses.push(newItem);
    return {
      success: true,
      data: {
        pagination: { limit: 10, totalElements: mockErrorCauses.length, totalPages: 1, currentPage: 1 },
        page_data: [newItem],
      },
    };
  }

  async updateErrorCause(data: CreateErrorCauseData, id: string): Promise<ErrorCauseResponse> {
    mockErrorCauses = mockErrorCauses.map((item) =>
      item.id.toString() === id
        ? {
            ...item,
            code: data.code,
            description: data.description,
            is_deleted: data.is_deleted ?? item.is_deleted,
          }
        : item
    );
    const updated = mockErrorCauses.find((item) => item.id.toString() === id)!;
    return {
      success: true,
      data: {
        pagination: { limit: 10, totalElements: mockErrorCauses.length, totalPages: 1, currentPage: 1 },
        page_data: [updated],
      },
    };
  }

  async getHistoryErrorCause(_data: ErrorCauseSearch, id: number): Promise<ErrorCauseResponse> {
    return {
      success: true,
      data: {
        pagination: { limit: 10, totalElements: 1, totalPages: 1, currentPage: 1 },
        page_data: [
          {
            tenant: 1,
            id,
            code: 'LOI_VAN_CHUYEN',
            description: 'Lỗi tài xế chạy ẩu làm hỏng hàng',
            is_deleted: false,
            created_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
          },
        ],
      },
    };
  }

  async getExtensionReasonData(data: ErrorCauseSearch): Promise<ExtensionReasonResponse> {
    const page = data.page ?? 1;
    const size = data.size ?? 10;
    return {
      success: true,
      data: {
        pagination: {
          limit: size,
          totalElements: mockExtensionReasons.length,
          totalPages: Math.ceil(mockExtensionReasons.length / size),
          currentPage: page,
        },
        page_data: mockExtensionReasons.slice((page - 1) * size, page * size),
      },
    };
  }

  async createExtensionReason(data: CreateExtensionReasonData) {
    const newItem: ExtensionReason = {
      tenant: 1,
      id: mockExtensionReasons.length + 1,
      code: data.code,
      reason: data.name,
      maxHours: Number(data.max_hours),
      is_deleted: data.is_deleted || false,
      created_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockExtensionReasons.push(newItem);
    return { success: true, data: newItem };
  }

  async updateExtensionReason(data: CreateExtensionReasonData, id: string) {
    mockExtensionReasons = mockExtensionReasons.map((item) =>
      item.id.toString() === id
        ? {
            ...item,
            code: data.code,
            reason: data.name,
            maxHours: Number(data.max_hours),
            is_deleted: data.is_deleted ?? item.is_deleted,
            updatedAt: new Date().toISOString(),
          }
        : item
    );
    return { success: true };
  }

  async getHistoryExtensionReason(
    _data: ErrorCauseSearch,
    id: number
  ): Promise<ExtensionReasonResponse> {
    return {
      success: true,
      data: {
        pagination: { limit: 10, totalElements: 1, totalPages: 1, currentPage: 1 },
        page_data: [
          {
            tenant: 1,
            id,
            code: 'LAY_YK_KH',
            reason: 'Chờ lấy ý kiến đồng thuận từ khách hàng',
            maxHours: 48,
            is_deleted: false,
            created_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
            createdAt: '2026-06-21T00:00:00Z',
            updatedAt: '2026-06-21T00:00:00Z',
          },
        ],
      },
    };
  }

  async getFeedbackLevel1Data(data: FeedbackLevel1Params): Promise<FeedbackLevelResponse> {
    const page = data.page ?? 1;
    const size = data.size ?? 10;
    const list = mockFeedbackLevels.filter((f) => f.level === 1);
    return {
      success: true,
      data: {
        pagination: {
          limit: size,
          totalElements: list.length,
          totalPages: Math.ceil(list.length / size),
          currentPage: page,
        },
        page_data: list.slice((page - 1) * size, page * size),
      },
    };
  }

  async getAssignmentSetUp(_data: AssignmentSetupParam): Promise<AssignmentSetupResponse> {
    return {
      success: true,
      data: {
        pagination: {
          limit: 10,
          totalElements: 2,
          totalPages: 1,
          currentPage: 1,
        },
        page_data: [
          {
            id: 1,
            employeeCode: 'NV001',
            userId: 1,
            username: 'nva',
            fullName: 'Nguyễn Văn A',
            phone: '0901234567',
            departments: [
              {
                departmentId: '101',
                departmentCode: 'CN_HN',
                departmentName: 'Chi nhánh Hà Nội',
                departmentType: 'CN',
              },
            ],
            createdAt: '2026-06-20T00:00:00Z',
            updatedAt: '2026-06-20T00:00:00Z',
          },
          {
            id: 2,
            employeeCode: 'NV002',
            userId: 2,
            username: 'ttb',
            fullName: 'Trần Thị B',
            phone: '0907654321',
            departments: [
              {
                departmentId: '102',
                departmentCode: 'CN_HCM',
                departmentName: 'Chi nhánh Hồ Chí Minh',
                departmentType: 'CN',
              },
            ],
            createdAt: '2026-06-20T00:00:00Z',
            updatedAt: '2026-06-20T00:00:00Z',
          },
        ],
      },
    };
  }

  async deleteAssignmentSetUp(_employeeCode: string): Promise<{ success: boolean; data: null }> {
    return { success: true, data: null };
  }

  async updateAssignmentSetUp(
    _employeeCode: string,
    _departmentIds: string[]
  ): Promise<{ success: boolean; data: unknown }> {
    return { success: true, data: null };
  }

  async getFeedbackLevel2Data(data: FeedbackLevel2Params): Promise<FeedbackLevelResponse> {
    const page = data.page ?? 1;
    const size = data.size ?? 10;
    const list = mockFeedbackLevels.filter((f) => f.level === 2);
    return {
      success: true,
      data: {
        pagination: {
          limit: size,
          totalElements: list.length,
          totalPages: Math.ceil(list.length / size),
          currentPage: page,
        },
        page_data: list.slice((page - 1) * size, page * size),
      },
    };
  }

  async createFeedbackLevel1(data: CreateFeedbackLevel1Data | CreateFeedbackLevel2Data) {
    const isLevel2 = 'parent_id' in data;
    const newItem: FeedbackLevel = {
      tenant: 1,
      id: mockFeedbackLevels.length + 1,
      level: isLevel2 ? 2 : 1,
      code: data.code,
      name: data.name,
      is_deleted: data.is_deleted || false,
      created_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
      updated_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
      parent_id: isLevel2 ? Number((data as CreateFeedbackLevel2Data).parent_id) : 0,
      resolution_time_hours: isLevel2 ? Number((data as CreateFeedbackLevel2Data).resolution_time_hours) : 24,
      processing_office: isLevel2 ? (data as CreateFeedbackLevel2Data).processing_office : 'BC_DD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parent_code: '',
      parent_name: '',
      error_cause_ids: isLevel2 ? (data as CreateFeedbackLevel2Data).error_cause_ids.map(Number) : [],
    };
    mockFeedbackLevels.push(newItem);
    return { success: true, data: newItem };
  }

  async updateFeedbackLevel1(data: CreateFeedbackLevel1Data, id: string) {
    mockFeedbackLevels = mockFeedbackLevels.map((item) =>
      item.id.toString() === id
        ? {
            ...item,
            code: data.code,
            name: data.name,
            is_deleted: data.is_deleted ?? item.is_deleted,
          }
        : item
    );
    return { success: true };
  }

  async getHistoryFeedbackLevel1(
    _data: ErrorCauseSearch,
    id: number
  ): Promise<FeedbackLevelResponse> {
    return {
      success: true,
      data: {
        pagination: { limit: 10, totalElements: 1, totalPages: 1, currentPage: 1 },
        page_data: [
          {
            tenant: 1,
            id,
            code: 'DV_CHAM',
            name: 'Dịch vụ giao chậm',
            level: 1,
            status: 'ACTIVE',
            is_deleted: false,
            created_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
            updated_by: { id: '1', username: 'admin', fullName: 'Admin User', tenantId: 1 },
            parent_id: 0,
            resolution_time_hours: 24,
            processing_office: 'BC_DD',
            createdAt: '2026-06-20T00:00:00Z',
            updatedAt: '2026-06-20T00:00:00Z',
            parent_code: '',
            parent_name: '',
            error_cause_ids: [],
          } as unknown as FeedbackLevel,
        ],
      },
    };
  }

  async getInformationTrackingCode(orderCode: string): Promise<TrackingCodeResponse> {
    return {
      success: true,
      data: {
        orderCode: orderCode,
        contactId: 1,
        contactType: 'SENDER',
        contactName: 'Nguyễn Văn Khách Hàng',
        email: 'customer@example.com',
        address: {
          formattedAddress: '456 Đường CMT8, Quận 3, TP.HCM',
          components: [
            { id: '1', code: 'VN', name: 'Việt Nam', type: 'COUNTRY', level: 0 },
          ],
        },
        registered: true,
        originPostcode: 'BC_DD',
        originPostId: '2001',
        originPostOfficeName: 'Bưu cục Đống Đa',
        originBranchCode: 'CN_HN',
        originBranchId: '1001',
        originBranchName: 'Chi nhánh Hà Nội',
        deliveryPostcode: 'BC_CG',
        deliveryPostId: '2002',
        deliveryPostOfficeName: 'Bưu cục Cầu Giấy',
        deliveryBranchCode: 'CN_HN',
        deliveryBranchId: '1001',
        deliveryBranchName: 'Chi nhánh Hà Nội',
        currentPostcode: 'BC_DD',
        currentPostId: '2001',
        currentPostOfficeName: 'Bưu cục Đống Đa',
        currentBranchCode: 'CN_HN',
        currentBranchId: '1001',
        currentBranchName: 'Chi nhánh Hà Nội',
      },
    };
  }

  async createComplaint(data: FormData) {
    const orderCode = (data.get('orderCode') as string) || 'ORD-999999';
    const customerName = (data.get('customerName') as string) || 'Khách Hàng Mới';

    const newItem: ComplaintListItem = {
      id: mockComplaints.length + 1,
      deadline: [2026, 6, 27, 17, 0] as any,
      complaintCode: `KN-00000${mockComplaints.length + 1}`,
      status: 'WAITING',
      priority: 'NORMAL',
      orderCode,
      createdDate: [2026, 6, 24, 9, 30] as any,
      contactName: customerName,
      contactPhone: '0900000000',
      complaintCount: 1,
      categoryName: 'Khiếu nại dịch vụ',
      receiptChannel: 'COUNTER',
      processingPostOffice: 'BC_DD',
      processingPostcode: 'BC_DD',
      processingPostOfficeName: 'Bưu cục Đống Đa',
      createdAt: new Date().toISOString(),
      deadlineDateTime: new Date(Date.now() + 3600 * 24 * 3 * 1000).toISOString(),
      handlerFullName: 'Nguyễn Văn A',
    };
    mockComplaints.push(newItem);

    return { success: true, data: newItem };
  }

  async updateComplaint(id: string, data: FormData) {
    const title = data.get('title') as string;
    mockComplaints = mockComplaints.map((c) =>
      c.id.toString() === id ? { ...c, title: title || c.contactName, updatedAt: new Date().toISOString() } : c
    );
    return { success: true };
  }

  async updateComplaintHandling(_id: string, _data: FormData) {
    return { success: true };
  }

  async receiveComplaint(id: string) {
    mockComplaints = mockComplaints.map((c) =>
      c.id.toString() === id ? { ...c, status: 'IN_PROGRESS', updatedAt: new Date().toISOString() } : c
    );
    return { success: true };
  }

  async processComplaint(_id: string, _data: FormData) {
    return { success: true };
  }

  async completeComplaint(id: string, _data: { internalNote?: string }) {
    mockComplaints = mockComplaints.map((c) =>
      c.id.toString() === id ? { ...c, status: 'DONE', updatedAt: new Date().toISOString() } : c
    );
    return { success: true };
  }

  async getDetailFeedbackLevel(id: string): Promise<FeedbackLevelDetailResponse> {
    const level = mockFeedbackLevels.find(l => l.id.toString() === id) || mockFeedbackLevels[0];
    return {
      success: true,
      data: level,
    };
  }

  async getOrderTracking(orderId: string): Promise<OrderTrackingResponse> {
    return {
      success: true,
      data: {
        order_id: orderId,
        status: 'DELIVERED',
        descStatus: 'Đã giao hàng thành công',
        partner: null,
        service: 'VCN',
        service_name: 'Chuyển phát nhanh',
        vas: ['Bảo hiểm'],
        goods_type: 'DOCUMENT',
        sender_name: 'Shop A',
        sender_phone: '090111222',
        sender_address: 'Hà Nội',
        sender_province: 'Hà Nội',
        sender_district: 'Đống Đa',
        sender_ward: 'Láng Hạ',
        consignee_name: 'Khách hàng B',
        consignee_phone: '090333444',
        consignee_address: 'Hồ Chí Minh',
        consignee_province: 'Hồ Chí Minh',
        consignee_district: 'Quận 1',
        consignee_ward: 'Bến Nghé',
        order_weight: 1.5,
        dimensions: '20x15x5',
        total_fees: 50000,
        cod: 0,
        delivery_post_office_name: 'Bưu cục Quận 1',
        origin_unit_head_phone: '0988888888',
        origin_unit_head: 'Nguyễn Văn Trưởng',
        delivery_name: 'Nguyễn Văn Bưu Tá',
        delivery_unit_head: 'Trần Văn Trưởng',
        delivery_goods: 'Tài liệu',
        delivery_user: 'bt01',
        return_address: 'Hà Nội',
        return_name: 'Shop A',
        return_phone: '090111222',
        origin_post_office_name: 'Bưu cục Đống Đa',
        delivery_unit_head_phone: '0977777777',
        delivery_postcode: 'BC_Q1',
        delivery_date: '2026-06-24T15:00:00Z',
        payment_name: 'Người gửi',
        goods_description: 'Tài liệu mật',
        tracking: [
          {
            jorney_status_desc: 'Đã giao hàng thành công',
            status: 'DELIVERED',
            postcode: 'BC_Q1',
            province: 'Hồ Chí Minh',
            actor: 'Bưu tá A',
            updated_at: '2026-06-24T15:00:00Z',
            content: 'Người nhận ký nhận',
            journey_status: 'DELIVERED',
            plate_number: '29A-12345',
            delivery_postcode: 'BC_Q1',
          },
        ],
      },
    };
  }

  async getListComplaintRateReport(
    _params: ComplaintRateReportQueryParams
  ): Promise<ComplaintRateReportResponse<ComplaintRateReportItem[]>> {
    return {
      success: true,
      data: {
        pagination: {
          limit: 10,
          totalElements: 1,
          totalPages: 1,
          currentPage: 1,
        },
        page_data: [
          {
            branchId: 'BR001',
            branchName: 'Chi nhánh Hà Nội',
            postOfficeId: 'PO001',
            postOfficeName: 'Bưu cục Đống Đa',
            overdueComplaints: 5,
            processedOverdue: 2,
            processedOnTime: 18,
            totalProcessed: 20,
            totalMustProcess: 25,
            pendingInDeadline: 3,
            onTimeResolutionRate: 90,
            successResolutionRate: 80,
          },
        ],
      },
    };
  }

  async exportExcelComplaintRateReport(_data: ComplaintRateReportQueryParams): Promise<Blob> {
    return new Blob(['fake complaint rate report excel'], { type: 'application/vnd.ms-excel' });
  }

  async getRecordsByOrderCode(
    _orderCode: string,
    params: { page: number; size: number }
  ): Promise<RecordListResponse> {
    return {
      success: true,
      data: {
        pagination: { limit: params.size, totalElements: 2, totalPages: 1, currentPage: params.page },
        page_data: [
          {
            id: 1,
            status: 'NEW',
            recordCode: 'REC-0001',
            createdAt: '2026-06-23T10:05:00Z',
            creatingPostOffice: 'Bưu cục Đống Đa',
            creator: 'Nguyễn Văn Kho',
            affectedPostOffice: 'Bưu cục Đống Đa',
            errorCode: 'LOI_VAN_CHUYEN',
            errorName: 'Lỗi tài xế chạy ẩu làm hỏng hàng',
            remainingTime: '24h',
          },
          {
            id: 2,
            status: 'CONCLUDED',
            recordCode: 'REC-0002',
            createdAt: '2026-06-23T19:55:00Z',
            creatingPostOffice: 'Bưu cục Đống Đa',
            creator: 'Nguyễn Văn Kho',
            affectedPostOffice: 'Bưu cục Đống Đa',
            errorCode: 'LOI_PHAN_LOAI',
            errorName: 'Lỗi chia chọn sai bưu cục',
            remainingTime: '0h',
          },
        ],
      },
    };
  }

  async getTrackingStatusEnum(): Promise<{ TrackingOrderStatus: Record<string, string> }> {
    return {
      TrackingOrderStatus: {
        COLLECTED: 'Đã thu gom',
        PROCESSING: 'Đang xử lý',
        DELIVERING: 'Đang giao hàng',
        DELIVERED: 'Đã giao thành công',
        RETURNED: 'Đã chuyển hoàn',
        CANCELLED: 'Đã hủy',
      },
    };
  }
}

export const complaintService = new MockComplaintService();
