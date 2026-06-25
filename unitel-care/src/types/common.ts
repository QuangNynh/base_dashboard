export interface PaginationSearch {
  page?: number;
  size?: number;
}

/** Option dùng chung cho Combobox, Select, MultiSelect, ... */
export type Option = {
  value: string;
  label: string;
};

/** Wrapper API trả về 1 object đơn */
export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

/** Hàm transform data từ API response sang mảng Option (dùng trong `select` của react-query) */
export type SelectDataFn<TResponse> = (res: TResponse) => Option[];
