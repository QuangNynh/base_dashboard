import { z } from 'zod';

export const workDaySettingSchema = (t: (key: string) => string) =>
  z
    .object({
      startTime: z.string(),
      endTime: z.string(),
      complaintMilestone: z.string().optional(),
      kpiMilestone: z.string().optional(),
      isDayOff: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (!data.isDayOff) {
        if (!data.startTime) {
          ctx.addIssue({
            code: 'custom',
            message: t('workingTimeSetup.startTimeRequired'),
            path: ['startTime'],
          });
        }
        if (!data.endTime) {
          ctx.addIssue({
            code: 'custom',
            message: t('workingTimeSetup.endTimeRequired'),
            path: ['endTime'],
          });
        }
        if (data.startTime && data.endTime && data.startTime >= data.endTime) {
          ctx.addIssue({
            code: 'custom',
            message: t('workingTimeSetup.startMustBeforeEnd'),
            path: ['endTime'],
          });
        }
        if (data.complaintMilestone && data.startTime && data.endTime) {
          if (
            data.complaintMilestone < data.startTime ||
            data.complaintMilestone >= data.endTime
          ) {
            ctx.addIssue({
              code: 'custom',
              message: t('workingTimeSetup.complaintMilestoneOutOfRange'),
              path: ['complaintMilestone'],
            });
          }
        }
      }
    });

export type WorkDayFormValues = z.infer<ReturnType<typeof workDaySettingSchema>>;
