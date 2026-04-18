export interface Revenue {
  id: string;
  date: string;
  description: string;
  amount: number;
  project: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRevenueRequest {
  date: string;
  description: string;
  amount: number;
  project: string;
}

export interface ListRevenueResponse {
  data: Revenue[];
  message: string;
}

export interface CreateRevenueResponse {
  data: Revenue;
  message: string;
}
