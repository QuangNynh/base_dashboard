export interface Branch {
  departmentId: string;
  code: string;
  name: string;
  parentDepartmentId?: string;
}

export interface BranchResponse {
  success: boolean;
  data: Branch[];
}

export interface PostOffice {
  departmentId: string;
  code: string;
  name: string;
  parentDepartmentId?: string;
  parentDepartmentCode?: string;
  parentDepartmentName?: string;
}

export interface PostOfficeResponse {
  success: boolean;
  data: PostOffice[];
}

export interface PostOfficeSlowResponse {
  success: boolean;
  data: PostOfficeSlow[];
}

export interface PostOfficeSlow {
  postcode: string;
  name: string;
  id: string;
  branch_code: string;
  branch_name: string;
  is_slowest: boolean;
}

export type Option = {
  value: string;
  label: string;
};

export interface PostMan {
  userId: number;
  fullName: string;
  account: string;
  code: string;
  phone: string;
}

export interface PostManResponse {
  success: boolean;
  data: PostMan[];
}

export interface ErrorCause {
  tenant?: number;
  id?: number;
  code?: string;
  description?: string;
  is_deleted: false;
  updated_by?: {
    id?: string;
    username?: string;
    fullName?: string;
    tenantId?: number;
    locale?: string;
    postCode?: string;
  };
}

export interface ErrorCauseResponse {
  success: boolean;
  data: {
    page_data: ErrorCause[];
    total: number;
  };
}

export interface ErrorCauseListRequest {
  keyword?: string;
  is_deleted?: boolean;
  page?: number;
  size?: number;
}
