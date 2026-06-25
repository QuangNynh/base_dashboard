import type {
  BranchUnConfigData,
  ViolationDetailErrorDetailData,
  ViolationErrorDetailData,
  ViolationErrorDetailListResponse,
  ViolationErrorGeneralListResponse,
  ViolationReportGeneralRow,
  ViolationUserBranchData,
  ProcessExplainViolationData,
  DataViolatedOffice,
  ViolationReportConcludeData,
  ViolationErrorDetailRow,
  CreateMinutesRequest,
  CreateMinutesResponse,
} from '@/types/violation-report';
import type {
  ViolationReportListResponse,
  ViolationReportQueryParams,
  MinutesDetailResponse,
  ViolationRateReportQueryParams,
  ViolationRateReportListResponse,
} from '@/types/violation-report-management';
import type { BranchResponse, PostOfficeResponse } from '@/types/post-office';
import type { OrderSearchViolation } from '@/components/pages/violation-report-conclude/TrackingCodeInput';

let mockErrorGroups = [
  { id: 1, code: 'G_CHAM_GIAO', name: 'Nhóm lỗi chậm giao hàng' },
  { id: 2, code: 'G_BE_VO', name: 'Nhóm lỗi bể vỡ, móp méo' },
];

let mockErrorDetails: ViolationErrorDetailRow[] = [
  {
    id: 1,
    mistakeGroupCode: 'G_CHAM_GIAO',
    mistakeGroupName: 'Nhóm lỗi chậm giao hàng',
    mistakeCode: 'LOI_CHAM_GIAO_1',
    mistakeName: 'Chậm giao hàng',
    mistakeDescription: 'Giao hàng trễ trên 24h không lý do',
    processExpiredTime: 24,
    concludeExpiredTime: 48,
    isAutoClose: false,
    isUnique: false,
    isCompensatory: false,
    individualPenaltyScore: 1,
    moneyPenalty: 100000,
    individualBonusScore: 0,
    managerPenaltyScore: 0,
    agencyPenaltyScore: 0,
    effectiveFrom: '2026-06-20T00:00:00Z',
    effectiveTo: '2026-12-31T23:59:59Z',
  },
  {
    id: 2,
    mistakeGroupCode: 'G_BE_VO',
    mistakeGroupName: 'Nhóm lỗi bể vỡ, móp méo',
    mistakeCode: 'LOI_BE_VO_1',
    mistakeName: 'Bể vỡ hàng hóa',
    mistakeDescription: 'Làm vỡ sản phẩm do chèn xếp không cẩn thận',
    processExpiredTime: 24,
    concludeExpiredTime: 48,
    isAutoClose: false,
    isUnique: false,
    isCompensatory: true,
    individualPenaltyScore: 5,
    moneyPenalty: 500000,
    individualBonusScore: 0,
    managerPenaltyScore: 0,
    agencyPenaltyScore: 0,
    effectiveFrom: '2026-06-20T00:00:00Z',
    effectiveTo: '2026-12-31T23:59:59Z',
  },
];

let mockUserBranches: ViolationReportGeneralRow[] = [
  {
    id: 1,
    employee_id: 1,
    employee_code: 'STAFF001',
    employee_name: 'Admin User',
    assigned_branches: [
      {
        branch_id: 1001,
        branch_code: 'CN_HN',
        branch_name: 'Chi nhánh Hà Nội',
      },
    ],
  },
];

