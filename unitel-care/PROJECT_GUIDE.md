# 📘 Unitel Care — Project Guide

> **Mục đích**: File này mô tả toàn bộ kiến trúc, conventions, patterns của dự án **unitel-care** để AI (hoặc developer mới) có thể nhanh chóng hiểu và code đúng chuẩn dự án.

---

## 1. Tổng quan dự án

- **Tên dự án**: Unitel Care (react-shadcn)
- **Mô tả**: Hệ thống quản lý khiếu nại, biên bản vi phạm, bồi thường cho Viettel Post (các thị trường Lào, Campuchia, Việt Nam)
- **URL API Gateway**: `VITE_APP_GW_URL_API` (dev: `https://dev-gw.viettelpost.vn`)
- **Tenant Code**: `VITE_TENANT_CODE` (VTP_LAOS / VTP_CAM / VTP_VN)

---

## 2. Tech Stack

| Thành phần        | Công nghệ                                                      |
| ----------------- | -------------------------------------------------------------- |
| **Framework**     | React 19 + TypeScript 5.9                                      |
| **Build Tool**    | Vite 7 (`@vitejs/plugin-react-swc`)                            |
| **Styling**       | Tailwind CSS v4 (`@tailwindcss/vite`) + `tw-animate-css`       |
| **UI Components** | shadcn/ui (style: `new-york`, icon: `lucide-react`) + Radix UI |
| **State**         | Zustand 5 (global state) + React Hook Form 7 (form state)      |
| **Data Fetching** | TanStack React Query 5                                         |
| **Routing**       | React Router DOM 7 (`useRoutes`)                               |
| **HTTP Client**   | Axios (instance tại `src/config/axios.ts`)                     |
| **Validation**    | Zod 4                                                          |
| **i18n**          | i18next + react-i18next (4 ngôn ngữ: vi, en, lo, km)           |
| **Table**         | TanStack React Table 8                                         |
| **Chart**         | Recharts 2                                                     |
| **Toast**         | Sonner 2                                                       |
| **Export Excel**  | xlsx + file-saver                                              |
| **Date**          | date-fns 4                                                     |
| **Utility**       | lodash, clsx, tailwind-merge                                   |
| **Lint/Format**   | ESLint 9 + Prettier 3 + Husky + lint-staged                    |

---

## 3. Cấu trúc thư mục

