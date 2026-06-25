import { z } from 'zod';

export const createErrorCauseSchema = (
  t: (key: string, options?: Record<string, unknown>) => string
) =>
  z.object({
    code: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .max(50, t('validation.maxLength', { max: 50 }))
      .regex(/^[A-Za-z0-9_]+$/, t('validation.noSpecialChar')),

    description: z
      .string()
      .min(1, t('validation.required'))
      .max(255, t('validation.maxLength', { max: 255 })),

    is_deleted: z.boolean().default(false),
  });

export const createFeedbackLevel1Schema = (
  t: (key: string, options?: Record<string, unknown>) => string
) =>
  z.object({
    code: z
      .string()
      .trim()
      .min(1, t('validation.requiredCode'))
      .max(50, t('validation.maxLengthCode', { max: 50 }))
      .regex(/^[A-Za-z0-9_]+$/, t('validation.noSpecialChar')),

    name: z
      .string()
      .min(1, t('validation.required'))
      .max(255, t('validation.maxLength', { max: 255 })),

    is_deleted: z.boolean().default(false),
    level: z.number().default(1),
  });

export const createFeedbackLevel2Schema = (
  t: (key: string, options?: Record<string, unknown>) => string
) =>
  z.object({
    code: z
      .string()
      .trim()
      .min(1, t('validation.requiredCode'))
      .max(50, t('validation.maxLengthCode', { max: 50 }))
      .regex(/^[A-Za-z0-9_]+$/, t('validation.noSpecialChar')),

    name: z
      .string()
      .min(1, t('validation.required'))
      .max(255, t('validation.maxLength', { max: 255 })),

    is_deleted: z.boolean().default(false),
    level: z.number().default(2),
    parent_id: z.string().min(1, t('validation.requiredCode')),
    error_cause_ids: z.array(z.string()).default([]),
    processing_office: z.string().min(1, t('validation.required')),
    resolution_time_hours: z
      .string()
      .min(1, t('validation.required'))
      .regex(/^\d+$/, t('validation.onlyDigits'))
      .max(4, t('validation.maxDigits', { max: 4 }))
      .refine((val) => Number(val) > 0, { message: t('validation.greaterThanZero') }),
  });

export const createExtensionReasonSchema = (
  t: (key: string, options?: Record<string, unknown>) => string
) =>
  z.object({
    code: z
      .string()
      .trim()
      .min(1, t('validation.required'))
      .max(50, t('validation.maxLength', { max: 50 }))
      .regex(/^[A-Za-z0-9_]+$/, t('validation.noSpecialCharCode')),

    name: z
      .string()
      .min(1, t('validation.required'))
      .max(255, t('validation.maxLength', { max: 255 })),

    max_hours: z
      .string()
      .min(1, t('validation.required'))
      .refine((val) => !isNaN(Number(val)), {
        message: t('validation.number'),
      })
      .max(4, t('validation.maxDigits', { max: 4 }))
      .refine((val) => Number(val) > 0, { message: t('validation.greaterThanZeroCreate') }),

    is_deleted: z.boolean(),
  });

export type CreateErrorCauseData = z.infer<ReturnType<typeof createErrorCauseSchema>>;
export type CreateExtensionReasonData = z.infer<ReturnType<typeof createExtensionReasonSchema>>;
export type CreateFeedbackLevel1Data = z.infer<ReturnType<typeof createFeedbackLevel1Schema>>;
export type CreateFeedbackLevel2Data = z.infer<ReturnType<typeof createFeedbackLevel2Schema>>;
