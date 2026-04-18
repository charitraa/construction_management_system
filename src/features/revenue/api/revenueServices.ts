import { httpClient } from "@/shared/api/httpClient";
import {
  CreateRevenueRequest,
  ListRevenueResponse,
  CreateRevenueResponse,
} from "../types/revenue.types";
import { REVENUE_ENDPOINTS } from "../constants/revenue.constants";

export const revenueServices = {
  listRevenue: (params?: {
    start_date?: string;
    end_date?: string;
    project?: string;
    page?: number;
    page_size?: number;
  }) => httpClient.get<ListRevenueResponse>(REVENUE_ENDPOINTS.LIST, { params }),

  createRevenue: (data: CreateRevenueRequest) =>
    httpClient.post<CreateRevenueResponse>(REVENUE_ENDPOINTS.CREATE, data),
};