```
src/
├── App.tsx                     # Root component, dùng useRoutes()
├── main.tsx                    # Entry point: BrowserRouter, QueryClient, Toaster
├── index.css                   # Tailwind CSS v4 config + CSS variables
│
├── assets/                     # Static: icons (SVG components), fonts, data.json
│   ├── icons/                  # Custom SVG icon components (VnIcon, LoIcon, KmIcon...)
│   └── fonts/
│
├── components/
│   ├── ui/                     # shadcn/ui components (button, dialog, form, table, sidebar...)
│   ├── common/                 # Reusable components (DataTable, ComboBox, DatePicker, Upload...)
│   │   └── data-table/         # DataTable + Pagination components
│   ├── layout/                 # Layout components (AppSidebar, SiteHeader, NavMain, NavUser, Breadcrumb)
│   ├── pages/                  # Page-specific components, tổ chức theo feature
│   │   ├── complaint-list/     # ComplaintTable, FilterComplaintList
│   │   ├── complaint-create/
│   │   ├── complaint-detail-handing/
│   │   ├── compensation/
│   │   ├── violation-report-config/
│   │   ├── violation-report-conclude/
│   │   └── ...
│   └── NavigationHandler.tsx   # Global navigation handler
│
├── config/
│   └── axios.ts                # Axios instance: interceptors, auto Bearer token, refresh token logic
│
├── constants/
│   ├── common.ts               # COUNTRY_CODE, TENANT_CODE
│   ├── options.ts              # Enums: COMPLAINT_TYPES, CHANNEL_TYPES, SEVERITY_TYPES, DEADLINE_STATUS...
│   ├── status.ts               # Status configs: STATUS_COMPLAINT, STATUS_VIOLATION_CODE, STATUS_COMPENSATION...
│   ├── permissions.ts          # ROLE_GROUP, ROLE_TO_GROUP, ROLE_DETAILS
│   ├── utils.ts                # FORMAT_DATE, PARCEL_TYPE, ORDER_JOURNEY_STATUS
│   ├── post-office.ts
│   └── ttvh-evaluation.ts
│
├── hooks/
│   ├── useCheckPermissions.ts  # Check user roles
│   ├── useDebounce.ts          # Debounce value
│   ├── useActiveMenu.ts        # Active menu detection
│   ├── useBreadcrumbs.ts       # Breadcrumb from route config
│   ├── useLocationChain.ts     # Province/District chain select
│   ├── useCompensationDetail.ts
│   ├── usePageLoading.ts
│   └── use-mobile.ts           # Responsive detection
│
├── i18n/
│   └── index.ts                # i18next setup (LanguageDetector, 4 ngôn ngữ)
│
├── layout/
│   ├── DefaultLayout.tsx       # Main layout: Sidebar + Header + Content + Loading
│   └── DefaultAuthentication.tsx # Auth layout: Header + Language selector + Content
│
├── lib/
│   ├── utils.tsx               # cn(), formatDateTime(), handleApiError(), cleanParams()...
│   ├── token.ts                # tokenService: get/set/clear localStorage tokens
│   ├── navigation.ts           # navigationService (imperative navigate)
│   ├── redirect.ts             # redirectWithMessage()
│   ├── checkPermissions.ts     # Permission check utility
│   ├── findMenuLink.ts
│   ├── getTimeAgo.ts
│   ├── timeFormatter.ts        # TimeFormatter class
│   └── uploadFiles.ts          # Upload helper
│
├── locales/
│   ├── vi.json                 # Tiếng Việt (fallback)
│   ├── vi-overide.json         # Override cho VN
│   ├── en.json                 # English
│   ├── lo.json                 # Lào
│   └── km.json                 # Khmer
│
├── pages/                      # Page containers (smart components)
│   ├── complaint-management/   # CRUD khiếu nại
│   │   ├── index.tsx           # List page
│   │   ├── complaint-create.tsx
│   │   ├── complaint-detail.tsx
│   │   ├── complaint-edit.tsx
│   │   ├── complaint-handing.tsx
│   │   └── complaint-order_detail.tsx
│   ├── compensation/           # Bồi thường
│   │   ├── list/
│   │   ├── money/
│   │   └── report/
│   ├── violation-report/       # Biên bản vi phạm
│   │   ├── list/
│   │   ├── create/
│   │   ├── config/
│   │   ├── conclude/
│   │   └── rate-report/
│   ├── setting-complaint/      # Cài đặt khiếu nại
│   ├── complaint-rate-report/  # Báo cáo tỷ lệ
│   ├── shipment-tracking/      # Theo dõi vận đơn
│   └── login/                  # Trang đăng nhập
│
├── router/
│   ├── index.tsx               # Route definitions (AppRoute[])
│   ├── routes.config.ts        # ROUTES constants + BREADCRUMBS mapping
│   ├── menu.tsx                # Sidebar menu config + getMenu() with permission filtering
│   └── protected-route.tsx     # ProtectedRoute: role-based access control
│
├── schemas/                    # Zod validation schemas
│   ├── complaint-management.ts # createComplaintSchema, editComplaintSchema, buildSchema...
│   ├── compensation.ts
│   ├── violation-report.ts
│   ├── settingComplaintSchema.ts
│   ├── authSchema.ts
│   ├── workDaySettingSchema.ts
│   └── workingTimeSchema.ts
│
├── services/                   # API service classes
│   ├── authService.ts          # Login, getUserInfo, getDepartmentUser, getAllRoles
│   ├── complaintService.ts     # CRUD complaint, export, tracking, categories...
│   ├── violationReport.ts      # Violation report CRUD
│   ├── compensation.ts         # Compensation CRUD
│   ├── postOfficeService.ts    # Post office data
│   ├── uploadService.ts        # File upload
│   └── workingDayService.ts    # Working day settings
│
├── store/                      # Zustand stores
│   ├── useAuthStore.ts         # currentUser, isAuthLoading, login, logout
│   └── usePageLoadingStore.ts  # isPageLoading
│
└── types/                      # TypeScript type definitions
    ├── auth.ts                 # DataLogin, LoginResponse, getUserInfoResponse...
    ├── common.ts               # PaginationSearch
    ├── complaint-management.ts # ComplaintListItem, ComplaintDetail, Pagination...
    ├── compensation.ts
    ├── violation-report.ts
    ├── violation-report-management.ts
    └── post-office.ts
```

