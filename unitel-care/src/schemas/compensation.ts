import { differenceInDays, isValid, parse } from 'date-fns';
import { z } from 'zod';
import { getCurrency } from '../lib/utils';

type TenantCode = 'VTP_LAOS' | 'VTP_CAM' | 'VTP_VN';

const TENANT_REGEX: Record<TenantCode, { phone: RegExp; identify: RegExp; email: RegExp }> = {
  VTP_VN: {
    phone: /^(\+84|0)[3-9][0-9]{8}$/,
    identify: /^\d{9}$|^\d{12}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  VTP_LAOS: {
    // Prefix: 0 (trunk) or +856 (country code); subscriber body: 8–9 digits
    phone: /^(\+856|0)\d{8,9}$/,
    // 9-digit NID or passport (1-2 letters + 6-8 digits)
    identify: /^\d{9}$|^[A-Z]{1,2}\d{6,8}$/i,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  VTP_CAM: {
    // Prefix: 0 (trunk) or +855 (country code); all lengths exclude the prefix
    // Metfone 8-digit body : 090 060 066 067 068  → 2-digit prefix + 6 digits
    // Metfone 9-digit body : 097 088 031 071       → 2-digit prefix + 7 digits
    // Other carriers 8–9   : 01x 03[89] 06[19] 07[06-9] 08[013-579] 09[23568-9]
    phone:
      /^(\+855|0)((90|6[0678])\d{6}|(97|88|31|71)\d{7}|(1[0-8]|3[89]|6[19]|7[06-9]|8[013-79]|9[23568-9])\d{6,7})$/,
    identify: /^\d{9}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

const getTenantRegex = () => {
  const tenantCode = import.meta.env.VITE_TENANT_CODE as TenantCode;
  return TENANT_REGEX[tenantCode] ?? TENANT_REGEX.VTP_VN;
};

// VTP_LAOS / VTP_VN : số nguyên dương, không có số 0 ở đầu
// VTP_CAM           : số nguyên dương hoặc thập phân, tối đa 2 chữ số sau dấu "."
const BCG_VALUE_REGEX: Record<TenantCode, RegExp> = {
  VTP_VN: /^[1-9]\d*$/,
  VTP_LAOS: /^[0-9]\d*$/,
  VTP_CAM: /^[0-9]\d*(\.\d{1,2})?$/,
};

const getBcgValueSchema = (
  t: (key: string, options?: Record<string, unknown>) => string,
  req: (labelKey: string) => string
) => {
  const tenantCode = import.meta.env.VITE_TENANT_CODE as TenantCode;
  const regex = BCG_VALUE_REGEX[tenantCode] ?? BCG_VALUE_REGEX.VTP_VN;

  return z
    .string()
    .min(1, { message: req('compensation.detail.lblBcgValue') })
    .max(100, { message: t('compensation.complete.invalidBcgValueLength') })
    .regex(regex, { message: t('compensation.complete.invalidBcgValue') });
};

const DATE_FORMAT = 'dd/MM/yyyy';
const MAX_DATE_RANGE_DAYS = 90;

export const CompensationListFilterSchema = (
  t: (key: string, options?: Record<string, unknown>) => string
) =>
  z.object({
    keyword: z.string(),
    creationTime: z
      .object({
        from: z.string(),
        to: z.string(),
      })
      .refine(
        ({ from, to }) => {
          if (!from || !to) return true;
          const fromDate = parse(from, DATE_FORMAT, new Date());
          const toDate = parse(to, DATE_FORMAT, new Date());
          if (!isValid(fromDate) || !isValid(toDate)) return true;
          return differenceInDays(toDate, fromDate) <= MAX_DATE_RANGE_DAYS;
        },
        {
          message: t('violationReportConclude.validationDateRangeMax', {
            max: MAX_DATE_RANGE_DAYS,
          }),
          path: ['to'],
        }
      ),
    status: z.array(z.string()),
    paymentStatus: z.string(),
    postOfficeIds: z.array(z.string()),
  });
export type CompensationListFilterDataSchema = z.infer<
  ReturnType<typeof CompensationListFilterSchema>
>;

export const CompleteCompensationSchema = (
  t: (key: string, options?: Record<string, unknown>) => string
) => {
  const req = (labelKey: string) => `${t(labelKey)} ${t('common.isRequired')}`;
  const reqCurrency = (labelKey: string) =>
    `${t(labelKey)} (${getCurrency()}) ${t('common.isRequired')}`;
  const regex = getTenantRegex();

  return z.object({
    bcgValue: getBcgValueSchema(t, reqCurrency),
    bcgInfo: z.string().min(1, { message: req('compensation.detail.lblBcgInfo') }),
    customerId: z.string().min(1, { message: req('compensation.detail.lblCustomerId') }),
    customerName: z.string().min(1, { message: req('compensation.detail.lblCustomerName') }),
    identifyCus: z
      .string()
      .min(1, { message: req('compensation.detail.lblIdNumber') })
      .regex(regex.identify, { message: t('compensation.complete.invalidIdentify') }),
    phoneCus: z
      .string()
      .min(1, { message: req('compensation.detail.lblPhone') })
      .regex(regex.phone, { message: t('compensation.complete.invalidPhone') }),
    emailCus: z
      .string()
      .min(1, { message: req('compensation.detail.lblEmail') })
      .regex(regex.email, { message: t('compensation.complete.invalidEmail') }),
    addressCus: z.string().min(1, { message: req('compensation.detail.lblAddress') }),
    bankName: z.string().min(1, { message: req('compensation.detail.lblBank') }),
    bankCode: z.string().min(1, { message: req('compensation.detail.lblBank') }),
    bankAccoutnNumber: z.string().min(1, { message: req('compensation.detail.lblAccountNumber') }),
    beneficiary: z.string().min(1, { message: req('compensation.detail.lblBeneficiary') }),
    // debitAccount: z.string().min(1, { message: req('compensation.detail.lblDebitAccount') }),
  });
};

export type CompleteCompensationData = z.infer<ReturnType<typeof CompleteCompensationSchema>>;
