import type {
  CompensationMoneyFilterParams,
  CompensationMoneyResponse,
  CompensationReportFilterParams,
  CompensationReportResponse,
  SignedFile,
  BankOption,
  CompensationDetailResponse,
  CompensationListQueryParams,
  CompensationListResponse,
  CompleteCompensationDataRequest,
  ConfirmPaymentFailedData,
  ConfirmPaymentSuccessData,
} from '@/types/compensation';

// Local temporary storage for simulating state updates
let mockCompensationCases = [
  {
    id: 1,
    compensationCode: 'BT-000001',
    minutesCode: 'BB-000001',
    itemCode: 'ITEM-000001',
    itemType: 'Hộp giấy',
    status: 1,
    caseType: 'Mất hàng',
    violatingPostOfficeSummary: 'Bưu cục Quận 1 - 50%, Bưu cục Quận 3 - 50%',
    createdPostOfficeCode: 'BC_Q1',
    createdPostOfficeName: 'Bưu cục Quận 1',
    rootPostOfficeCode: 'BC_Q1',
    rootPostOfficeName: 'Bưu cục Quận 1',
    goodsValue: 1500000,
    createdAt: '2026-06-20T10:00:00Z',
  },
  {
    id: 2,
    compensationCode: 'BT-000002',
    minutesCode: 'BB-000002',
    itemCode: 'ITEM-000002',
    itemType: 'Điện thoại',
    status: 2,
    caseType: 'Hỏng hóc',
    violatingPostOfficeSummary: 'Bưu cục Đống Đa - 100%',
    createdPostOfficeCode: 'BC_DD',
    createdPostOfficeName: 'Bưu cục Đống Đa',
    rootPostOfficeCode: 'BC_DD',
    rootPostOfficeName: 'Bưu cục Đống Đa',
    goodsValue: 8000000,
    createdAt: '2026-06-21T11:30:00Z',
  },
  {
    id: 3,
    compensationCode: 'BT-000003',
    minutesCode: 'BB-000003',
    itemCode: 'ITEM-000003',
    itemType: 'Thời trang',
    status: 3,
    caseType: 'Giao trễ hại hàng',
    violatingPostOfficeSummary: 'Bưu cục Cầu Giấy - 100%',
    createdPostOfficeCode: 'BC_CG',
    createdPostOfficeName: 'Bưu cục Cầu Giấy',
    rootPostOfficeCode: 'BC_CG',
    rootPostOfficeName: 'Bưu cục Cầu Giấy',
    goodsValue: 450000,
    createdAt: '2026-06-22T09:15:00Z',
  },
];

class CompensationService {
  async getPaymentList(params: CompensationMoneyFilterParams): Promise<CompensationMoneyResponse> {
    const page = params.page ?? 1;
    const size = params.size ?? 10;
    
    const pageData = mockCompensationCases.map((item) => ({
      id: item.id,
      compensationCode: item.compensationCode,
      minutesCode: item.minutesCode,
      itemCode: item.itemCode,
      itemType: item.itemType,
      status: item.status,
      caseType: item.caseType,
      customerName: 'Nguyễn Văn A',
      beneficiaryName: 'Nguyễn Văn A',
      bankName: 'Vietcombank',
      bankAccountNo: '001100223344',
      createdAt: item.createdAt,
      paymentStatus: item.status === 3 ? 'SUCCESS' : item.status === 2 ? 'FAILED' : 'PROCESSING',
      rootPostOfficeCode: item.rootPostOfficeCode,
      rootPostOfficeName: item.rootPostOfficeName,
      attachedFiles: [],
    }));

    return {
      success: true,
      data: {
        pagination: {
          limit: size,
          totalElements: pageData.length,
          totalPages: Math.ceil(pageData.length / size),
          currentPage: page,
        },
        page_data: pageData.slice((page - 1) * size, page * size),
      },
    };
  }