---

## 4. Path Alias

```json
// tsconfig.app.json
"paths": { "@/*": ["./src/*"] }
```

**Import ví dụ:**

```tsx
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { complaintService } from '@/services/complaintService';
import type { ComplaintListItem } from '@/types/complaint-management';
```

---

## 5. Coding Patterns & Conventions

### 5.1 Service Pattern

Services được viết dưới dạng **class** → export singleton instance:

```tsx
// src/services/exampleService.ts
import api from '@/config/axios';
import { cleanParams } from '@/lib/utils';
import type { SomeResponse, SomeParams } from '@/types/example';

class ExampleService {
  async getList(params: SomeParams): Promise<SomeResponse> {
    const response = await api.get<SomeResponse>(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/examples`,
      { params: cleanParams(params) }
    );
    return response.data;
  }

  async create(data: FormData) {
    const response = await api.post(
      `${import.meta.env.VITE_APP_GW_URL_API}/tms-care/api/v1/examples`,
      data,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }
}

export const exampleService = new ExampleService();
```

**Lưu ý:**

- Luôn dùng `import.meta.env.VITE_APP_GW_URL_API` cho base URL
- Dùng `cleanParams()` để lọc bỏ `undefined`, `null`, `''`, `'ALL'` khỏi query params
- Response type luôn có dạng `{ success: boolean; data: T }`

### 5.2 Type Pattern

Types được định nghĩa trong `src/types/`, tách theo feature:

```tsx
// src/types/example.ts

// Response wrapper chuẩn
export interface ExampleListResponse {
  success: boolean;
  data: {
    pagination: Pagination;
    page_data: ExampleItem[];
  };
}

export interface ExampleDetailResponse {
  success: boolean;
  data: ExampleDetail;
}

// Pagination chuẩn (reuse từ complaint-management.ts)
export interface Pagination {
  limit: number;
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

// Query params
export interface ExampleQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
  status?: string;
}
```

### 5.3 Zod Schema Pattern

Schemas nhận hàm `t()` để i18n validation messages:

```tsx
// src/schemas/example.ts
import { z } from 'zod';

export const exampleSchema = (t: (key: string, options?: Record<string, unknown>) => string) =>
  z.object({
    name: z.string().min(1, t('validation.required')),
    description: z
      .string()
      .max(255, t('validation.maxLength', { max: 255 }))
      .optional(),
    status: z.string().min(1, t('validation.required')),
  });

