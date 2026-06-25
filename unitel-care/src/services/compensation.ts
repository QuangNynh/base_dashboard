import api from '@/config/axios';
import { cleanParams } from '@/lib/utils';
import type {
  CompensationMoneyFilterParams,
  CompensationMoneyResponse,
  CompensationReportFilterParams,
  CompensationReportResponse,
  SignedFile,
  BankListItem,
  BankOption,
  CompensationDetailResponse,
  CompensationListQueryParams,
  CompensationListResponse,
  CompleteCompensationDataRequest,
  ConfirmPaymentFailedData,
  ConfirmPaymentSuccessData,
} from '@/types/compensation';

class CompensationService {
  async getPaymentList(params: CompensationMoneyFilterParams) {
    const res = await api.get<CompensationMoneyResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/compensation-cases/payment-list`,
      { params }
    );

    return res.data;
  }

  /**
   * Upload files to storage (same endpoint as other TMS flows); maps response to SignedFile[].
   */
  async uploadSignedFiles(files: File[]): Promise<SignedFile[]> {
    if (!files.length) return [];

    const formdata = new FormData();
    files.forEach((file) => {
      formdata.append('files', file);
    });

    const res = await api.post<{ data?: Array<{ name?: string; type?: string; path?: string }> }>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/files/upload-multiple`,
      formdata,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const items = res.data?.data ?? [];
    return items.map((f) => ({
      fileName: f?.name ?? '',
      url: f?.path ?? '',
      fileType: f?.type ?? '',
    }));
  }

  async confirmPaymentSuccess(data: ConfirmPaymentSuccessData) {
    const res = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/compensation-cases/confirm-payment-success`,
      data
    );

    return res.data;
  }

  async confirmPaymentFailed(data: ConfirmPaymentFailedData) {
    const res = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/compensation-cases/confirm-payment-fail`,
      data
    );

    return res.data;
  }

  async getCompensationReport(params: CompensationReportFilterParams) {
    const res = await api.get<CompensationReportResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/compensation-cases/report/search`,
      { params }
    );
    return res.data;
  }

  async getExampleFile() {
    const res = await api.get(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/compensation-cases/download-template-file`,
      { responseType: 'blob' }
    );
    return res.data;
  }

  async listCompensationCases(data: CompensationListQueryParams) {
    const response = await api.get<CompensationListResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/compensation-cases`,
      { params: cleanParams(data) }
    );

    return response.data;
  }

  async getDetailCompensation(id: number) {
    const res = await api.get<CompensationDetailResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/compensation-cases/${id}`
    );

    return res.data;
  }

  async completeCompensation(id: number, data: CompleteCompensationDataRequest) {
    const res = await api.put(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/compensation-cases/${id}/complete`,
      data
    );

    return res.data;
  }

  async getBankList(): Promise<BankOption[]> {
    const res = await api.get<{ data: BankListItem[] }>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/banks`
    );
    return (res.data.data ?? []).map((item) => ({
      value: item.bankCode,
      label: item.bankName,
    }));
  }

  async exportExelCompensationList(data: CompensationListQueryParams) {
    const response = await api.get(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/compensation-cases/export`,
      { params: cleanParams(data), responseType: 'blob' }
    );

    return response.data;
  }

  async getCompensationReportExcel(params: CompensationReportFilterParams) {
    const res = await api.get(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/compensation-cases/report/export`,
      { params, responseType: 'blob' }
    );
    return res.data;
  }

  async getCompensationReportExcelDetail(params: CompensationReportFilterParams) {
    const res = await api.get(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/compensation-cases/detail/export`,
      { params, responseType: 'blob' }
    );
    return res.data;
  }
}

export const compensationService = new CompensationService();