  async uploadSignedFiles(files: File[]): Promise<SignedFile[]> {
    return files.map((file) => ({
      fileName: file.name,
      url: `https://fake-s3-storage.example.com/uploads/${Date.now()}_${file.name}`,
      fileType: file.type,
    }));
  }

  async confirmPaymentSuccess(data: ConfirmPaymentSuccessData): Promise<{ success: boolean }> {
    const caseId = data.compensationCaseId;
    mockCompensationCases = mockCompensationCases.map((c) =>
      c.id === caseId ? { ...c, status: 3 } : c
    );
    return { success: true };
  }

  async confirmPaymentFailed(data: ConfirmPaymentFailedData): Promise<{ success: boolean }> {
    const caseId = data.compensationCaseId;
    mockCompensationCases = mockCompensationCases.map((c) =>
      c.id === caseId ? { ...c, status: 2 } : c
    );
    return { success: true };
  }

  async getCompensationReport(params: CompensationReportFilterParams): Promise<CompensationReportResponse> {
    const page = params.page ?? 1;
    const size = params.size ?? 10;
    const reportItems = [
      {
        region: 'Miền Bắc',
        branchId: 'BR001',
        branchName: 'Chi nhánh Hà Nội',
        completing: 5,
        paymentDone: 10,
        paymentProcessing: 2,
        postOfficeId: 'PO001',
        postOfficeName: 'Bưu cục Đống Đa',
        postOfficeCode: 'BC_DD',
      },
      {
        region: 'Miền Bắc',
        branchId: 'BR001',
        branchName: 'Chi nhánh Hà Nội',
        completing: 2,
        paymentDone: 8,
        paymentProcessing: 1,
        postOfficeId: 'PO002',
        postOfficeName: 'Bưu cục Cầu Giấy',
        postOfficeCode: 'BC_CG',
      },
      {
        region: 'Miền Nam',
        branchId: 'BR002',
        branchName: 'Chi nhánh Hồ Chí Minh',
        completing: 4,
        paymentDone: 15,
        paymentProcessing: 3,
        postOfficeId: 'PO003',
        postOfficeName: 'Bưu cục Quận 1',
        postOfficeCode: 'BC_Q1',
      },
    ];

    return {
      success: true,
      data: {
        pagination: {
          limit: size,
          totalElements: reportItems.length,
          totalPages: Math.ceil(reportItems.length / size),
          currentPage: page,
        },
        page_data: reportItems.slice((page - 1) * size, page * size),
      },
    };
  }

  async getExampleFile(): Promise<Blob> {
    return new Blob(['fake template file content'], { type: 'application/vnd.ms-excel' });
  }

  async listCompensationCases(data: CompensationListQueryParams): Promise<CompensationListResponse> {
    const page = data.page ?? 1;
    const size = data.size ?? 10;

    return {
      success: true,
      data: {
        pagination: {
          limit: size,
          totalElements: mockCompensationCases.length,
          totalPages: Math.ceil(mockCompensationCases.length / size),
          currentPage: page,
        },
        page_data: mockCompensationCases.slice((page - 1) * size, page * size),
      },
    };
  }

