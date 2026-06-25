import api from '@/config/axios';
import type {
  BranchUnConfigData,
  ViolationDetailErrorDetailData,
  ViolationErrorDetailData,
  ViolationErrorDetailListResponse,
  ViolationErrorGeneralListResponse,
  ViolationHistoryErrorDetailData,
  CreateMinutesRequest,
  CreateMinutesResponse,
  ViolationErrorDetailRow,
  ViolationUserBranchData,
  ProcessExplainViolationData,
  DataViolatedOffice,
  ViolationReportConcludeData,
} from '@/types/violation-report';
import type {
  ViolationReportListResponse,
  ViolationReportQueryParams,
  MinutesDetailResponse,
  ViolationRateReportQueryParams,
  ViolationRateReportListResponse,
} from '../types/violation-report-management';
import { cleanParams } from '../lib/utils';
import type { BranchResponse, PostOfficeResponse } from '../types/post-office';
import type { OrderSearchViolation } from '../components/pages/violation-report-conclude/TrackingCodeInput';

class ViolationReportService {
  async createErrorGroup(data: { code: string; name: string }) {
    const response = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/mistake-group`,
      data
    );

    return response.data;
  }

  async getAllErrorGroup() {
    const res = await api.get<{ data: Array<{ id: number; code: string; name: string }> }>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/mistake-group`
    );

