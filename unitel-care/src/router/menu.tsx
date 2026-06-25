import LocationIcon from '@/assets/icons/IconLocation';
import { ClipboardList } from 'lucide-react';
import type React from 'react';
import { ROUTES } from './routes.config';
import InvoiceIcon from '@/assets/icons/InvoiceIcon';

export interface MenuItem {
  name: string;
  url?: string;
  icon?: React.ElementType;
  permissions?: string[];
  items?: MenuItem[];
}

export const menu: MenuItem[] = [
  {
    name: 'common.shipmentTracking',
    icon: LocationIcon,
    permissions: [],
    url: ROUTES.SHIPMENT_TRACKING,
  },
  {
    name: 'common.complaintManagement',
    icon: ClipboardList,
    permissions: [],
    items: [
      {
        name: 'common.listComplaint',
        url: ROUTES.ROOT,
        permissions: [],
      },
      {
        name: 'common.settingComplaint',
        url: ROUTES.COMPLAINT_MANAGEMENT_SETTING,
        permissions: [],
      },
      {
        name: 'common.complaintRateReport',
        url: ROUTES.COMPLAINT_RATE_REPORT,
        permissions: [],
      },
    ],
  },
  {
    name: 'common.violationReport',
    icon: InvoiceIcon,
    permissions: [],
    items: [
      {
        name: 'common.violationReportConfig',
        url: ROUTES.VIOLATION_REPORT_CONFIG,
        permissions: [],
      },
      {
        name: 'common.violationReportList',
        url: ROUTES.VIOLATION_REPORT_LIST,
        permissions: [],
      },
      {
        name: 'common.violationReportConclude',
        url: ROUTES.VIOLATION_REPORT_CONCLUDE,
        permissions: [],
      },
      {
        name: 'common.violationReportRateReport',
        url: ROUTES.VIOLATION_REPORT_RATE_REPORT,
        permissions: [],
      },
    ],
  },
  {
    name: 'compensation.title',
    icon: InvoiceIcon,
    permissions: [],
    items: [
      {
        name: 'compensation.list',
        url: ROUTES.COMPENSATION_LIST,
        permissions: [],
      },
      {
        name: 'compensation.money',
        url: ROUTES.COMPENSATION_MONEY,
        permissions: [],
      },
      {
        name: 'common.reportCompensation',
        url: ROUTES.COMPENSATION_REPORT,
        permissions: [],
      },
    ],
  },
];

export const getMenu = (currentPermissions: string[] = []): MenuItem[] => {
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    return items
      .filter((item) => {
        if (!item.permissions || item.permissions.length === 0) {
          return true;
        }

        return item.permissions.some((permission) => currentPermissions.includes(permission));
      })
      .map((item) => {
        if (item.items && item.items.length > 0) {
          return {
            ...item,
            items: filterMenuItems(item.items),
          };
        }
        return item;
      })
      .filter((item) => {
        if (item.items) {
          return item.items.length > 0;
        }
        return true;
      });
  };

  return filterMenuItems(menu);
};
