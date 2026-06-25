import type {
  BranchResponse,
  ErrorCauseListRequest,
  ErrorCauseResponse,
  PostManResponse,
  PostOfficeResponse,
  PostOfficeSlowResponse,
} from '@/types/post-office';

class PostOfficeService {
  async getListBranch(): Promise<BranchResponse> {
    return {
      success: true,
      data: [
        { departmentId: '1001', code: 'CN_HN', name: 'Chi nhánh Hà Nội' },
        { departmentId: '1002', code: 'CN_HCM', name: 'Chi nhánh Hồ Chí Minh' },
        { departmentId: '1003', code: 'CN_DN', name: 'Chi nhánh Đà Nẵng' },
      ],
    };
  }

  async getPostMan(_postId: string): Promise<PostManResponse> {
    return {
      success: true,
      data: [
        { userId: 1, fullName: 'Nguyễn Văn A', account: 'nva', code: 'NV001', phone: '0901234567' },
        { userId: 2, fullName: 'Trần Thị B', account: 'ttb', code: 'NV002', phone: '0907654321' },
      ],
    };
  }

  async getPostManByTenant(postId: string): Promise<PostManResponse> {
    return this.getPostMan(postId);
  }

  async getListPostOffice(branchId: string): Promise<PostOfficeResponse> {
    const allPostOffices = [
      { departmentId: '2001', code: 'BC_DD', name: 'Bưu cục Đống Đa', parentDepartmentId: '1001' },
      { departmentId: '2002', code: 'BC_CG', name: 'Bưu cục Cầu Giấy', parentDepartmentId: '1001' },
      { departmentId: '2003', code: 'BC_Q1', name: 'Bưu cục Quận 1', parentDepartmentId: '1002' },
      { departmentId: '2004', code: 'BC_Q3', name: 'Bưu cục Quận 3', parentDepartmentId: '1002' },
      { departmentId: '2005', code: 'BC_HC', name: 'Bưu cục Hải Châu', parentDepartmentId: '1003' },
    ];
    const filtered = branchId ? allPostOffices.filter(po => po.parentDepartmentId === branchId) : allPostOffices;
    return {
      success: true,
      data: filtered,
    };
  }

  async getAllListPostOffice(): Promise<PostOfficeResponse> {
    return this.getListPostOffice('');
  }

  async getListUnitSlow(_userId: string): Promise<PostOfficeSlowResponse> {
    return {
      success: true,
      data: [
        {
          id: '2001',
          postcode: 'BC_DD',
          name: 'Bưu cục Đống Đa',
          branch_code: 'CN_HN',
          branch_name: 'Chi nhánh Hà Nội',
          is_slowest: true,
        },
      ],
    };
  }

  async getUsersByDepartment(departmentId: string): Promise<PostManResponse> {
    return this.getPostMan(departmentId);
  }

  async getErrorCauses(_params?: ErrorCauseListRequest): Promise<ErrorCauseResponse> {
    return {
      success: true,
      data: {
        total: 2,
        page_data: [
          { id: 1, code: 'LOI_VAN_CHUYEN', description: 'Lỗi tài xế chạy ẩu làm hỏng hàng', is_deleted: false },
          { id: 2, code: 'LOI_PHAN_LOAI', description: 'Lỗi chia chọn sai bưu cục', is_deleted: false },
        ],
      },
    };
  }

  async getListPostOfficeByTenant(branchId: string): Promise<PostOfficeResponse> {
    return this.getListPostOffice(branchId);
  }
}

export const postOfficeService = new PostOfficeService();
