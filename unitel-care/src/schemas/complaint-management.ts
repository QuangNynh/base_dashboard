import { z } from 'zod';

export const ComplaintFilterSchema = (
  t: (key: string, options?: Record<string, unknown>) => string
) =>
  z.object({
    keyword: z.string(),
    complaintType: z.string(),
    status: z.string(),
    creationTime: z.object({
      from: z.string(),
      to: z.string(),
    }),
    branchId: z.string(),
    postOfficeId: z.string(),
    receiptChannel: z.string(),
    complaintCategoryId: z.string(),
    priority: z.array(z.string()),
    deadlineStatus: z.string(),
    completionDate: z.object({
      from: z.string(),
      to: z.string(),
    }),
    complaintCount: z.string().refine((val) => !isNaN(Number(val)), {
      message: t('validation.number'),
    }),
  });
export type ComplaintFilterDataSchema = z.infer<ReturnType<typeof ComplaintFilterSchema>>;

export const ComplaintRateReportFilterSchema = z.object({
  creationTime: z.object({ from: z.string(), to: z.string() }),
  branchIds: z.string(),
  postOfficeIds: z.string(),
  complaintCount: z.string(),
  priority: z.array(z.string()),
  deadlineStatus: z.string(),
});

export type ComplaintRateReportFilterData = z.infer<typeof ComplaintRateReportFilterSchema>;

export const AddressComponentSchema = z.object({
  id: z.string().optional(),
  code: z.string().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  level: z.number().optional(),
});

// 👉 Address
export const AddressSchema = z.object({
  formattedAddress: z.string(),
  components: z.array(AddressComponentSchema),
});
export const fileUploadSchema = z.union([
  z.instanceof(File),
  z.object({
    fileName: z.string(),
    url: z.string(),
    fileType: z.string(),
  }),
]);

export const createComplaintSchema = (
  t: (key: string, options?: Record<string, unknown>) => string
) =>
  z.object({
    // General info
    orderCode: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .max(50, t('validation.maxLength', { max: 50 }))
      .regex(/^[A-Za-z0-9_]+$/, t('validation.noSpecialChar')),

    receiptChannel: z.string().min(1, t('validation.required')),
    requestPhoneNumber: z.string().optional(), // TODO: MTM-10173
    contactName: z.string().optional(),
    customerProvinceName: z.string().optional(),
    customerDistrictName: z.string().optional(),
    // email: z.string().email().optional().or(z.literal('')),
    contactPhoneNumber: z.string().optional(), // TODO: MTM-10173
    priority: z.string().min(1, t('validation.required')),
    errorDescription: z
      .string()
      .max(255, t('validation.maxLength', { max: 255 }))
      .optional(),
    complaintCategoryId: z.string().min(1, t('validation.required')),
    deadline: z.string().optional(),
    tgttEvaluation: z
      .string()
      .max(255, t('validation.maxLength', { max: 255 }))
      .optional(),

    address: AddressSchema.optional(),
    // Content
    content: z
      .string()
      .min(1, t('validation.required'))
      .max(1000, t('validation.maxLength', { max: 1000 })),

    // 👉 Bưu cục gốc
    originPostcode: z.string(),
    originPostId: z.string(),
    originPostOfficeName: z.string(),
    originBranchCode: z.string(),
    originBranchId: z.string(),
    originBranchName: z.string(),

    // 👉 Bưu cục phát
    deliveryPostcode: z.string(),
    deliveryPostId: z.string(),
    deliveryPostOfficeName: z.string(),
    deliveryBranchCode: z.string(),
    deliveryBranchId: z.string(),
    deliveryBranchName: z.string(),

    // 👉 Bưu cục hiện tại
    currentPostcode: z.string(),
    currentPostId: z.string(),
    currentPostOfficeName: z.string(),
    currentBranchCode: z.string(),
    currentBranchId: z.string(),
    currentBranchName: z.string(),

    processingPostcode: z.string().optional(),
    processingPostName: z.string().optional(),
    processingPostId: z.string().min(1, t('validation.required')),
    processingPostOffice: z.string().optional(),
    processingBranchCode: z.string().optional(),
    processingBranchName: z.string().min(1, t('validation.required')),
    files: z.array(fileUploadSchema).optional(),
    contactType: z.string().optional(),
    contactId: z.number().optional(),
  });