  async getDetailCompensation(id: number): Promise<CompensationDetailResponse> {
    const found = mockCompensationCases.find((c) => c.id === id) || mockCompensationCases[0];

    const detailData = {
      id: found.id,
      compensationCode: found.compensationCode,
      minutesId: 100 + found.id,
      minutesCode: found.minutesCode,
      minutesContent: 'Biên bản ghi nhận sự việc hư hỏng hàng hóa trong quá trình vận chuyển.',
      minutesFiles: [],
      violatingPostOfficeSummary: found.violatingPostOfficeSummary,
      violatingPersonSummary: 'Nguyễn Văn B (NV001) - 100%',
      mistakeId: 10,
      mistakeCode: 'LOI_BE_VO',
      mistakeDescription: 'Làm móp méo, bể vỡ hộp đựng hàng',
      minutesItemId: 200 + found.id,
      itemType: found.itemType,
      itemCode: found.itemCode,
      caseType: found.caseType,
      status: found.status,
      createdPostOfficeId: 'PO001',
      createdPostOfficeCode: found.createdPostOfficeCode,
      createdPostOfficeName: found.createdPostOfficeName,
      rootPostOfficeId: 'PO001',
      rootPostOfficeCode: found.rootPostOfficeCode,
      rootPostOfficeName: found.rootPostOfficeName,
      goodsValue: found.goodsValue,
      invoiceValue: found.goodsValue,
      codAmount: 0,
      serviceName: 'Chuyển phát nhanh',
      vasName: ['Bảo hiểm hàng hóa'],
      goodsContent: 'Mô tả hàng hóa chi tiết',
      customerCode: 9999,
      customerName: 'Nguyễn Văn A',
      customerIdentityNo: '0123456789',
      customerPhone: '0987654321',
      customerEmail: 'customer@example.com',
      customerAddress: '123 Đường Láng, Đống Đa, Hà Nội',
      bankName: 'Vietcombank',
      bankCode: 'VCB',
      bankAccountNo: '001100223344',
      beneficiaryName: 'Nguyễn Văn A',
      paymentFailedReason: '',
      debitAccountNo: '110022334455',
      documentFiles: [],
      bcgCompensationAmount: found.goodsValue * 0.8,
      bcgCompensationContent: 'Đồng ý đền bù 80% giá trị hàng hóa.',
      createdAt: found.createdAt,
      violatingPostOffices: [
        {
          id: 1,
          compensationCaseId: found.id,
          postOfficeId: 'PO001',
          postOfficeCode: found.rootPostOfficeCode || 'BC_DD',
          postOfficeName: found.rootPostOfficeName || 'Bưu cục Đống Đa',
          compensationRatio: 100,
          compensationAmount: found.goodsValue * 0.8,
          createdAt: found.createdAt,
        },
      ],
      actionHistories: [
        {
          id: 1,
          compensationCaseId: found.id,
          actionType: 'CREATE',
          caseType: found.caseType,
          actorId: 1,
          actorCode: 'NV001',
          actorName: 'Người tạo biên bản',
          actorPostOfficeId: 'PO001',
          actorPostOfficeCode: found.rootPostOfficeCode || 'BC_DD',
          actorPostOfficeName: found.rootPostOfficeName || 'Bưu cục Đống Đa',
          content: 'Khởi tạo bồi thường từ biên bản lỗi.',
          files: [],
          createdAt: found.createdAt,
        },
      ],
    };

    return {
      success: true,
      data: detailData,
    };
  }

  async completeCompensation(id: number, data: CompleteCompensationDataRequest): Promise<{ success: boolean }> {
    mockCompensationCases = mockCompensationCases.map((c) =>
      c.id === id ? { ...c, status: 2, goodsValue: data.goodsValue ?? c.goodsValue } : c
    );
    return { success: true };
  }

  async getBankList(): Promise<BankOption[]> {
    return [
      { value: 'VCB', label: 'Vietcombank' },
      { value: 'TCB', label: 'Techcombank' },
      { value: 'BIDV', label: 'BIDV' },
      { value: 'MB', label: 'MB Bank' },
      { value: 'ACB', label: 'ACB' },
    ];
  }

  async exportExelCompensationList(_data: CompensationListQueryParams): Promise<Blob> {
    return new Blob(['fake excel data list'], { type: 'application/vnd.ms-excel' });
  }

  async getCompensationReportExcel(_params: CompensationReportFilterParams): Promise<Blob> {
    return new Blob(['fake report excel data'], { type: 'application/vnd.ms-excel' });
  }

  async getCompensationReportExcelDetail(_params: CompensationReportFilterParams): Promise<Blob> {
    return new Blob(['fake report detail excel data'], { type: 'application/vnd.ms-excel' });
  }
}

export const compensationService = new CompensationService();
