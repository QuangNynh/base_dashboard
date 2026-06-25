// Route paths constants
export const ROUTES = {
  // Auth
  LOGIN: '/login',

  // Shipment Tracking
  SHIPMENT_TRACKING: '/shipment-tracking',

  //Complaint Management
  COMPLAINT_MANAGEMENT: '/complaint-management',
  COMPLAINT_MANAGEMENT_LIST: '/complaint-management/list',
  COMPLAINT_MANAGEMENT_CREATE: '/complaint-management/list/create',
  COMPLAINT_MANAGEMENT_DETAIL: '/complaint-management/list/:id',
  COMPLAINT_MANAGEMENT_HANDING: '/complaint-management/list/:id/handing',
  COMPLAINT_MANAGEMENT_SETTING: '/complaint-management/setting',
  COMPLAINT_MANAGEMENT_EDIT: '/complaint-management/list/:id/edit',
  COMPLAINT_MANAGEMENT_ORDER_DETAIL: '/complaint-management/list/order/:id',
  COMPLAINT_RATE_REPORT: '/complaint-management/complaint-rate-report',

  // Violation Report
  VIOLATION_REPORT_CONFIG: '/violation-report/config',
  VIOLATION_REPORT_CONFIG_HISTORY: '/violation-report/config/:id/history',
  VIOLATION_REPORT_LIST: '/violation-report/list',
  VIOLATION_REPORT_CREATE: '/violation-report/create',
  VIOLATION_REPORT_DETAIL: '/violation-report/list/:id',
  VIOLATION_REPORT_EXPLAIN: '/violation-report/list/:id/explain',
  VIOLATION_REPORT_CONCLUDE: '/violation-report/conclude',
  VIOLATION_REPORT_CONCLUDE_DETAIL: '/violation-report/conclude/:id/detail',
  VIOLATION_REPORT_CONCLUDE_DETAIL_CONCLUDE: '/violation-report/conclude/:id/conclude',
  VIOLATION_REPORT_RATE_REPORT: '/violation-report/rate-report',

  // Compensation
  COMPENSATION_LIST: '/compensation/list',
  COMPENSATION_DETAIL: '/compensation/list/:id/detail',
  COMPENSATION_COMPLETE: '/compensation/list/:id/completeCompensation',
  COMPENSATION_MONEY: '/compensation/money',
  COMPENSATION_REPORT: '/compensation/report',

  // Fallback
  ROOT: '/complaint-management/list',
} as const;

// Breadcrumb configuration
export const BREADCRUMBS: Record<string, string[]> = {
  [ROUTES.SHIPMENT_TRACKING]: ['shipmentTracking'],
  [ROUTES.ROOT]: ['complaintManagement', 'listComplaint'],
  [ROUTES.COMPLAINT_MANAGEMENT_CREATE]: ['complaintManagement', 'listComplaint', 'createComplaint'],
  [ROUTES.COMPLAINT_MANAGEMENT_SETTING]: ['complaintManagement', 'settingComplaint'],
  [ROUTES.COMPLAINT_MANAGEMENT_DETAIL]: ['complaintManagement', 'listComplaint', 'detailComplaint'],
  [ROUTES.COMPLAINT_MANAGEMENT_HANDING]: [
    'complaintManagement',
    'listComplaint',
    'complaintHanding',
  ],
  [ROUTES.COMPLAINT_MANAGEMENT_EDIT]: ['complaintManagement', 'listComplaint', 'editComplaint'],
  [ROUTES.COMPLAINT_MANAGEMENT_ORDER_DETAIL]: [
    'complaintManagement',
    'listComplaint',
    'complaintHanding',
    'orderDetail',
  ],
  [ROUTES.COMPLAINT_RATE_REPORT]: ['complaintManagement', 'complaintRateReport'],
  [ROUTES.VIOLATION_REPORT_CONFIG]: ['violationReport', 'violationReportConfig'],
  [ROUTES.VIOLATION_REPORT_CONFIG_HISTORY]: [
    'violationReport',
    'violationReportConfig',
    'violationReportConfigErrorCode',
    'violationReportConfigHistory',
  ],
  [ROUTES.VIOLATION_REPORT_LIST]: ['violationReport', 'violationReportList'],
  [ROUTES.VIOLATION_REPORT_CREATE]: ['violationReport', 'violationReportCreate'],
  [ROUTES.VIOLATION_REPORT_DETAIL]: ['violationReport', 'violationReportList', 'detail'],
  [ROUTES.VIOLATION_REPORT_EXPLAIN]: ['violationReport', 'violationReportList', 'explain'],
  [ROUTES.VIOLATION_REPORT_CONCLUDE]: ['violationReport', 'violationReportConclude'],
  [ROUTES.VIOLATION_REPORT_CONCLUDE_DETAIL]: [
    'violationReport',
    'violationReportConclude',
    'detail',
  ],
  [ROUTES.VIOLATION_REPORT_CONCLUDE_DETAIL_CONCLUDE]: [
    'violationReport',
    'violationReportConclude',
    'concludeDetail',
  ],
  [ROUTES.VIOLATION_REPORT_RATE_REPORT]: ['violationReport', 'violationReportRateReport'],
  [ROUTES.COMPENSATION_LIST]: ['compensation', 'listCompensation'],
  [ROUTES.COMPENSATION_DETAIL]: ['compensation', 'listCompensation', 'detail'],
  [ROUTES.COMPENSATION_COMPLETE]: ['compensation', 'listCompensation', 'completeCompensation'],
  [ROUTES.COMPENSATION_MONEY]: ['compensation', 'moneyCompensation'],
  [ROUTES.COMPENSATION_REPORT]: ['compensation', 'reportCompensation'],
};