let mockMinutes = [
  {
    id: 1,
    minutesCode: 'BB-000001',
    createdAt: '2026-06-22T08:00:00Z',
    createdBranchId: '1001',
    createdBranchName: 'Chi nhánh Hà Nội',
    createdPostOfficeId: '2002',
    createdPostOfficeName: 'Bưu cục Cầu Giấy',
    createdPostOfficeCode: 'BC_CG',
    createdByEmployeeCode: 'STAFF001',
    createdByEmployeeName: 'Admin User',
    targetBranchId: '1001',
    targetBranchName: 'Chi nhánh Hà Nội',
    targetPostOfficeId: '2001',
    targetPostOfficeName: 'Bưu cục Đống Đa',
    targetPostOfficeCode: 'BC_DD',
    violatingPostOfficeName: 'Bưu cục Đống Đa',
    status: 1,
    mistakeId: 1,
    mistakeCode: 'LOI_CHAM_GIAO_1',
    mistakeDescription: 'Giao hàng trễ trên 24h không lý do',
    itemCodes: 'ORD-123456',
    createdViolatingPersons: 'Trần Thị B',
    remainingExplainSeconds: 3600 * 24,
    remainingConcludeSeconds: 3600 * 48,
    violationDate: '2026-06-22T00:00:00Z',
  },
  {
    id: 2,
    minutesCode: 'BB-000002',
    createdAt: '2026-06-23T09:00:00Z',
    createdBranchId: '1001',
    createdBranchName: 'Chi nhánh Hà Nội',
    createdPostOfficeId: '2004',
    createdPostOfficeName: 'Bưu cục Quận 3',
    createdPostOfficeCode: 'BC_Q3',
    createdByEmployeeCode: 'STAFF001',
    createdByEmployeeName: 'Admin User',
    targetBranchId: '1002',
    targetBranchName: 'Chi nhánh Hồ Chí Minh',
    targetPostOfficeId: '2003',
    targetPostOfficeName: 'Bưu cục Quận 1',
    targetPostOfficeCode: 'BC_Q1',
    violatingPostOfficeName: 'Bưu cục Quận 1',
    status: 3,
    mistakeId: 2,
    mistakeCode: 'LOI_BE_VO_1',
    mistakeDescription: 'Làm vỡ sản phẩm do chèn xếp không cẩn thận',
    itemCodes: 'ORD-987654',
    createdViolatingPersons: 'Nguyễn Văn C',
    remainingExplainSeconds: 0,
    remainingConcludeSeconds: 0,
    violationDate: '2026-06-23T00:00:00Z',
  },
];

class ViolationReportService {
  async createErrorGroup(data: { code: string; name: string }): Promise<any> {
    const newGrp = { id: mockErrorGroups.length + 1, code: data.code, name: data.name };
    mockErrorGroups.push(newGrp);
    return { success: true, data: newGrp };
  }

  async getAllErrorGroup() {
    return { success: true, data: mockErrorGroups };
  }

  async createDetailError(data: ViolationErrorDetailData) {
    const grp = mockErrorGroups.find(g => g.id === Number(data.mistakeGroupId));
    const newDetail: ViolationErrorDetailRow = {
      id: mockErrorDetails.length + 1,
      mistakeGroupCode: grp?.code || '',
      mistakeGroupName: grp?.name || '',
      mistakeCode: data.mistakeCode,
      mistakeName: data.mistakeCode,
      mistakeDescription: data.mistakeDescription,
      processExpiredTime: data.processExpiredTime,
      concludeExpiredTime: data.concludeExpiredTime,
      isAutoClose: data.isAutoClose,
      isUnique: data.isUnique,
      isCompensatory: data.isCompensatory,
      individualPenaltyScore: 1,
      moneyPenalty: 100000,
      individualBonusScore: 0,
      managerPenaltyScore: 0,
      agencyPenaltyScore: 0,
      effectiveFrom: new Date().toISOString(),
      effectiveTo: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    };
    mockErrorDetails.push(newDetail);
    return { success: true, data: newDetail };
  }

  async editDetailError(id: number, data: ViolationErrorDetailData) {
    const grp = mockErrorGroups.find(g => g.id === Number(data.mistakeGroupId));
    mockErrorDetails = mockErrorDetails.map((item) =>
      item.id === id
        ? {
            ...item,
            mistakeGroupCode: grp?.code || '',
            mistakeGroupName: grp?.name || '',
            mistakeCode: data.mistakeCode,
            mistakeDescription: data.mistakeDescription,
            processExpiredTime: data.processExpiredTime,
            concludeExpiredTime: data.concludeExpiredTime,
            isAutoClose: data.isAutoClose,
            isUnique: data.isUnique,
            isCompensatory: data.isCompensatory,
          }
        : item
    );
    return { success: true };
  }

