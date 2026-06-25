import api from '@/config/axios';
import type {
  BranchResponse,
  ErrorCauseListRequest,
  ErrorCauseResponse,
  PostManResponse,
  PostOfficeResponse,
  PostOfficeSlowResponse,
} from '@/types/post-office';

class PostOfficeService {
  // Lấy danh sách chi nhánh của user
  async getListBranch(): Promise<BranchResponse> {
    const { data } = await api.get<BranchResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/departments/user/branches`
    );
    return data;
  }

  async getPostMan(postId: string): Promise<PostManResponse> {
    const { data } = await api.get<PostManResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/departments/${postId}/users`
    );
    return data;
  }

  async getPostManByTenant(postId: string): Promise<PostManResponse> {
    const { data } = await api.get<PostManResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/departments/${postId}/all-users`
    );
    return data;
  }

  // Lấy danh sách bưu cục theo chi nhánh
  async getListPostOffice(branchId: string): Promise<PostOfficeResponse> {
    const { data } = await api.get<PostOfficeResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/departments/user/post-offices`,
      { params: { branchId } }
    );
    return data;
  }
  // Lấy all danh sách bưu cục
  async getAllListPostOffice(): Promise<PostOfficeResponse> {
    const { data } = await api.get<PostOfficeResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/departments`
    );
    return data;
  }

  // Lấy danh sách đơn vị xử lý chậm muộn
  async getListUnitSlow(userId: string): Promise<PostOfficeSlowResponse> {
    const { data } = await api.get<PostOfficeSlowResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/${userId}/processing-units`
    );
    return data;
  }

  // Lấy danh sách user theo đơn vị (dùng cho cá nhân xử lý & cá nhân mắc lỗi)
  async getUsersByDepartment(departmentId: string): Promise<PostManResponse> {
    const { data } = await api.get<PostManResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/departments/${departmentId}/users`
    );
    return data;
  }

  // Lấy danh sách nguyên nhân mắc lỗi
  async getErrorCauses(params?: ErrorCauseListRequest): Promise<ErrorCauseResponse> {
    const { data } = await api.get<ErrorCauseResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/error-causes`,
      { params }
    );
    return data;
  }

  // Lấy danh sách bưu cục theo tenant user option chi nhánh
  async getListPostOfficeByTenant(branchId: string): Promise<PostOfficeResponse> {
    const { data } = await api.get<PostOfficeResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/departments/all-post-offices`,
      { params: { branchId } }
    );
    return data;
  }
}

export const postOfficeService = new PostOfficeService();
