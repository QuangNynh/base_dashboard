export const PostOfficeType = {
  ORIGIN: 'ORIGIN',
  DELIVERY: 'DELIVERY',
  CURRENT: 'CURRENT',
} as const;

export type PostOfficeType = (typeof PostOfficeType)[keyof typeof PostOfficeType];
export const PostOfficeTypeLabelKey: Record<PostOfficeType, string> = {
  [PostOfficeType.ORIGIN]: 'postOffice.origin',
  [PostOfficeType.DELIVERY]: 'postOffice.delivery',
  [PostOfficeType.CURRENT]: 'postOffice.current',
};

export const postOfficeOptions = Object.values(PostOfficeType).map((value) => ({
  value,
  label: PostOfficeTypeLabelKey[value],
}));