  async getListErrorDetail(params: { keyword?: string; limit?: number; offset?: number }): Promise<ViolationErrorDetailListResponse> {
    const page = params.offset ?? 1;
    const size = params.limit ?? 10;
    
    return {
      data: {
        pagination: {
          totalPages: Math.ceil(mockErrorDetails.length / size),
          totalElements: mockErrorDetails.length,
          page: page,
          size: size,
        },
        page_data: mockErrorDetails.slice((page - 1) * size, page * size),
      },
    };
  }

  async getDetailErrorDetail(id: number): Promise<{ data: ViolationDetailErrorDetailData; success: boolean }> {
    const found = mockErrorDetails.find(item => item.id === id) || mockErrorDetails[0];
    return {
      success: true,
      data: {
        mistakeGroup: {
          code: found.mistakeGroupCode,
          name: found.mistakeGroupName,
        },
        mistakeInfo: {
          tenant: 1,
          createdAt: new Date().toISOString(),
          createdBy: {
            id: '1',
            username: 'admin',
            fullName: 'Admin User',
            tenantId: 1,
            locale: 'vi-VN',
            postCode: 'BC_DD',
          },
          createdByUsername: 'admin',
          updatedAt: new Date().toISOString(),
          updatedByUsername: 'admin',
          id: found.id,
          mistakeGroupId: 1,
          mistakeCode: found.mistakeCode,
          mistakeDescription: found.mistakeDescription,
          processExpiredTime: found.processExpiredTime,
          concludeExpiredTime: found.concludeExpiredTime,
          isAutoClose: found.isAutoClose,
          isUnique: found.isUnique,
          isCompensatory: found.isCompensatory,
          individualPenaltyScore: found.individualPenaltyScore,
          moneyPenalty: found.moneyPenalty,
          individualBonusScore: found.individualBonusScore,
          managerPenaltyScore: found.managerPenaltyScore,
          agencyPenaltyScore: found.agencyPenaltyScore,
          effectiveFrom: [2026, 6, 20, 0, 0, 0],
          effectiveTo: [2026, 12, 31, 23, 59, 59],
          is_deleted: false,
        },
      },
    };
  }

  async deleteErrorCode(data: {
    id: number;
    isDeleteMistakeGrp: boolean;
    isDeleteMistakeOnly: boolean;
  }) {
    mockErrorDetails = mockErrorDetails.filter(item => item.id !== data.id);
    return { success: true };
  }

  async getDetailErrorHistory(code: string) {
    return {
      success: true,
      data: [
        {
          id: 1,
          mistakeGroupId: 1,
          mistakeGroupCode: 'G_CHAM_GIAO',
          mistakeGroupName: 'Nhóm lỗi chậm giao hàng',
          mistakeCode: code,
          mistakeDescription: 'Mô tả ban đầu',
          processExpiredTime: 24,
          concludeExpiredTime: 48,
          isAutoClose: false,
          isUnique: false,
          isCompensatory: false,
          individualPenaltyScore: 1,
          moneyPenalty: 100000,
          individualBonusScore: 0,
          managerPenaltyScore: 0,
          agencyPenaltyScore: 0,
          effectiveFrom: new Date().toISOString(),
          effectiveTo: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          updatedByUsername: 'admin',
        },
      ],
    };
  }