export type ExampleFormData = z.infer<ReturnType<typeof exampleSchema>>;
```

### 5.4 Page Pattern (Smart Component)

Mỗi page nằm trong `src/pages/`, dùng React Query + useState cho pagination/filter:

```tsx
// src/pages/example/index.tsx
import { useQuery, useMutation } from '@tanstack/react-query';
import type { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ExampleListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [dataFilter, setDataFilter] = useState<FilterData>({ keyword: '' });
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['example-list', pagination.pageIndex, pagination.pageSize, dataFilter],
    queryFn: () =>
      exampleService.getList({
        page: pagination.pageIndex + 1, // API 1-indexed, table 0-indexed
        size: pagination.pageSize,
        ...dataFilter,
      }),
    staleTime: 0,
  });

  // Filter handler
  const handleSearch = (filter: FilterData) => {
    setDataFilter({ ...filter });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <>
      <FilterComponent onSubmit={handleSearch} />
      <TableComponent
        data={data?.data?.page_data || []}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading || isFetching}
        pageCount={data?.data?.pagination?.totalPages}
      />
    </>
  );
};

export default ExampleListPage;
```

**Quan trọng:**

- `queryKey` bao gồm tất cả dependencies (pagination + filter)
- Pagination: `pageIndex + 1` vì API dùng 1-indexed, TanStack Table dùng 0-indexed
- Khi filter thay đổi → reset `pageIndex` về 0

### 5.5 Table Component Pattern

Dùng `@tanstack/react-table` + custom `DataTable` component:

```tsx
// src/components/pages/example/ExampleTable.tsx
import { DataTable } from '@/components/common/data-table';
import { Card } from '@/components/ui/card';
import type { ColumnDef, PaginationState, OnChangeFn } from '@tanstack/react-table';

interface Props {
  data: ExampleItem[];
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  isLoading?: boolean;
  pageCount?: number;
}

export const ExampleTable = ({ data, pagination, setPagination, isLoading, pageCount }: Props) => {
  const { t } = useTranslation();

  const columns: ColumnDef<ExampleItem>[] = [
    {
      id: 'stt',
      header: () => <span>{t('common.stt')}</span>,
      cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize,
      size: 60,
    },
    {
      id: 'actions',
      header: t('common.actions'),
      cell: ({ row }) => (
        <ActionsList
          item={['detail', 'edit']}
          onAction={(action) => handleAction(action, row.original)}
        />
      ),
      size: 80,
    },
    // ... more columns
  ];

  return (
    <Card className='px-6'>
      <DataTable
        columns={columns}
        data={data}
        pageSizeOptions={[5, 10, 15, 20, 50, 100]}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        manualPagination={true}
        pageCount={pageCount}
      />
    </Card>
  );
};
```

### 5.6 Form Pattern (React Hook Form + Zod)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

const MyFormComponent = () => {
  const { t } = useTranslation();

  const form = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema(t)),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (data: ExampleFormData) => {
    try {
      await exampleService.create(data);
      toast.success(t('messages.createSuccess'));
    } catch (error) {
      handleApiError(error, form);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('example.name')}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
```

### 5.7 Constants / Options Pattern

```tsx
// Định nghĩa const object → type → translation key map → options array
export const EXAMPLE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type ExampleStatusType = (typeof EXAMPLE_STATUS)[keyof typeof EXAMPLE_STATUS];

export const EXAMPLE_STATUS_LABEL_KEY: Record<ExampleStatusType, string> = {
  [EXAMPLE_STATUS.ACTIVE]: 'status.active',
  [EXAMPLE_STATUS.INACTIVE]: 'status.inactive',
};

export const EXAMPLE_STATUS_OPTIONS = Object.values(EXAMPLE_STATUS).map((value) => ({
  value,
  label: EXAMPLE_STATUS_LABEL_KEY[value],
}));
```

### 5.8 Error Handling Pattern

```tsx
import { handleApiError, extractErrorMessage } from '@/lib/utils';
import { toast } from 'sonner';

// Cách 1: handleApiError — tự động toast + set form errors
try {
  await someService.create(data);
  toast.success(t('messages.success'));
} catch (error) {
  handleApiError(error, form, t('messages.fallbackError'));
}

// Cách 2: extractErrorMessage — cho trường hợp blob response
try {
  const blob = await someService.export(params);
  saveAs(blob, 'file.xlsx');
} catch (error) {
  const msg = await extractErrorMessage(error, t('common.exportError'));
  toast.error(msg);
}
```

