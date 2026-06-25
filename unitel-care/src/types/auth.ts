export interface UserInfoToken {
  aud: string;
  azp: string;
  'cth-branch-code': string;
  'cth-branch-id': string;
  'cth-branch-path': string;
  'cth-full-name': string;
  'cth-password-changed': string;
  'cth-phone': string;
  'cth-post-code': string;
  'cth-post-id': string;
  'cth-post-path': string;
  'cth-role-code': string;
  'cth-role-id': string;
  'cth-scope': string;
  'cth-tenant-code': string;
  'cth-tenant-id': string;
  'cth-user-id': string;
  'cth-username': string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  realm_access: {
    roles: string[];
  };
  resource_access: {
    account: {
      roles: string[];
    };
  };
  scope: string;
  session_state: string;
  sid: string;
  sub: string;
  typ: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DataLogin {
  username: string;
  password: string;
  tenantCode: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  tokenId?: string;
  httpStatusCode?: number;
  detail?: string;
  errorCode?: string;
  passwordChanged?: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    [key: string]: unknown;
    permissions: string[];
  } | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: LoginResponse['user'] | null;
  token: string | null;
}
export interface GetUserInfoParams {
  username: string;
  department?: string;
}

export interface RefreshTokenParams {
  departmentCode: string;
  tokenId: string;
  refreshToken: string;
  tenantCode: string;
}

export interface getUserInfoResponse {
  userId?: number;
  tenantId?: number;
  departmentId?: number;
  username?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  staffCode?: string;
  department?: department;
  email?: string;
}

export interface department {
  departmentId?: number;
  tenantId?: number;
  code?: string;
  name?: string;
  translateName?: string;
  parentDepartmentId?: number;
  parentDepartmentCode?: string;
  path?: string;
  level?: number;
  type?: string;
  viVnName?: string;
  enUsName?: string;
  myMmName?: string;
  kmKhmName?: string;
  loLaoName?: string;
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
}

/** Mỗi item từ API GET /users/{username}/post */
export interface DepartmentPost {
  name?: string;
  viVnName?: string;
  enUsName?: string;
  myMmName?: string;
  kmKhmName?: string;
  loLaoName?: string;
  departmentId?: number;
  parentDepartmentId?: number;
  parentDepartmentCode?: string;
  path?: string;
  level?: number;
  type?: string;
  code?: string;
  phone?: string;
  hpoUsername?: string;
  pomUsername?: string;
  status?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
}

/** Response từ API GET /users/{username}/post (trả về mảng trực tiếp) */
export type GetDepartmentPostResponse = DepartmentPost[];
