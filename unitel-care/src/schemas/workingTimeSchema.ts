import { z } from 'zod';

export const workingTimeSchema = (t: (key: string) => string) =>
  z
    .object({
      startTime: z.string(),
      endTime: z.string(),
      complaintMilestone: z.string().optional(),
      kpiMilestone: z.string().optional(),
      applyDays: z.array(z.string()).min(1, t('workingTimeSetup.applyDaysRequired')),
      applyDateRange: z.object({
        from: z.string(),
        to: z.string(),
      }),
    })
    .superRefine((data, ctx) => {
      const timeFormatRegex = /^\d{2}:\d{2}$/;

      // startTime & endTime: bắt buộc, cùng chọn hoặc cùng null
      if (!data.startTime) {
        ctx.addIssue({
          code: 'custom',
          message: t('workingTimeSetup.startTimeRequired'),
          path: ['startTime'],
        });
      } else if (!timeFormatRegex.test(data.startTime)) {
        ctx.addIssue({
          code: 'custom',
          message: t('workingTimeSetup.invalidTimeFormat'),
          path: ['startTime'],
        });
      }

      if (!data.endTime) {
        ctx.addIssue({
          code: 'custom',
          message: t('workingTimeSetup.endTimeRequired'),
          path: ['endTime'],
        });
      } else if (!timeFormatRegex.test(data.endTime)) {
        ctx.addIssue({
          code: 'custom',
          message: t('workingTimeSetup.invalidTimeFormat'),
          path: ['endTime'],
        });
      }

      if (data.complaintMilestone && !timeFormatRegex.test(data.complaintMilestone)) {
        ctx.addIssue({
          code: 'custom',
          message: t('workingTimeSetup.invalidTimeFormat'),
          path: ['complaintMilestone'],
        });
      }

      if (data.kpiMilestone && !timeFormatRegex.test(data.kpiMilestone)) {
        ctx.addIssue({
          code: 'custom',
          message: t('workingTimeSetup.invalidTimeFormat'),
          path: ['kpiMilestone'],
        });
      }

      // startTime phải nhỏ hơn endTime
      if (data.startTime && data.endTime && data.startTime >= data.endTime) {
        ctx.addIssue({
          code: 'custom',
          message: t('workingTimeSetup.startMustBeforeEnd'),
          path: ['startTime'],
        });
        ctx.addIssue({
          code: 'custom',
          message: t('workingTimeSetup.endMustBeAfterStart'),
          path: ['endTime'],
        });
      }

      // complaintMilestone phải nằm trong khoảng [startTime, endTime)
      if (data.complaintMilestone && data.startTime && data.endTime) {
        if (data.complaintMilestone < data.startTime || data.complaintMilestone >= data.endTime) {
          ctx.addIssue({
            code: 'custom',
            message: t('workingTimeSetup.complaintMilestoneOutOfRange'),
            path: ['complaintMilestone'],
          });
        }
      }

      // applyDateRange: bắt buộc cả from và to
      if (!data.applyDateRange.from) {
        ctx.addIssue({
          code: 'custom',
          message: t('workingTimeSetup.applyFromRequired'),
          path: ['applyDateRange'],
        });
      } else if (!data.applyDateRange.to) {
        ctx.addIssue({
          code: 'custom',
          message: t('workingTimeSetup.applyToRequired'),
          path: ['applyDateRange'],
        });
      }
    });

export type WorkingTimeFormData = z.infer<ReturnType<typeof workingTimeSchema>>;
