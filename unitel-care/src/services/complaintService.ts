import api from '@/config/axios';
import i18n from '@/i18n';
import { cleanParams } from '@/lib/utils';
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
} from '@/types/complaint-management';

class ComplaintService {
  async getListComplaint(data: ComplaintQueryParams): Promise<ComplaintListResponse> {
    const response = await api.get<ComplaintListResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints`,
      { params: cleanParams(data) }
    );

    return response.data;
  }

  async getHistoryPostOfficeComplaint(
    data: PaginationSearch,
    id: string
  ): Promise<PostOfficeHistoryResponse> {
    const response = await api.get<PostOfficeHistoryResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/${id}/history`,
      { params: cleanParams(data) }
    );

    return response.data;
  }

  async getHistoryDetail(historyId: number): Promise<HistoryDetailResponse> {
    const response = await api.get<HistoryDetailResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/history/${historyId}`
    );
    return response.data;
  }

  async getHistoryAttachmentDownloadUrl(key: string, name: string): Promise<DownloadUrlResponse> {
    const response = await api.get<DownloadUrlResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/history/attachments/download-url`,
      { params: { key, name } }
    );
    return response.data;
  }

  async createTtvhEvaluation(id: string, data: CreateTtvhEvaluation) {
    const response = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/${id}/ttvh-evaluation`,
      data
    );
    return response.data;
  }

  async getHistoryRatingComplaint(
    data: PaginationSearch,
    id: string
  ): Promise<HistoryRatingResponse> {
    const response = await api.get<HistoryRatingResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/${id}/ttvh-evaluation/history`,
      { params: cleanParams(data) }
    );

    return response.data;
  }
  async exportComplaint(data: ComplaintQueryParams) {
    const response = await api.get(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/export`,
      { params: cleanParams(data), responseType: 'blob' }
    );

    return response.data;
  }
  async getComplainDetail(id: string): Promise<ComplaintDetailResponse> {
    const response = await api.get<ComplaintDetailResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/${id}`
    );

    return response.data;
  }

  async getListErrorCauses(data: ErrorCauseSearch): Promise<ErrorCauseResponse> {
    const response = await api.get<ErrorCauseResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/error-causes`,
      { params: data }
    );

    return response.data;
  }

  async createErrorCause(data: CreateErrorCauseData): Promise<ErrorCauseResponse> {
    const response = await api.post<ErrorCauseResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/error-causes`,
      data
    );

    return response.data;
  }
  async updateErrorCause(data: CreateErrorCauseData, id: string): Promise<ErrorCauseResponse> {
    const response = await api.put<ErrorCauseResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/error-causes/${id}`,
      data
    );

    return response.data;
  }
  async getHistoryErrorCause(data: ErrorCauseSearch, id: number): Promise<ErrorCauseResponse> {
    const response = await api.get<ErrorCauseResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/error-causes/${id}/history`,
      { params: data }
    );

    return response.data;
  }
  async getExtensionReasonData(data: ErrorCauseSearch): Promise<ExtensionReasonResponse> {
    const response = await api.get<ExtensionReasonResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/extension-reasons`,
      { params: data }
    );

    return response.data;
  }
  async createExtensionReason(data: CreateExtensionReasonData) {
    const response = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/extension-reasons`,
      data
    );

    return response.data;
  }
  async updateExtensionReason(data: CreateExtensionReasonData, id: string) {
    const response = await api.put(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/extension-reasons/${id}`,
      data
    );

    return response.data;
  }
  async getHistoryExtensionReason(
    data: ErrorCauseSearch,
    id: number
  ): Promise<ExtensionReasonResponse> {
    const response = await api.get<ExtensionReasonResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/extension-reasons/${id}/history`,
      { params: data }
    );

    return response.data;
  }

  async getFeedbackLevel1Data(data: FeedbackLevel1Params): Promise<FeedbackLevelResponse> {
    const response = await api.get<FeedbackLevelResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaint-categories/level1/search`,
      { params: data }
    );
    return response.data;
  }
  async getAssignmentSetUp(data: AssignmentSetupParam): Promise<AssignmentSetupResponse> {
    const response = await api.get<AssignmentSetupResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/supervisor-configs/all`,
      { params: data }
    );
    return response.data;
  }

  async deleteAssignmentSetUp(employeeCode: string): Promise<{ success: boolean; data: null }> {
    const response = await api.delete(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/supervisor-configs/${employeeCode}`
    );
    return response.data;
  }

  async updateAssignmentSetUp(
    employeeCode: string,
    departmentIds: string[]
  ): Promise<{ success: boolean; data: unknown }> {
    const response = await api.put(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/supervisor-configs/employee/${employeeCode}/managing-branches`,
      { departmentIds }
    );
    return response.data;
  }

  async getFeedbackLevel2Data(data: FeedbackLevel2Params): Promise<FeedbackLevelResponse> {
    const response = await api.get<FeedbackLevelResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaint-categories/level2/search`,
      { params: data }
    );

    return response.data;
  }
  async createFeedbackLevel1(data: CreateFeedbackLevel1Data | CreateFeedbackLevel2Data) {
    const response = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaint-categories`,
      data
    );

    return response.data;
  }
  async updateFeedbackLevel1(data: CreateFeedbackLevel1Data, id: string) {
    const response = await api.put(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaint-categories/${id}`,
      data
    );

    return response.data;
  }
  async getHistoryFeedbackLevel1(
    data: ErrorCauseSearch,
    id: number
  ): Promise<FeedbackLevelResponse> {
    const response = await api.get<FeedbackLevelResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaint-categories/${id}/history`,
      { params: data }
    );

    return response.data;
  }

  async getInformationTrackingCode(orderCode: string): Promise<TrackingCodeResponse> {
    const response = await api.get<TrackingCodeResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/customers/by-order/${orderCode}`
    );

    return response.data;
  }
  async createComplaint(data: FormData) {
    const response = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  async updateComplaint(id: string, data: FormData) {
    const response = await api.patch(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/${id}/edit`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  async updateComplaintHandling(id: string, data: FormData) {
    const response = await api.put(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/${id}`,
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data;
  }

  async receiveComplaint(id: string) {
    const response = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/${id}/receive`
    );

    return response.data;
  }

  async processComplaint(id: string, data: FormData) {
    const response = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/${id}/process`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  async completeComplaint(id: string, data: { internalNote?: string }) {
    const response = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/${id}/complete`,
      data
    );

    return response.data;
  }

  async getDetailFeedbackLevel(id: string): Promise<FeedbackLevelDetailResponse> {
    const response = await api.get<FeedbackLevelDetailResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaint-categories/${id}`
    );

    return response.data;
  }

  async getOrderTracking(orderId: string): Promise<OrderTrackingResponse> {
    const response = await api.get<OrderTrackingResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/orders/${orderId}/tracking`
    );

    return response.data;
  }

  async getListComplaintRateReport(
    params: ComplaintRateReportQueryParams
  ): Promise<ComplaintRateReportResponse<ComplaintRateReportItem[]>> {
    const response = await api.get<ComplaintRateReportResponse<ComplaintRateReportItem[]>>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/resolution-report`,
      { params }
    );

    return response?.data;
  }

  async exportExcelComplaintRateReport(data: ComplaintRateReportQueryParams): Promise<Blob> {
    const response = await api.get<Blob>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/complaints/resolution-report/export`,
      { params: cleanParams(data), responseType: 'blob' }
    );
    return response.data;
  }

  async getRecordsByOrderCode(
    orderCode: string,
    params: { page: number; size: number }
  ): Promise<RecordListResponse> {
    const response = await api.get<RecordListResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/orders/${orderCode}/records`,
      { params }
    );

    return response.data;
  }

  async getTrackingStatusEnum(): Promise<{ TrackingOrderStatus: Record<string, string> }> {
    const ACCEPT_LANGUAGE_MAP: Record<string, string> = {
      vi: 'vi-VN',
      en: 'en-US',
      lo: 'lo-LA',
      km: 'km-KH',
    };
    const acceptLanguage = ACCEPT_LANGUAGE_MAP[i18n.language] ?? 'lo-LA';
    const response = await api.get<{ TrackingOrderStatus: Record<string, string> }>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-tracking/api/v1/meta/enum`,
      { headers: { 'Accept-Language': acceptLanguage } }
    );
    return response.data;
  }
}

export const complaintService = new ComplaintService();
