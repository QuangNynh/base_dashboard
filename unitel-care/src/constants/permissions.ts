export const ROLE_GROUP = {
  VAN_HANH: 'VAN_HANH',
  CSKH: 'CSKH',
  NVBC: 'NVBC',
} as const;

export const ROLE_TO_GROUP: Record<string, keyof typeof ROLE_GROUP> = {
  ODOWTC: ROLE_GROUP.VAN_HANH, //phòng vận hành
  BOD: ROLE_GROUP.VAN_HANH, //ban giám đốc công ty
  BODOB: ROLE_GROUP.VAN_HANH, //ban giám đốc chi nhánh
  DOB: ROLE_GROUP.VAN_HANH, //giám đốc chi nhánh

  HPO: ROLE_GROUP.NVBC, //trưởng bưu cục
  PODM: ROLE_GROUP.NVBC, //bưu tá

  TVV: ROLE_GROUP.CSKH, //tư vấn viên
  CS: ROLE_GROUP.CSKH, //chăm sóc khách hàng
};

export const ROLE_DETAILS = {
  VDC: { code: 'VDC', name: 'Vice Director of Company', nameVi: 'Phó Giám Đốc Công ty' },
  BOD: { code: 'BOD', name: 'Board of Director of Company', nameVi: 'Ban Giám Đốc Công ty' },
  DOB: { code: 'DOB', name: 'Director of Branch', nameVi: 'Giám Đốc Chi nhánh' },
  VDOB: { code: 'VDOB', name: 'Vice Director of Branch', nameVi: 'Phó Giám Đốc Chi nhánh' },
  BODOB: {
    code: 'BODOB',
    name: 'Board of Director of Branch',
    nameVi: 'Ban Giám Đốc Chi nhánh',
  },
  BODOWTC: {
    code: 'BODOWTC',
    name: 'Board of Director of Warehouse and Transportation Center',
    nameVi: 'Ban Giám Đốc Trung tâm kho vận',
  },
  ODOWTC: { code: 'ODOWTC', name: 'Operation Department', nameVi: 'Phòng Vận hành' },
  HPO: { code: 'HPO', name: 'Head of Post-Office', nameVi: 'Trưởng bưu cục' },
  POSS: { code: 'POSS', name: 'Sale staff', nameVi: 'Nhân viên kinh doanh' },
  PODM: { code: 'PODM', name: 'Delivery-man', nameVi: 'Bưu tá' },
  STAFF: { code: 'STAFF', name: 'Staff', nameVi: 'Nhân viên' },
  DC: { code: 'DC', name: 'Director of Company', nameVi: 'Giám Đốc Công ty' },
  POOS: { code: 'POOS', name: 'Logistics Staff', nameVi: 'Nhân viên Logistics' },
  TEST: { code: 'TEST', name: 'Test', nameVi: 'Test' },
  CACC: { code: 'CACC', name: 'Chief Accountant', nameVi: 'Kế toán trưởng công ty' },
  GLAC: { code: 'GLAC', name: 'General Ledger Accountant', nameVi: 'Kế toán chuyển quản công ty' },
  DRIVER: { code: 'DRIVER', name: 'Driver', nameVi: 'Nhân viên lái xe' },
  KT: { code: 'KT', name: 'Unit Accountant', nameVi: 'Kế toán đơn vị' },
  PACC: { code: 'PACC', name: 'Payment Accountant', nameVi: 'Kế toán thanh toán' },
  TVV: { code: 'TTV', name: 'Customer Care', nameVi: 'Chăm sóc khách hàng' },
  CS: { code: 'CSKH', name: 'Customer Care', nameVi: 'Chăm sóc khách hàng' },
} as const;