export const getDefaultValues = (contactType: 'SENDER' | 'RECEIVER') => ({
  contactType,
  contactId: undefined,

  // General info
  orderCode: '',
  receiptChannel: '',
  requestPhoneNumber: '',
  contactName: '',
  customerProvinceName: '',
  customerDistrictName: '',
  email: '',

  // Contact info
  contactPhoneNumber: '',
  priority: '',
  errorDescription: '',
  complaintCategoryId: '',
  deadline: '',
  tgttEvaluation: '',

  // Address
  address: {
    formattedAddress: '',
    components: [],
  },

  // Content
  content: '',

  // 👉 Bưu cục gốc
  originPostcode: '',
  originPostId: '',
  originPostOfficeName: '',
  originBranchCode: '',
  originBranchId: '',
  originBranchName: '',

  // 👉 Bưu cục phát
  deliveryPostcode: '',
  deliveryPostId: '',
  deliveryPostOfficeName: '',
  deliveryBranchCode: '',
  deliveryBranchId: '',
  deliveryBranchName: '',

  // 👉 Bưu cục hiện tại
  currentPostcode: '',
  currentPostId: '',
  currentPostOfficeName: '',
  currentBranchCode: '',
  currentBranchId: '',
  currentBranchName: '',

  // 👉 Bưu cục xử lý
  processingPostcode: '',
  processingPostName: '',
  processingPostId: '',
  processingBranchCode: '',
  processingBranchName: '',
  processingPostOffice: 'test',

  // 👉 File
  files: [],
});

export type CreateComplaintData = z.infer<ReturnType<typeof createComplaintSchema>>;

export const editComplaintSchema = (
  t: (key: string, options?: Record<string, unknown>) => string
) =>
  z.object({
    // General info
    contactType: z.string().optional(),
    orderCode: z.string().trim().min(1, t('validation.required')), // readonly trên UI, vẫn required
    receiptChannel: z.string().min(1, t('validation.required')),
    complaintCategoryId: z.string().min(1, t('validation.required')),
    priority: z.string().min(1, t('validation.required')),
    deadline: z.string().optional(),
    errorDescription: z
      .string()
      .max(255, t('validation.maxLength', { max: 255 }))
      .optional(),
    content: z
      .string()
      .min(1, t('validation.required'))
      .max(1000, t('validation.maxLength', { max: 1000 })),

    // Address (display only, pre-filled từ API)
    address: AddressSchema.optional(),
    customerProvinceName: z.string().optional(),
    customerDistrictName: z.string().optional(),

    // Contact info
    requestPhoneNumber: z.string().optional(), // TODO: MTM-10173
    contactPhoneNumber: z.string().optional(), // TODO: MTM-10173
    contactName: z.string().optional(),
    tgttEvaluation: z
      .string()
      .max(255, t('validation.maxLength', { max: 255 }))
      .optional(),

    // Bưu cục
    originPostOfficeName: z.string().optional(),
    deliveryPostOfficeName: z.string().optional(),
    processingPostcode: z.string().optional(),
    processingPostId: z.string().min(1, t('validation.required')),
    processingPersonalProcess: z.string().optional(),
    processingBranchName: z.string().optional(),

    // Branch names (display only)
    originBranchName: z.string().optional(),
    deliveryBranchName: z.string().optional(),

    // Files
    files: z.array(fileUploadSchema).optional(),
  });

export type EditComplaintData = z.infer<ReturnType<typeof editComplaintSchema>>;

export const getEditDefaultValues = (contactType: 'SENDER' | 'RECEIVER'): EditComplaintData => ({
  contactType,
  orderCode: '',
  receiptChannel: '',
  complaintCategoryId: '',
  priority: '',
  deadline: '',
  errorDescription: '',
  content: '',
  address: undefined,
  customerProvinceName: '',
  customerDistrictName: '',
  requestPhoneNumber: '',
  contactPhoneNumber: '',
  contactName: '',
  tgttEvaluation: '',
  originPostOfficeName: '',
  deliveryPostOfficeName: '',
  processingPostcode: '',
  processingPersonalProcess: '',
  processingBranchName: '',
  originBranchName: '',
  processingPostId: '',
  deliveryBranchName: '',
  files: [],
});