    return res.data;
  }

  async createDetailError(data: ViolationErrorDetailData) {
    const response = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/mistake`,
      data
    );

    return response.data;
  }

  async editDetailError(id: number, data: ViolationErrorDetailData) {
    const response = await api.put(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/mistake/${id}`,
      data
    );
    return response.data;
  }

  async getListErrorDetail(params: { keyword?: string; limit?: number; offset?: number }) {
    // limit: count per page
    // offset: current page, start = 0
    const res = await api.get<ViolationErrorDetailListResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/mistake/search`,
      { params }
    );

    return res.data;
  }

  async getDetailErrorDetail(id: number) {
    const res = await api.get<{ data: ViolationDetailErrorDetailData; success: boolean }>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/mistake/${id}`
    );

    return res.data;
  }

  async deleteErrorCode(data: {
    id: number;
    isDeleteMistakeGrp: boolean;
    isDeleteMistakeOnly: boolean;
  }) {
    const response = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/mistake/${data.id}/delete`,
      data
    );

    return response.data;
  }

  async getDetailErrorHistory(code: string) {
    const res = await api.get<{ data: ViolationHistoryErrorDetailData[]; success: boolean }>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/mistake/edit-history`,
      { params: { mistakeCode: code } }
    );

    return res.data;
  }

  async createMinutes(data: CreateMinutesRequest) {
    const response = await api.post<CreateMinutesResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes`,
      data
    );

    return response.data;
  }

  async getListMinutesInComing(
    data: ViolationReportQueryParams
  ): Promise<ViolationReportListResponse> {
    const response = await api.get<ViolationReportListResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/incoming`,
      { params: cleanParams(data) }
    );

    return response.data;
  }

  async getMinutesInComingExport(data: ViolationReportQueryParams) {
    const response = await api.get(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/incoming/export`,
      { params: cleanParams(data), responseType: 'blob' }
    );

    return response.data;
  }

  async getListMinutesOutGoing(
    data: ViolationReportQueryParams
  ): Promise<ViolationReportListResponse> {
    const response = await api.get<ViolationReportListResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/outgoing`,
      { params: cleanParams(data) }
    );

    return response.data;
  }

  async getMinutesOutGoingExport(data: ViolationReportQueryParams) {
    const response = await api.get(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/outgoing/export`,
      { params: cleanParams(data), responseType: 'blob' }
    );

    return response.data;
  }

  async getDetailMinutesDetail(id: number) {
    const res = await api.get<MinutesDetailResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/${id}`
    );

    return res.data;
  }
  async getUserByRole(params: { keyword?: string; limit?: number; roleCode?: string }) {
    const res = await api.get<{
      data: Array<{
        userId: number;
        userName: string;
        staffCode: string;
        fullName: string;
        phoneNumber: string;
      }>;
      success: boolean;
    }>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/departments/user/search-by-role-code`,
      { params }
    );
    return res.data;
  }

  async getUserBranchUnConfig() {
    const res = await api.get<{ data: BranchUnConfigData[]; success: boolean }>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/user-branch/unconfigured-branches`
    );

    return res.data;
  }

  async getUserBranch(params: { page?: number; size?: number }) {
    const res = await api.get<ViolationErrorGeneralListResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/user-branch`,
      { params }
    );
    return res.data;
  }

  async createUserBranch(data: ViolationUserBranchData) {
    const res = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/user-branch`,
      data
    );
    return res.data;
  }

  async editUserBranch(inspector_assignment_id: number, data: ViolationUserBranchData) {
    const res = await api.put(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/user-branch/${inspector_assignment_id}`,
      data
    );
    return res.data;
  }

  async getListAccessibleBranches(): Promise<BranchResponse> {
    const res = await api.get<BranchResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/departments/user/accessible-branches`
    );

    return res.data;
  }
  async getListAccessiblePostOffice(branchId: string): Promise<PostOfficeResponse> {
    const res = await api.get<PostOfficeResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/departments/user/accessible-post-offices`,
      { params: { branchId } }
    );

    return res.data;
  }

  async getListMistakeFromGroup(
    mistakeGrpId: number
  ): Promise<{ success: boolean; data: ViolationErrorDetailRow[] }> {
    // lấy chi tiết lỗi từ nhóm lỗi khi tạo biên bản
    const res = await api.get<{ success: boolean; data: ViolationErrorDetailRow[] }>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/mistake`,
      { params: { mistakeGrpId } }
    );

    return res.data;
  }

  async deleteUserBranch(inspector_assignment_id: number) {
    const res = await api.delete(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/user-branch/${inspector_assignment_id}`
    );

    return res.data;
  }

  async getListOriginLookUp(data: {
    code?: string;
    type?: string;
  }): Promise<{ success: boolean; data: OrderSearchViolation }> {
    const res = await api.get(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/orders/origin-lookup`,
      { params: data }
    );

    return res.data;
  }

  async uploadFile(files: File[]) {
    const formdata = new FormData();
    files.forEach((file) => {
      formdata.append('files', file);
    });

    const res = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/files/upload-multiple`,
      formdata,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  }

  async processExplainViolation(data: ProcessExplainViolationData) {
    const res = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/process/explain`,
      data
    );
    return res.data;
  }

  async processOpinionViolation(data: ProcessExplainViolationData) {
    const res = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/process/opinion`,
      data
    );
    return res.data;
  }

  async processConcludeViolation(data: ViolationReportConcludeData) {
    const res = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/process/conclude`,
      data
    );
    return res.data;
  }

  async getListViolationConclude(params: ViolationReportQueryParams) {
    const response = await api.get<ViolationReportListResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/conclusion`,
      { params: cleanParams(params) }
    );

    return response.data;
  }

  async getViolationConcludeExport(params: ViolationReportQueryParams) {
    const response = await api.get(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/conclusion/export`,
      { params: cleanParams(params), responseType: 'blob' }
    );

    return response.data;
  }

  async getConfigBranchByUserID(user_id: number) {
    const response = await api.get<{ data: BranchUnConfigData[]; success: boolean }>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/user-branch/configured-branches/${user_id}`
    );

    return response.data;
  }

  async createViolatedOffice(data: DataViolatedOffice) {
    const res = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/violated-office/add`,
      data
    );
    return res.data;
  }

  async editViolatedOffice(data: DataViolatedOffice) {
    const res = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/violated-office/update`,
      data
    );
    return res.data;
  }

  async getAllMistake(params: { keyword?: string; limit?: number; offset?: number }) {
    const res = await api.get(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/configs/mistake/search/all`,
      { params }
    );
    return res.data;
  }

  async getLisReportRate(
    data: ViolationRateReportQueryParams
  ): Promise<ViolationRateReportListResponse> {
    const response = await api.get<ViolationRateReportListResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/report/search`,
      { params: cleanParams(data) }
    );

    return response.data;
  }

  async exportViolationRateReport(data: ViolationRateReportQueryParams): Promise<Blob> {
    const response = await api.get<Blob>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/minutes/report/export`,
      { params: cleanParams(data), responseType: 'blob' }
    );
    return response.data;
  }
}

export const violationReportService = new ViolationReportService();
