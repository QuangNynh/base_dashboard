import { TENANT_CODE } from '@/constants/common';
import { tokenService } from '@/lib/token';
import type {
  DataLogin,
  GetUserInfoParams,
  GetDepartmentPostResponse,
  getUserInfoResponse,
  LoginResponse,
  RefreshTokenParams,
  UserInfoToken,
} from '@/types/auth';

function generateFakeToken(username: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadData: UserInfoToken = {
    aud: 'tms',
    azp: 'tms-app',
    'cth-branch-code': 'CN001',
    'cth-branch-id': '1',
    'cth-branch-path': '/1',
    'cth-full-name': 'Admin User',
    'cth-password-changed': 'false',
    'cth-phone': '0123456789',
    'cth-post-code': 'DEP001',
    'cth-post-id': '101',
    'cth-post-path': '/1/101',
    'cth-role-code': 'ROLE_ADMIN',
    'cth-role-id': '99',
    'cth-scope': 'all',
    'cth-tenant-code': TENANT_CODE || 'TENANT01',
    'cth-tenant-id': '1',
    'cth-user-id': '1',
    'cth-username': username || 'admin',
    exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 30, // 30 days
    iat: Math.floor(Date.now() / 1000),
    iss: 'tms-auth',
    jti: 'fake-jti',
    realm_access: {
      roles: ['ROLE_ADMIN'],
    },
    resource_access: {
      account: {
        roles: ['manage-account'],
      },
    },
    scope: 'openid profile email',
    session_state: 'fake-session',
    sid: 'fake-sid',
    sub: 'fake-sub',
    typ: 'Bearer',
  };

  const payloadStr = JSON.stringify(payloadData);
  const payload = btoa(
    encodeURIComponent(payloadStr).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
  const signature = 'fake_signature';
  return `${header}.${payload}.${signature}`;
}

class AuthService {
  async login(data: DataLogin): Promise<LoginResponse> {
    if (data.username !== 'ninhvq' || data.password !== '123456') {
      throw new Error('Sai tài khoản hoặc mật khẩu');
    }
    const username = data.username;
    const fakeToken = generateFakeToken(username);

    return {
      accessToken: fakeToken,
      refreshToken: 'fake_refresh_token',
      tokenId: 'fake_token_id',
      httpStatusCode: 200,
      user: {
        id: '1',
        email: `${username}@example.com`,
        name: 'Ninh VQ',
        permissions: ['*'],
      },
    };
  }

  async getUserInfo({ username, department }: GetUserInfoParams): Promise<getUserInfoResponse> {
    const postCode = department || 'DEP001';
    return {
      userId: 1,
      tenantId: 1,
      departmentId: 101,
      username: username || 'admin',
      phone: '0123456789',
      firstName: 'Admin',
      lastName: 'User',
      fullName: 'Admin User',
      staffCode: 'STAFF001',
      email: `${username || 'admin'}@example.com`,
      department: {
        departmentId: 101,
        tenantId: 1,
        code: postCode,
        name: 'Chi nhánh Trung tâm',
        viVnName: 'Chi nhánh Trung tâm',
        parentDepartmentId: 1,
        parentDepartmentCode: 'ROOT',
        path: '/1/101',
        level: 2,
        type: 'DEP',
        status: 'ACTIVE',
      },
    };
  }

  async getTokenNew(data: RefreshTokenParams): Promise<LoginResponse> {
    const fakeToken = generateFakeToken(data.tenantCode || 'admin');
    return {
      accessToken: fakeToken,
      refreshToken: data.refreshToken,
      tokenId: data.tokenId,
      httpStatusCode: 200,
      user: {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        permissions: ['*'],
      },
    };
  }

  async getDepartmentUser(
    _username: string,
    _params?: { offset?: number; limit?: number; query?: string }
  ): Promise<GetDepartmentPostResponse> {
    return [
      {
        name: 'Chi nhánh Trung tâm',
        viVnName: 'Chi nhánh Trung tâm',
        enUsName: 'Center Branch',
        departmentId: 101,
        code: 'DEP001',
        status: 'ACTIVE',
      },
      {
        name: 'Chi nhánh Đống Đa',
        viVnName: 'Chi nhánh Đống Đa',
        enUsName: 'Dong Da Branch',
        departmentId: 102,
        code: 'DEP002',
        status: 'ACTIVE',
      },
    ];
  }

  async logout() {
    try {
      // Clear tokens
      tokenService.clear();
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async getAllRoles(): Promise<{ data: string[] }> {
    return {
      data: ['ROLE_ADMIN', 'ROLE_SUPERVISOR', 'ROLE_USER'],
    };
  }
}

export const authService = new AuthService();