---

## 6. Routing

### 6.1 Cấu trúc Route

Routes được khai báo trong `src/router/index.tsx` dưới dạng `RouteObject[]`, sử dụng `useRoutes()`.

**2 layout chính:**

1. `DefaultLayout` — cho trang chính (có sidebar + header)
2. `DefaultAuthentication` — cho trang login

### 6.2 Thêm Route mới

**Bước 1**: Thêm path vào `src/router/routes.config.ts`:

```tsx
export const ROUTES = {
  // ... existing routes
  NEW_FEATURE_LIST: '/new-feature/list',
  NEW_FEATURE_DETAIL: '/new-feature/list/:id',
} as const;

export const BREADCRUMBS: Record<string, string[]> = {
  // ... existing
  [ROUTES.NEW_FEATURE_LIST]: ['newFeature', 'list'],
  [ROUTES.NEW_FEATURE_DETAIL]: ['newFeature', 'list', 'detail'],
};
```

**Bước 2**: Thêm route vào `src/router/index.tsx`:

```tsx
import NewFeatureList from '@/pages/new-feature/list';

// Trong children của DefaultLayout
{
  path: ROUTES.NEW_FEATURE_LIST,
  element: (
    <ProtectedRoute roles={[ROLE_GROUP.VAN_HANH]}>
      <NewFeatureList />
    </ProtectedRoute>
  ),
  breadcrumb: BREADCRUMBS[ROUTES.NEW_FEATURE_LIST],
},
```

**Bước 3**: Thêm vào menu sidebar (`src/router/menu.tsx`):

```tsx
{
  name: 'common.newFeature',
  icon: SomeIcon,
  permissions: [ROLE_GROUP.VAN_HANH],
  items: [
    {
      name: 'common.newFeatureList',
      url: ROUTES.NEW_FEATURE_LIST,
      permissions: [ROLE_GROUP.VAN_HANH],
    },
  ],
},
```

**Bước 4**: Thêm translations vào `src/locales/*.json`.

### 6.3 Protected Route

`ProtectedRoute` kiểm tra quyền user dựa trên `ROLE_GROUP`:

- `roles={[ROLE_GROUP.CSKH, ROLE_GROUP.VAN_HANH]}` → user phải thuộc 1 trong các group
- `roles={[]}` → cho phép tất cả user đã đăng nhập

---

## 7. Authentication & Authorization

### 7.1 Token Management

Tokens lưu trong `localStorage` qua `tokenService` (`src/lib/token.ts`):

- `access_token` — JWT Bearer token
- `refresh_token` — (chưa implement refresh)
- `token_id`
- `user_info_token` — JSON string chứa `cth-username`, `cth-role-code`, `cth-tenant-code`

### 7.2 Axios Interceptors (`src/config/axios.ts`)

- **Request**: Tự động gắn `Authorization: Bearer <token>` + `Accept-Language`
- **Response 401**: Redirect về `/login` (refresh token chưa implement)

### 7.3 Role System

```
ROLE_GROUP = { VAN_HANH, CSKH, NVBC }

Role Code → Group mapping:
- ODOWTC, BOD, BODOB, DOB → VAN_HANH
- HPO, PODM → NVBC
- TVV, CS → CSKH

Đặc biệt: ODOWTC cũng là role riêng (dùng cho Violation Report)
Financial roles: HFIN, FINS, FINGEN, FINBR (dùng cho Compensation Money)
```

### 7.4 Check Permission trong Component

```tsx
import { useCheckPermissions } from '@/hooks/useCheckPermissions';
import { ROLE_GROUP } from '@/constants/permissions';

const isVanHanh = useCheckPermissions([ROLE_GROUP.VAN_HANH]);
```

---

## 8. Internationalization (i18n)

### 8.1 Setup

