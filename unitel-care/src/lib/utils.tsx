/* eslint-disable @typescript-eslint/no-explicit-any */
import { TENANT_CODE } from '@/constants/common';
import { CENTAL, type FormatDateString } from '@/constants/utils';
import type { Address, AddressComponent } from '@/types/complaint-management';
import { clsx, type ClassValue } from 'clsx';
import { differenceInSeconds, format, isValid } from 'date-fns';
import { replace, toNumber } from 'lodash';
import { type UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5; // Maximum number of page buttons to show
  const rangeWithDots = [];

  if (totalPages <= maxVisiblePages) {
    // If total pages is 5 or less, show all pages
    for (let i = 1; i <= totalPages; i++) {
      rangeWithDots.push(i);
    }
  } else {
    // Always show first page
    rangeWithDots.push(1);

    if (currentPage <= 3) {
      // Near the beginning: [1] [2] [3] [4] ... [10]
      for (let i = 2; i <= 4; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push('...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end: [1] ... [7] [8] [9] [10]
      rangeWithDots.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        rangeWithDots.push(i);
      }
    } else {
      // In the middle: [1] ... [4] [5] [6] ... [10]
      rangeWithDots.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        rangeWithDots.push(i);
      }
      rangeWithDots.push('...', totalPages);
    }
  }

  return rangeWithDots;
}

export const formatDateTime = (
  date: string | Date | null | undefined,
  formatString: FormatDateString
): string => {
  if (!date) return '';

  const parsedDate = new Date(date);

  if (!isValid(parsedDate)) return '';

  return format(parsedDate, formatString);
};

export const truncate = (value: string, maxLength: number = 20) => {
  if (!value) return '';
  if (value.length <= maxLength) return value;

  return value.slice(0, maxLength) + '...';
};
export const getAddressByLevel = (
  address: Address | undefined,
  level: number
): AddressComponent | undefined => {
  return address?.components?.find((item) => item.level === level);
};

export const cleanParams = (params: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value !== undefined && value !== null && value !== '' && value !== 'ALL'
    )
  );
};

export const handleApiError = (
  error: unknown,
  form?: UseFormReturn<any>,
  fallbackMessage: string = 'Có lỗi xảy ra'
) => {
  const err = error as {
    message?: string;
    response?: {
      data?: {
        error_code?: string;
        message?: string;
        data?: Array<{ field: string; message: string }>;
      };
    };
  };

  const responseData = err.response?.data;

  // ✅ CASE 1: Có validation errors (data)
  if (Array.isArray(responseData?.data) && responseData.data.length > 0) {
    const messages: string[] = [];

    responseData.data.forEach((validationErr) => {
      const { field, message } = validationErr;

      // set lỗi vào form
      if (field && message && form) {
        form.setError(field, {
          type: 'server',
          message,
        });
      }

      // gom message
      if (message) {
        messages.push(field ? `${field}: ${message}` : message);
      }
    });

    // 🔥 chỉ toast 1 lần
    if (messages.length > 0) {
      toast.error(
        <div className='flex flex-col gap-1'>
          {messages.map((msg, idx) => (
            <div key={idx}>• {msg}</div>
          ))}
        </div>
      );
    }

    return;
  }

  // ✅ CASE 2: Không có data → dùng message
  const errorMessage = responseData?.message || err.message || fallbackMessage;

  toast.error(errorMessage);
};

export const extractBlobApiError = async (
  error: unknown,
  fallbackMessage: string
): Promise<string> => {
  const err = error as { response?: { data?: unknown }; message?: string };

  if (err?.response?.data instanceof Blob) {
    try {
      const json = JSON.parse(await err.response.data.text());
      return json?.detail || json?.message || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  }

  const data = err?.response?.data as { detail?: string; message?: string } | undefined;
  return data?.detail || data?.message || err?.message || fallbackMessage;
};

export const extractErrorMessage = async (
  error: any,
  fallbackMessage: string = 'An error occurred'
): Promise<string> => {
  if (error?.response?.data instanceof Blob) {
    try {
      const text = await error.response.data.text();
      const jsonError = JSON.parse(text);
      return jsonError?.message || fallbackMessage;
    } catch {
      return fallbackMessage;
    }
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
};

export const getRemainingTime = (deadline: Date | string | number): string | null => {
  const totalSeconds = differenceInSeconds(new Date(deadline), new Date());

  if (totalSeconds <= 0) return '';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const getHourFromSecond = (totalSeconds: number): string | null => {
  if (totalSeconds <= 0) return '0';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const formatToTwoDecimal = (value: number | string): string => {
  const countryCode = TENANT_CODE as string;
  const numberValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

  if (isNaN(numberValue) || numberValue === null || numberValue === undefined) {
    return '0';
  }

  if (countryCode === 'VTP_CAM') {
    return numberValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  } else {
    return numberValue.toLocaleString('en-US');
  }
};

export const formatDigit = (value?: number | null): string => {
  if (value == null || isNaN(value)) return '--';
  return value.toLocaleString('en-US');
};

export const convertToNumber = (num: string) => {
  return toNumber(replace(num, /,/g, ''));
};

export const formatNumberFloatOnly = (num?: string | number) => {
  if (!num && num !== 0) return '';
  const n = Number(num);
  if (isNaN(n)) return '';

  // Nhân với 1000 để dịch dấu phẩy sang phải 3 chữ số,
  // dùng trunc để bỏ phần dư, sau đó chia lại cho 1000.
  const truncated = Math.trunc(n * 1000) / 1000;

  return truncated.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3, // Hiển thị tối đa 3 chữ số thập phân
  });
};

export const convertGtoKG = (value: string | number) => {
  if (!value) return 0;
  const rawValue = value.toString().replace(/,/g, '');
  const gram = parseFloat(rawValue);

  if (isNaN(gram)) return 0;

  const kg = CENTAL === 'kg' ? gram / 1000 : gram;

  return formatNumberFloatOnly(kg);
};

type Market = 'VTP_LAOS' | 'VTP_CAM' | 'VTP_VN';

const CURRENCY_MAP: Record<Market, string> = {
  VTP_LAOS: 'LAK',
  VTP_CAM: 'USD',
  VTP_VN: 'VND',
};

export const getCurrency = (): string => {
  const market = import.meta.env.VITE_TENANT_CODE as Market;
  return CURRENCY_MAP[market] ?? 'VND';
};

export const formatDimensions = (values: string): string => {
  const separator = import.meta.env.VITE_TENANT_CODE === 'VTP_LAOS' ? ' + ' : ' x ';
  return values.split('+').join(separator);
};
