export interface Advance {
  id: string;
  date: string;
  employee: string;
  employee_name?: string;
  employee_role?: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAdvanceRequest {
  date: string;
  employee: string;
  amount: number;
}

export interface UpdateAdvanceRequest {
  date?: string;
  employee?: string;
  amount?: number;
}

export interface AdvanceStats {
  average_advance: number;
  highest_advance: number;
  total_advance: number;
  total_count: number;

}

export interface ListAdvancesResponse {
  data: Advance[];
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  message: string;
}

export interface CreateAdvanceResponse {
  data: Advance;
  message: string;
}

export interface AdvanceStatsResponse {
  data: AdvanceStats;
  message: string;
}

export interface AdvanceDetailResponse {
  data: Advance;
  message: string;
}

export interface UpdateAdvanceResponse {
  data: Advance;
  message: string;
}

export interface DeleteAdvanceResponse {
  message: string;
}
