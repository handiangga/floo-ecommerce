export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalData: number;
  totalPage: number;
}

export interface PaginationResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}