  async createMinutes(data: CreateMinutesRequest): Promise<CreateMinutesResponse> {
    const mistake = mockErrorDetails.find(m => m.id === data.mistakeId) || mockErrorDetails[0];
    const itemCode = data.items?.[0]?.itemCode || 'ORD-999999';
    const newItem = {
      id: mockMinutes.length + 1,
      minutesCode: `BB-00000${mockMinutes.length + 1}`,
      createdAt: new Date().toISOString(),
      createdBranchId: '1001',
      createdBranchName: 'Chi nhánh Hà Nội',
      createdPostOfficeId: data.targetPostOfficeId || '2001',
      createdPostOfficeName: 'Bưu cục Đống Đa',
      createdPostOfficeCode: 'BC_DD',
      createdByEmployeeCode: 'STAFF001',
      createdByEmployeeName: 'Admin User',
      targetBranchId: data.targetBranchId || '1001',
      targetBranchName: 'Chi nhánh Hà Nội',
      targetPostOfficeId: data.targetPostOfficeId || '2001',
      targetPostOfficeName: 'Bưu cục Đống Đa',
      targetPostOfficeCode: 'BC_DD',
      violatingPostOfficeName: 'Bưu cục Đống Đa',
      status: 1,
      mistakeId: data.mistakeId,
      mistakeCode: mistake.mistakeCode,
      mistakeDescription: data.content || mistake.mistakeDescription,
      itemCodes: itemCode,
      createdViolatingPersons: data.createdViolatingPersons?.[0]?.personName || 'Nguyễn Văn A',
      remainingExplainSeconds: 3600 * 24,
      remainingConcludeSeconds: 3600 * 48,
      violationDate: new Date().toISOString(),
    };
    mockMinutes.push(newItem);

    return {
      success: true,
      data: {
        id: newItem.id,
        minutesCode: newItem.minutesCode,
      },
    };
  }

  async getListMinutesInComing(
    data: ViolationReportQueryParams
  ): Promise<ViolationReportListResponse> {
    const page = data.page ?? 1;
    const size = data.size ?? 10;

    return {
      success: true,
      data: {
        pagination: {
          limit: size,
          totalElements: mockMinutes.length,
          totalPages: Math.ceil(mockMinutes.length / size),
          currentPage: page,
        },
        page_data: mockMinutes.slice((page - 1) * size, page * size),
      },
    };
  }

  async getMinutesInComingExport(_data: ViolationReportQueryParams) {
    return new Blob(['fake minutes incoming export'], { type: 'application/vnd.ms-excel' });
  }

  async getListMinutesOutGoing(
    data: ViolationReportQueryParams
  ): Promise<ViolationReportListResponse> {
    return this.getListMinutesInComing(data);
  }

  async getMinutesOutGoingExport(_data: ViolationReportQueryParams) {
    return new Blob(['fake minutes outgoing export'], { type: 'application/vnd.ms-excel' });
  }

  async getDetailMinutesDetail(id: number): Promise<MinutesDetailResponse> {
    const found = mockMinutes.find(m => m.id === id) || mockMinutes[0];
    return {
      success: true,
      data: {
        id: found.id,
        minutesCode: found.minutesCode,
        refMinutesCode: '',
        status: found.status,
        createdAt: found.createdAt,
        createdPostOfficeId: found.createdPostOfficeId,
        createdPostOfficeCode: found.createdPostOfficeCode,
        createdPostOfficeName: found.createdPostOfficeName,
        createdBranchId: found.createdBranchId,
        createdBranchName: found.createdBranchName,
        createdByEmployeeId: '1',
        createdByEmployeeCode: found.createdByEmployeeCode,
        createdByEmployeeName: found.createdByEmployeeName,
        targetBranchId: found.targetBranchId,
        targetPostOfficeId: found.targetPostOfficeId,
        targetPostOfficeCode: found.targetPostOfficeCode,
        targetPostOfficeName: found.targetPostOfficeName,
        targetBranchName: found.targetBranchName,
        mistakeId: found.mistakeId,
        mistakeCode: found.mistakeCode,
        mistakeDescription: found.mistakeDescription,
        content: found.mistakeDescription,
        createdViolatingPersons: [
          {
            personId: 2,
            personCode: 'STAFF002',
            personName: found.createdViolatingPersons,
          },
        ],
        attachedFiles: [],
        actions: [
          {
            id: 1,
            actionType: 'Tạo mới',
            content: 'Tạo mới biên bản lỗi',
            actorId: 1,
            actorCode: 'STAFF001',
            actorName: 'Admin User',
            actorPostOfficeId: 2002,
            actorPostOfficeCode: 'BC_CG',
            actorPostOfficeName: 'Bưu cục Cầu Giấy',
            createdAt: found.createdAt,
          },
        ],
        items: [
          {
            itemType: 'Hộp giấy',
            itemCode: found.itemCodes,
            rootPostOfficeId: 2001,
            rootPostOfficeCode: 'BC_DD',
            rootPostOfficeName: 'Bưu cục Đống Đa',
            loadCode: 'LOAD001',
            complaintCodes: '',
          },
        ],
        minutesProcessHistories: [],
        minutesProcessViolatingHistories: [],
        isCompensatory: false,
        explainExpiredAt: new Date(Date.now() + 3600 * 24 * 1000).toISOString(),
        concludeExpiredAt: new Date(Date.now() + 3600 * 48 * 1000).toISOString(),
      },
    };
  }