export const buildSchema = (
  t: (key: string, options?: Record<string, unknown>) => string,
  isAssigned = false
) =>
  z.object({
    internalNote: isAssigned
      ? z
          .string()
          .max(255, t('validation.maxLength', { max: 255 }))
          .optional()
      : z
          .string()
          .min(10, t('validation.minLength', { min: 10 }))
          .max(255, t('validation.maxLength', { max: 255 })),
    complaintCategoryId: z.string().min(1, t('validation.required')),
    processingPostId: z.string().optional(),
    handlerId: z.string().optional(),
  });

export type PostOfficeHandingAwaitForm = z.infer<ReturnType<typeof buildSchema>>;

export const getPostOfficeHandingAwaitValues = () => ({
  internalNote: '',
  complaintCategoryId: '',
  processingPostId: '',
  handlerId: '',
});

export const buildUpdateSchema = (
  t: (key: string, options?: Record<string, unknown>) => string,
  maxHoursMap: Record<string, number> = {}
) =>
  z
    .object({
      internalNote: z
        .string()
        .min(10, t('validation.minLength', { min: 10 }))
        .max(255, t('validation.maxLength', { max: 255 })),
      complaintCategoryId: z.string().optional(),
      processingPostId: z.string().optional(),
      handlerId: z.string().optional(),
      responseToCustomer: z
        .string()
        .refine((val) => !val || val.length >= 10, t('validation.minLength', { min: 10 }))
        .max(255, t('validation.maxLength', { max: 255 }))
        .optional(),
      faultUnitId: z.string().optional(),
      faultIndividualId: z.string().optional(),
      errorCauseId: z.string().optional(),
      extensionReasonId: z.string().optional(),
      extensionHours: z
        .string()
        .optional()
        .refine((val) => !val || (Number(val) > 0 && val.length <= 4), {
          message: t('validation.extensionHoursInvalid'),
        }),
      files: z.array(fileUploadSchema).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.extensionHours && !data.extensionReasonId) {
        ctx.addIssue({
          code: 'custom',
          path: ['extensionReasonId'],
          message: t('validation.required'),
        });
      }

      if (data.extensionHours && data.extensionReasonId) {
        const maxHours = maxHoursMap[data.extensionReasonId];
        if (maxHours !== undefined && Number(data.extensionHours) > maxHours) {
          ctx.addIssue({
            code: 'custom',
            path: ['extensionHours'],
            message: t('validation.extensionHoursExceedMax', { max: maxHours }),
          });
        }
      }
    });

// Schema riêng cho nút "Đã xử lý" — bắt buộc 4 trường
export const buildProcessSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z.object({
    internalNote: z
      .string()
      .min(10, t('validation.minLength', { min: 10 }))
      .max(255, t('validation.maxLength', { max: 255 })),
    complaintCategoryId: z.string().optional(),
    processingPostId: z.string().optional(),
    handlerId: z.string().optional(),
    responseToCustomer: z
      .string()
      .min(1, t('validation.required'))
      .min(10, t('validation.minLength', { min: 10 }))
      .max(255, t('validation.maxLength', { max: 255 })),
    faultUnitId: z.string().min(1, t('validation.required')),
    faultIndividualId: z.string().min(1, t('validation.required')),
    errorCauseId: z.string().min(1, t('validation.required')),
    files: z.array(fileUploadSchema).optional(),
  });

export type PostOfficeHandingForm = z.infer<ReturnType<typeof buildUpdateSchema>>;

export const buildSchemaTTVHEvaluate = (t: (key: string) => string) =>
  z.object({
    processingQuality: z.string().min(1, t('TTVHEvaluate.processingQualityRequired')),
    categoryEvaluation: z.string().min(1, t('TTVHEvaluate.complaintCategoryRequired')),
    extensionEvaluation: z.string().min(1, t('TTVHEvaluate.extensionRatingRequired')),
    receptionQuality: z.string().min(1, t('TTVHEvaluate.receptionQualityRequired')),
    slowUnitId: z.string().optional(),
  });

export type TTVHEvaluateForm = z.infer<ReturnType<typeof buildSchemaTTVHEvaluate>>;
