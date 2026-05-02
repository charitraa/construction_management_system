export interface Revenue {
  id: string;
  date: string;
  description: string;
  amount: string;
  project: string;
  client_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRevenueRequest {
  date: string;
  description: string;
  amount: string;
  project: string;
  client_name?: string;
}

export interface UpdateRevenueRequest {
  id: string;
  data: Partial<CreateRevenueRequest>;
}

export interface RevenuePagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ListRevenueResponse {
  data: Revenue[];
  pagination: RevenuePagination;
  message: string;
}

export interface CreateRevenueResponse {
  data: Revenue;
  message: string;
}

export interface RevenueRetrieveResponse {
  data: Revenue;
  message: string;
}

export interface RevenueUpdateResponse {
  data: Revenue;
  message: string;
}

export interface RevenueDeleteResponse {
  message: string;
}

export interface RevenueStatsResponse {
  data: any;
  message: string;
}

export interface RevenueExportResponse {
  data: string;
  message: string;
}