- **Thư viện**: i18next + react-i18next + LanguageDetector
- **Ngôn ngữ**: `vi` (fallback), `en`, `lo` (Lào), `km` (Khmer)
- **Storage key**: `lang` trong localStorage
- **Files**: `src/locales/{vi,en,lo,km}.json`

### 8.2 Sử dụng

```tsx
// Trong React component
const { t, i18n } = useTranslation();
t('complaintManagement.complaintCode');
t('validation.maxLength', { max: 255 });

// Ngoài React (service, store)
import i18n from '@/i18n';
i18n.t('messages.logoutSuccess');
```

### 8.3 Cấu trúc translation key

```json
{
  "common": { "stt": "STT", "actions": "Thao tác", ... },
  "complaintManagement": { "complaintCode": "Mã KN", ... },
  "validation": { "required": "Trường bắt buộc", ... },
  "status": { "waiting": "Chờ xử lý", ... },
  "messages": { "createSuccess": "Tạo thành công", ... },
  "options": { "all": "Tất cả", ... }
}
```

---

## 9. State Management

### 9.1 Zustand Stores

| Store                 | File                               | Mô tả                              |
| --------------------- | ---------------------------------- | ---------------------------------- |
| `useAuthStore`        | `src/store/useAuthStore.ts`        | currentUser, isAuthLoading, logout |
| `usePageLoadingStore` | `src/store/usePageLoadingStore.ts` | isPageLoading (full-page loading)  |

### 9.2 Server State

Dùng **TanStack React Query** cho tất cả API calls:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 phút
    },
  },
});
```

---

## 10. UI Component Library

### 10.1 shadcn/ui Components (`src/components/ui/`)

Đã cài đặt (style `new-york`):
`alert-dialog`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `checkbox`,
`collapsible`, `command`, `dialog`, `drawer`, `dropdown-menu`, `form`, `input`, `label`,
`popover`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `sonner`, `table`, `tabs`,
`textarea`, `toggle`, `toggle-group`, `tooltip`

**Thêm component mới**: `npx shadcn@latest add <component-name>`

### 10.2 Common Components (`src/components/common/`)

| Component             | Mô tả                                                |
| --------------------- | ---------------------------------------------------- |
| `DataTable`           | Table wrapper (TanStack) + pagination                |
| `ActionsList`         | Dropdown menu cho các action (edit, detail, process) |
| `AppButton`           | Button mở rộng với loading state                     |
| `ComboBoxCustom`      | Searchable select (single)                           |
| `ComboBoxMuilti`      | Searchable select (multiple)                         |
| `DatePicker`          | Date picker single                                   |
| `RangeDatePicker`     | Date range picker                                    |
| `DialogCustom`        | Dialog wrapper                                       |
| `EmptyData`           | Empty state placeholder                              |
| `FileDownloadLink`    | File download with presigned URL                     |
| `For`                 | List renderer helper                                 |
| `Show`                | Conditional renderer helper                          |
| `HeaderDetail`        | Page header cho detail pages                         |
| `InputSearch`         | Search input with debounce                           |
| `Loading`             | Loading overlay                                      |
| `ModalComfirmDelete`  | Delete confirmation dialog                           |
| `MultiSelectCombobox` | Multi-select combobox                                |
| `SelectMuilti`        | Multi-select dropdown                                |
| `SkeletonTable`       | Table skeleton loading                               |
| `StatusBadge`         | Status badge với color theo config                   |
| `TabListCustom`       | Custom tab list                                      |
| `TooltipCustom`       | Tooltip wrapper                                      |
| `Upload`              | File upload component                                |
| `LocationSelect/`     | Province/District cascading select                   |

---

## 11. Styling

### 11.1 Tailwind CSS v4

- Config trong `src/index.css` (dùng `@theme inline` thay vì `tailwind.config.js`)
- Plugin: `@tailwindcss/vite`
- Animation: `tw-animate-css`

### 11.2 CSS Variables

```css
:root {
  --primary: #ff5100; /* Cam chủ đạo */
  --bgContent: oklch(98% 0.018 240); /* Nền content */
  --export: #02723a; /* Nút export */
  --disable: #dce6f0; /* Disabled state */
  --table-error: #fff5f7; /* Row lỗi */
  --text-error: #ee0033; /* Text lỗi */
}
```

### 11.3 Utility Class

- `cn()` — merge classNames (clsx + tailwind-merge)
- `scrollbar-custom` — custom scrollbar
- `no-scrollbar` — ẩn scrollbar

---

## 12. Checklist khi tạo Feature mới

### ✅ Files cần tạo/sửa:

1. **Types**: `src/types/new-feature.ts` — interfaces cho request/response
2. **Service**: `src/services/newFeatureService.ts` — API calls
3. **Schema**: `src/schemas/new-feature.ts` — Zod validation (nhận `t()`)
4. **Constants**: Thêm status/options vào `src/constants/` nếu cần
5. **Page Component**: `src/pages/new-feature/index.tsx` — smart component
6. **Page Sub-components**: `src/components/pages/new-feature/` — table, filter, form...
7. **Routes**: Thêm vào `routes.config.ts` + `router/index.tsx` + `menu.tsx`
8. **Translations**: Thêm key vào cả 4 file `src/locales/{vi,en,lo,km}.json`

### ✅ Conventions bắt buộc:

- [ ] Dùng `@/` alias cho imports
- [ ] Tất cả text hiển thị phải qua `t()` (i18n)
- [ ] API URL dùng `import.meta.env.VITE_APP_GW_URL_API`
- [ ] Dùng `cleanParams()` cho query params
- [ ] Error handling dùng `handleApiError()` hoặc `extractErrorMessage()`
- [ ] Toast dùng `sonner` (`toast.success()`, `toast.error()`)
- [ ] Dùng `useQuery`/`useMutation` từ TanStack React Query
- [ ] Form dùng React Hook Form + Zod resolver
- [ ] Table dùng `DataTable` component + `manualPagination`
- [ ] Route bọc `ProtectedRoute` với roles phù hợp
- [ ] Ngày giờ dùng `formatDateTime()` + `FORMAT_DATE` constants
- [ ] Schema nhận `t()` function để i18n validation messages

---

## 13. Các lệnh thường dùng

```bash
# Dev server
yarn dev