  async getUserByRole(_params: { keyword?: string; limit?: number; roleCode?: string }) {
    return {
      success: true,
      data: [
        { userId: 1, userName: 'admin', staffCode: 'STAFF001', fullName: 'Admin User', phoneNumber: '0123456789' },
        { userId: 2, userName: 'user1', staffCode: 'STAFF002', fullName: 'Nhân viên B', phoneNumber: '0909090909' },
      ],
    };
  }

  async getUserBranchUnConfig(): Promise<{ data: BranchUnConfigData[]; success: boolean }> {
    return {
      success: true,
      data: [
        { departmentId: '1002', code: 'CN_HCM', name: 'Chi nhánh Hồ Chí Minh', parentDepartmentId: '1', parentDepartmentCode: 'ROOT' },
        { departmentId: '1003', code: 'CN_DN', name: 'Chi nhánh Đà Nẵng', parentDepartmentId: '1', parentDepartmentCode: 'ROOT' },
      ],
    };
  }

  async getUserBranch(params: { page?: number; size?: number }): Promise<ViolationErrorGeneralListResponse> {
    const page = params.page ?? 1;
    const size = params.size ?? 10;
    return {
      data: {
        pagination: {
          totalPages: Math.ceil(mockUserBranches.length / size),
          totalElements: mockUserBranches.length,
          page: page,
          size: size,
        },
        page_data: mockUserBranches.slice((page - 1) * size, page * size),
      },
    };
  }

  async createUserBranch(data: ViolationUserBranchData) {
    const newAssign: ViolationReportGeneralRow = {
      id: mockUserBranches.length + 1,
      employee_id: data.employee_id,
      employee_code: data.employee_code,
      employee_name: data.employee_name,
      assigned_branches: data.assigned_branches.map((b) => ({
        branch_id: b.branch_id,
        branch_code: b.branch_code,
        branch_name: b.branch_name,
      })),
    };
    mockUserBranches.push(newAssign);
    return { success: true, data: newAssign };
  }

  async editUserBranch(inspector_assignment_id: number, data: ViolationUserBranchData) {
    mockUserBranches = mockUserBranches.map((item) =>
      item.id === inspector_assignment_id
        ? {
            ...item,
            employee_id: data.employee_id,
            employee_code: data.employee_code,
            employee_name: data.employee_name,
            assigned_branches: data.assigned_branches.map((b) => ({
              branch_id: b.branch_id,
              branch_code: b.branch_code,
              branch_name: b.branch_name,
            })),
          }
        : item
    );
    return { success: true };
  }

  async getListAccessibleBranches(): Promise<BranchResponse> {
    return {
      success: true,
      data: [
        { departmentId: '1001', code: 'CN_HN', name: 'Chi nhánh Hà Nội' },
        { departmentId: '1002', code: 'CN_HCM', name: 'Chi nhánh Hồ Chí Minh' },
      ],
    };
  }

