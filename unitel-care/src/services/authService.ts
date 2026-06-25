import api from '@/config/axios';
import { TENANT_CODE } from '@/constants/common';
import { tokenService } from '@/lib/token';
import type {
  DataLogin,
  GetUserInfoParams,
  GetDepartmentPostResponse,
  getUserInfoResponse,
  LoginResponse,
  RefreshTokenParams,
} from '@/types/auth';

const prefix_gw = 'vtp-user/api/v1';

class AuthService {
  async login(data: DataLogin): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/${prefix_gw}/tokens`,
      data,
      {
        headers: {
          'x-client-id': 'TMS_ANDROID',
        },
      }
    );

    return response.data;
  }

  async getUserInfo({ username, department }: GetUserInfoParams): Promise<getUserInfoResponse> {
    const response = await api.get<getUserInfoResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/${prefix_gw}/users/${username}/with-department`,
      {
        params: { 'department-code': department, 'tenant-code': TENANT_CODE },
      }
    );

    return response.data;
  }

  async getTokenNew(data: RefreshTokenParams): Promise<LoginResponse> {
    const response = await api.put<LoginResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/${prefix_gw}/tokens`,
      data,
      {
        headers: {
          'x-client-id': 'TMS_ANDROID',
        },
      }
    );
    return response.data;
  }

  async getDepartmentUser(
    username: string,
    params?: { offset?: number; limit?: number; query?: string }
  ): Promise<GetDepartmentPostResponse> {
    const response = await api.get<GetDepartmentPostResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/${prefix_gw}/users/${username}/posts`,
      {
        params: {
          'tenant-code': TENANT_CODE,
          offset: params?.offset ?? 0,
          limit: params?.limit ?? 20,
          ...(params?.query ? { query: params.query } : {}),
        },
        headers: {
          'x-need-count': true,
        },
      }
    );

    return response.data;
  }

  async logout() {
    try {
      // Optional: Call logout API endpoint if exists
      // await api.post(`${import.meta.env.VITE_APP_BASE_URL_API}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens
      tokenService.clear();
      // Redirect to login
      window.location.href = '/login';
    }
  }

  // Lấy tất cả quyền của user
  async getAllRoles(): Promise<{ data: string[] }> {
    const { data } = await api.get<{ data: string[] }>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/departments/user/roles`
    );
    return data;
  }
}

export const authService = new AuthService();
