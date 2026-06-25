import DefaultAuthentication from '@/layout/DefaultAuthentication';
import DefaultLayout from '@/layout/DefaultLayout';
import CreateComplaintPage from '@/pages/complaint-management/complaint-create';
import ComplaintDetailPage from '@/pages/complaint-management/complaint-detail';
import EditComplaintPage from '@/pages/complaint-management/complaint-edit';
import ComplaintHandingPage from '@/pages/complaint-management/complaint-handing';
import OrderDetailPage from '@/pages/complaint-management/complaint-order_detail';
import ListComplaintManagement from '@/pages/complaint-management';
import ComplaintRateReportPage from '@/pages/complaint-rate-report';
import LoginPage from '@/pages/login';
import SettingComplaintManagement from '@/pages/setting-complaint';
import ShipmentTrackingPage from '@/pages/shipment-tracking';
import { Navigate, Outlet, type RouteObject } from 'react-router-dom';
import ProtectedRoute from './protected-route';
import { BREADCRUMBS, ROUTES } from './routes.config';
import ViolationReportConfig from '@/pages/violation-report/config';
import ViolationReportList from '@/pages/violation-report/list';
import CreateViolationReportPage from '@/pages/violation-report/create';
import ViolationReportDetail from '@/pages/violation-report/list/violation-report-detail';
import ViolationReportExplanation from '@/pages/violation-report/list/violation-report-explanation';
import ViolationReportConcludeList from '@/pages/violation-report/conclude';
import ViolationReportConcludeDetail from '../pages/violation-report/conclude/violation-report-detail';
import ViolationReportConcludeSubmit from '../pages/violation-report/conclude/violation-report-conclude';
import ViolationReportConfigErrorCodeHistory from '@/pages/violation-report/config/history';
import ViolationRateReportPage from '@/pages/violation-report/rate-report';
import ListCompensation from '@/pages/compensation/list';
import CompensationDetail from '@/pages/compensation/list/compensation-detail';
import CompleteCompensation from '@/pages/compensation/list/complete-compensation';
import CompensationMoney from '@/pages/compensation/money';
import CompensationReport from '@/pages/compensation/report';

export type AppRoute = RouteObject & {
  breadcrumb?: string[];
  children?: AppRoute[];
};