  async getListAccessiblePostOffice(branchId: string): Promise<PostOfficeResponse> {
    return {
      success: true,
      data: [
        { departmentId: '2001', code: 'BC_DD', name: 'Bưu cục Đống Đa', parentDepartmentId: branchId || '1001' },
        { departmentId: '2002', code: 'BC_CG', name: 'Bưu cục Cầu Giấy', parentDepartmentId: branchId || '1001' },
      ],
    };
  }

  async getListMistakeFromGroup(
    mistakeGrpId: number
  ): Promise<{ success: boolean; data: ViolationErrorDetailRow[] }> {
    const grp = mockErrorGroups.find(g => g.id === mistakeGrpId);
    const filtered = mockErrorDetails.filter(d => d.mistakeGroupCode === grp?.code);
    return { success: true, data: filtered };
  }

  async deleteUserBranch(inspector_assignment_id: number) {
    mockUserBranches = mockUserBranches.filter(item => item.id !== inspector_assignment_id);
    return { success: true };
  }

  async getListOriginLookUp(data: {
    code?: string;
    type?: string;
  }): Promise<{ success: boolean; data: OrderSearchViolation }> {
    return {
      success: true,
      data: {
        code: data.code || 'ORD-123456',
        type: data.type || 'ORDER',
        origin_postcode: 'BC_DD',
        current_package_code: 'PKG001',
        origin_post_code_id: '2001',
        origin_post_code_name: 'Bưu cục Đống Đa',
        complaint_count: 0,
      },
    };
  }

  async uploadFile(_files: File[]) {
    return {
      success: true,
      data: [],
    };
  }

  async processExplainViolation(data: ProcessExplainViolationData) {
    mockMinutes = mockMinutes.map(m =>
      m.id === data.minutesId ? { ...m, status: 2 } : m
    );
    return { success: true };
  }

  async processOpinionViolation(_data: ProcessExplainViolationData) {
    return { success: true };
  }

  async processConcludeViolation(data: ViolationReportConcludeData) {
    mockMinutes = mockMinutes.map(m =>
      m.id === data.minutesId ? { ...m, status: 3 } : m
    );
    return { success: true };
  }

  async getListViolationConclude(params: ViolationReportQueryParams) {
    return this.getListMinutesInComing(params);
  }

  async getViolationConcludeExport(_params: ViolationReportQueryParams) {
    return new Blob(['fake violation conclusion export'], { type: 'application/vnd.ms-excel' });
  }

  async getConfigBranchByUserID(_user_id: number) {
    return {
      success: true,
      data: [
        { departmentId: '1001', code: 'CN_HN', name: 'Chi nhánh Hà Nội', parentDepartmentId: '1', parentDepartmentCode: 'ROOT' },
      ],
    };
  }

  async createViolatedOffice(_data: DataViolatedOffice) {
    return { success: true };
  }

  async editViolatedOffice(_data: DataViolatedOffice) {
    return { success: true };
  }

  async getAllMistake(_params: { keyword?: string; limit?: number; offset?: number }): Promise<ViolationErrorDetailListResponse> {
    return {
      data: {
        page_data: mockErrorDetails,
        pagination: {
          totalPages: 1,
          totalElements: mockErrorDetails.length,
          page: 1,
          size: 10,
        },
      },
    };
  }

  async getLisReportRate(
    _data: ViolationRateReportQueryParams
  ): Promise<ViolationRateReportListResponse> {
    return {
      success: true,
      data: [
        {
          zone: 'Miền Bắc',
          branchId: 'BR001',
          branchName: 'Chi nhánh Hà Nội',
          postOfficeId: 'PO001',
          postOfficeName: 'Bưu cục Đống Đa',
          newIncoming: 12,
          closedIncoming: 10,
          doneIncoming: 8,
          totalPenaltyScore: 5,
        },
      ],
    };
  }

  async exportViolationRateReport(_data: ViolationRateReportQueryParams): Promise<Blob> {
    return new Blob(['fake violation rate report export'], { type: 'application/vnd.ms-excel' });
  }
}

export const violationReportService = new ViolationReportService();
