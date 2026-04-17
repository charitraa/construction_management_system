export interface Pagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ApiResponse<T> {
  data?: T | null;
  message?: string;
  pagination?: Pagination;
}

export interface ApiErrorResponse {
  message: string;
}

export interface BaseQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
  status?: string;
}