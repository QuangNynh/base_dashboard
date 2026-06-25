export const FORMAT_DATE = {
  DDMMYYYY: 'dd/MM/yyyy',
  YYYYMMDD: 'yyyy-MM-dd',
  YYYYMMDD_ONLY: 'yyyyMMdd',
  FULL_DATE_TIME: 'dd/MM/yyyy HH:mm:ss',
  FULL_DATE_TIME_NO_SECONDS: 'dd/MM/yyyy HH:mm',
  TIME: 'HH:mm:ss',
} as const;
export type FormatDateString = (typeof FORMAT_DATE)[keyof typeof FORMAT_DATE];

export const CURRENCY_UNIT = import.meta.env.VITE_TENANT_CODE === 'VTP_LAOS' ? 'LAK' : 'USD';
export const CENTAL = import.meta.env.VITE_TENANT_CODE === 'VTP_LAOS' ? 'kg' : 'g';

export const PARCEL_TYPE = {
  GOODS: 'GOODS',
  DOCUMENT: 'DOCUMENT',
  SPECIFIC: 'SPECIFIC',
  NORMAL: 'NORMAL',
  BULKY: 'BULKY',
} as const;
export type ParcelType = (typeof PARCEL_TYPE)[keyof typeof PARCEL_TYPE];

export const PARCEL_TYPE_LABEL_KEY: Record<ParcelType, string> = {
  [PARCEL_TYPE.GOODS]: 'common.goods',
  [PARCEL_TYPE.DOCUMENT]: 'common.doc',
  [PARCEL_TYPE.SPECIFIC]: 'common.specific',
  [PARCEL_TYPE.NORMAL]: 'common.normal',
  [PARCEL_TYPE.BULKY]: 'common.bulky',
};

export const ORDER_JOURNEY_STATUS = {
  PICKUP: 'PICKUP',
  TRANSIT: 'TRANSIT',
  DELIVERY: 'DELIVERY',
  DELIVERED: 'DELIVERED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderJourneyStatusType =
  (typeof ORDER_JOURNEY_STATUS)[keyof typeof ORDER_JOURNEY_STATUS];