export const routers: AppRoute[] = [
  {
    element: (
      <DefaultLayout>
        <Outlet />
      </DefaultLayout>
    ),
    children: [
      {
        index: true,
        path: ROUTES.ROOT,
        element: (
          <ProtectedRoute roles={[]}>
            <ListComplaintManagement />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.ROOT],
      },
      {
        path: ROUTES.COMPLAINT_MANAGEMENT_CREATE,
        element: (
          <ProtectedRoute roles={[]}>
            <CreateComplaintPage />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPLAINT_MANAGEMENT_CREATE],
      },
      {
        path: ROUTES.COMPLAINT_MANAGEMENT_EDIT,
        element: (
          <ProtectedRoute roles={[]}>
            <EditComplaintPage />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPLAINT_MANAGEMENT_EDIT],
      },
      {
        path: ROUTES.COMPLAINT_MANAGEMENT_DETAIL,
        element: (
          <ProtectedRoute roles={[]}>
            <ComplaintDetailPage />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPLAINT_MANAGEMENT_DETAIL],
      },
      {
        path: ROUTES.COMPLAINT_MANAGEMENT_ORDER_DETAIL,
        element: (
          <ProtectedRoute roles={[]}>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPLAINT_MANAGEMENT_ORDER_DETAIL],
      },
      {
        path: ROUTES.COMPLAINT_MANAGEMENT_HANDING,
        element: (
          <ProtectedRoute roles={[]}>
            <ComplaintHandingPage />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPLAINT_MANAGEMENT_HANDING],
      },
      {
        path: ROUTES.COMPLAINT_MANAGEMENT_SETTING,
        element: (
          <ProtectedRoute roles={[]}>
            <SettingComplaintManagement />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPLAINT_MANAGEMENT_SETTING],
      },
      {
        path: ROUTES.COMPLAINT_RATE_REPORT,
        element: (
          <ProtectedRoute roles={[]}>
            <ComplaintRateReportPage />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPLAINT_RATE_REPORT],
      },
      {
        path: ROUTES.SHIPMENT_TRACKING,
        element: (
          <ProtectedRoute roles={[]}>
            <ShipmentTrackingPage />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.SHIPMENT_TRACKING],
      },
      {
        path: ROUTES.VIOLATION_REPORT_CONFIG,
        element: (
          <ProtectedRoute roles={[]}>
            <ViolationReportConfig />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.VIOLATION_REPORT_CONFIG],
      },
      {
        path: ROUTES.VIOLATION_REPORT_CONFIG_HISTORY,
        element: (
          <ProtectedRoute roles={[]}>
            <ViolationReportConfigErrorCodeHistory />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.VIOLATION_REPORT_CONFIG_HISTORY],
      },
      {
        path: ROUTES.VIOLATION_REPORT_LIST,
        element: (
          <ProtectedRoute roles={[]}>
            <ViolationReportList />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.VIOLATION_REPORT_LIST],
      },
      {
        path: ROUTES.VIOLATION_REPORT_CREATE,
        element: (
          <ProtectedRoute roles={[]}>
            <CreateViolationReportPage />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.VIOLATION_REPORT_CREATE],
      },
      {
        path: ROUTES.VIOLATION_REPORT_DETAIL,
        element: (
          <ProtectedRoute roles={[]}>
            <ViolationReportDetail />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.VIOLATION_REPORT_DETAIL],
      },
      {
        path: ROUTES.VIOLATION_REPORT_EXPLAIN,
        element: (
          <ProtectedRoute roles={[]}>
            <ViolationReportExplanation />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.VIOLATION_REPORT_EXPLAIN],
      },
      {
        path: ROUTES.VIOLATION_REPORT_CONCLUDE,
        element: (
          <ProtectedRoute roles={[]}>
            <ViolationReportConcludeList />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.VIOLATION_REPORT_CONCLUDE],
      },
      {
        path: ROUTES.VIOLATION_REPORT_CONCLUDE_DETAIL,
        element: (
          <ProtectedRoute roles={[]}>
            <ViolationReportConcludeDetail />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.VIOLATION_REPORT_CONCLUDE_DETAIL],
      },
      {
        path: ROUTES.VIOLATION_REPORT_CONCLUDE_DETAIL_CONCLUDE,
        element: (
          <ProtectedRoute roles={[]}>
            <ViolationReportConcludeSubmit />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.VIOLATION_REPORT_CONCLUDE_DETAIL_CONCLUDE],
      },
      {
        path: ROUTES.VIOLATION_REPORT_RATE_REPORT,
        element: (
          <ProtectedRoute roles={[]}>
            <ViolationRateReportPage />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.VIOLATION_REPORT_RATE_REPORT],
      },
      {
        path: ROUTES.COMPENSATION_LIST,
        element: (
          <ProtectedRoute roles={[]}>
            <ListCompensation />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPENSATION_LIST],
      },
      {
        path: ROUTES.COMPENSATION_DETAIL,
        element: (
          <ProtectedRoute roles={[]}>
            <CompensationDetail />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPENSATION_DETAIL],
      },
      {
        path: ROUTES.COMPENSATION_COMPLETE,
        element: (
          <ProtectedRoute roles={[]}>
            <CompleteCompensation />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPENSATION_COMPLETE],
      },
      {
        path: ROUTES.COMPENSATION_MONEY,
        element: (
          <ProtectedRoute roles={[]}>
            <CompensationMoney />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPENSATION_MONEY],
      },
      {
        path: ROUTES.COMPENSATION_REPORT,
        element: (
          <ProtectedRoute roles={[]}>
            <CompensationReport />
          </ProtectedRoute>
        ),
        breadcrumb: BREADCRUMBS[ROUTES.COMPENSATION_REPORT],
      },
    ],
  },
  {
    element: (
      <DefaultAuthentication>
        <Outlet />
      </DefaultAuthentication>
    ),

    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to={ROUTES.ROOT} />,
  },
];
