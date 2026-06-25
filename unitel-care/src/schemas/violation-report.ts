import { differenceInDays, isValid, parse } from 'date-fns';
import { z } from 'zod';

const DATE_FORMAT = 'dd/MM/yyyy';
const MAX_DATE_RANGE_DAYS = 90;

export const ViolationReportFilterSchema = (
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
    branchId: z.string(),
    postOfficeId: z.array(z.string()),
    status: z.array(z.string()),
    mistakeCode: z.array(z.string()),
  });
export type ViolationReportFilterDataSchema = z.infer<
  ReturnType<typeof ViolationReportFilterSchema>
>;

export const CreateViolationReportSchema = (t: (key: string) => string) =>
  z.object({
    nhomLoi: z.string().min(1, t('violationReportConclude.createMinutesValidate.groupError')),
    chiTietLoi: z.string().min(1, t('violationReportConclude.createMinutesValidate.detailError')),
    maLoi: z.string().min(1, t('violationReportConclude.createMinutesValidate.codeError')),
    buuCucBiLap: z
      .string()
      .min(1, t('violationReportConclude.createMinutesValidate.postOfficeError')),
    caNhanViPham: z.array(z.string()).min(1, {
      message: t('violationReportConclude.createMinutesValidate.violatorError'),
    }),
    maBienBanThamChieu: z.string().optional(),
    noiDung: z.string().min(1, t('violationReportConclude.createMinutesValidate.contentError')),
  });

export type CreateViolationReportData = z.infer<ReturnType<typeof CreateViolationReportSchema>>;
