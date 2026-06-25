// Chất lượng xử lý
export const PROCESSING_QUALITY = {
  CORRECT_BUSINESS: 'CORRECT_BUSINESS',
  CLOSED_LOOP: 'CLOSED_LOOP',
  MISSING_PROCESSING_INFO: 'MISSING_PROCESSING_INFO',
  INCOMPLETE_PROCESSING: 'INCOMPLETE_PROCESSING',
  RESPONSIBILITY_ERROR: 'RESPONSIBILITY_ERROR',
  ATTITUDE_ERROR: 'ATTITUDE_ERROR',
  BUSINESS_ERROR: 'BUSINESS_ERROR',
} as const;

export type ProcessingQualityType = (typeof PROCESSING_QUALITY)[keyof typeof PROCESSING_QUALITY];

export const PROCESSING_QUALITY_LABEL_KEY: Record<ProcessingQualityType, string> = {
  [PROCESSING_QUALITY.CORRECT_BUSINESS]: 'ttvhEvaluation.processingQuality.correctBusiness',
  [PROCESSING_QUALITY.CLOSED_LOOP]: 'ttvhEvaluation.processingQuality.closedLoop',
  [PROCESSING_QUALITY.MISSING_PROCESSING_INFO]:
    'ttvhEvaluation.processingQuality.missingProcessingInfo',
  [PROCESSING_QUALITY.INCOMPLETE_PROCESSING]:
    'ttvhEvaluation.processingQuality.incompleteProcessing',
  [PROCESSING_QUALITY.RESPONSIBILITY_ERROR]: 'ttvhEvaluation.processingQuality.responsibilityError',
  [PROCESSING_QUALITY.ATTITUDE_ERROR]: 'ttvhEvaluation.processingQuality.attitudeError',
  [PROCESSING_QUALITY.BUSINESS_ERROR]: 'ttvhEvaluation.processingQuality.businessError',
};

// Đánh giá danh mục
export const CATEGORY_EVALUATION = {
  CORRECT: 'CORRECT',
  INCORRECT: 'INCORRECT',
} as const;

export type CategoryEvaluationType = (typeof CATEGORY_EVALUATION)[keyof typeof CATEGORY_EVALUATION];

export const CATEGORY_EVALUATION_LABEL_KEY: Record<CategoryEvaluationType, string> = {
  [CATEGORY_EVALUATION.CORRECT]: 'ttvhEvaluation.categoryEvaluation.correct',
  [CATEGORY_EVALUATION.INCORRECT]: 'ttvhEvaluation.categoryEvaluation.incorrect',
};

// Đánh giá gia hạn
export const EXTENSION_EVALUATION = {
  FAKE_EXTENSION: 'FAKE_EXTENSION',
  WRONG_EXTENSION_REASON: 'WRONG_EXTENSION_REASON',
  CORRECT_EXTENSION_REASON_SELECTED: 'CORRECT_EXTENSION_REASON_SELECTED',
  CORRECT_EXTENSION_REASON: 'CORRECT_EXTENSION_REASON',
} as const;

export type ExtensionEvaluationType =
  (typeof EXTENSION_EVALUATION)[keyof typeof EXTENSION_EVALUATION];

export const EXTENSION_EVALUATION_LABEL_KEY: Record<ExtensionEvaluationType, string> = {
  [EXTENSION_EVALUATION.FAKE_EXTENSION]: 'ttvhEvaluation.extensionEvaluation.fakeExtension',
  [EXTENSION_EVALUATION.WRONG_EXTENSION_REASON]:
    'ttvhEvaluation.extensionEvaluation.wrongExtensionReason',
  [EXTENSION_EVALUATION.CORRECT_EXTENSION_REASON_SELECTED]:
    'ttvhEvaluation.extensionEvaluation.correctExtensionReasonSelected',
  [EXTENSION_EVALUATION.CORRECT_EXTENSION_REASON]:
    'ttvhEvaluation.extensionEvaluation.correctExtensionReason',
};

// Chất lượng tiếp nhận
export const RECEPTION_QUALITY = {
  CORRECT_BUSINESS: 'CORRECT_BUSINESS',
  MISSING_CONTENT: 'MISSING_CONTENT',
  WRONG_ORDER_CODE: 'WRONG_ORDER_CODE',
  WRONG_HANDLING_UNIT: 'WRONG_HANDLING_UNIT',
  WRONG_COMPLAINT_TYPE: 'WRONG_COMPLAINT_TYPE',
  WRONG_BUSINESS: 'WRONG_BUSINESS',
  WRONG_OPERATING_REGULATION: 'WRONG_OPERATING_REGULATION',
} as const;

export type ReceptionQualityType = (typeof RECEPTION_QUALITY)[keyof typeof RECEPTION_QUALITY];

export const RECEPTION_QUALITY_LABEL_KEY: Record<ReceptionQualityType, string> = {
  [RECEPTION_QUALITY.CORRECT_BUSINESS]: 'ttvhEvaluation.receptionQuality.correctBusiness',
  [RECEPTION_QUALITY.MISSING_CONTENT]: 'ttvhEvaluation.receptionQuality.missingContent',
  [RECEPTION_QUALITY.WRONG_ORDER_CODE]: 'ttvhEvaluation.receptionQuality.wrongOrderCode',
  [RECEPTION_QUALITY.WRONG_HANDLING_UNIT]: 'ttvhEvaluation.receptionQuality.wrongHandlingUnit',
  [RECEPTION_QUALITY.WRONG_COMPLAINT_TYPE]: 'ttvhEvaluation.receptionQuality.wrongComplaintType',
  [RECEPTION_QUALITY.WRONG_BUSINESS]: 'ttvhEvaluation.receptionQuality.wrongBusiness',
  [RECEPTION_QUALITY.WRONG_OPERATING_REGULATION]:
    'ttvhEvaluation.receptionQuality.wrongOperatingRegulation',
};