# Build production
yarn build

# Lint
yarn eslint
yarn lint:fix

# Format
yarn format
yarn format:write

# Type check
yarn checkTs

# Thêm shadcn component
npx shadcn@latest add <component-name>
```

---

## 14. Environment Variables

```env
VITE_APP_BASE_URL_API     # Base URL API cũ
VITE_APP_GW_URL_API       # Gateway URL API (dùng chính)
VITE_APP_BASE_URL_OMS     # OMS URL
VITE_APP_BASE_URL_TMS     # TMS URL
VITE_TENANT_CODE          # VTP_LAOS | VTP_CAM | VTP_VN
```

---

## 15. Lưu ý đặc biệt

1. **Pagination**: API trả về `currentPage` bắt đầu từ 1, TanStack Table `pageIndex` từ 0 → luôn +1 khi gọi API
2. **Date format**: BE trả date dạng ISO string hoặc array `[year, month, day, hour, minute]` → dùng `formatDateTime()` để format
3. **File upload**: Dùng `FormData` + header `'Content-Type': 'multipart/form-data'`
4. **Multi-tenant**: Logic currency, weight unit, date format khác nhau theo `VITE_TENANT_CODE`
5. **StrictMode đã tắt** trong `main.tsx` (commented out)
6. **QueryClient staleTime**: 5 phút mặc định, override `staleTime: 0` cho list pages cần realtime
7. **Sidebar width**: `--sidebar-width: calc(var(--spacing) * 72)`
8. **Response format chuẩn**: `{ success: boolean, data: { pagination: Pagination, page_data: T[] } }`
