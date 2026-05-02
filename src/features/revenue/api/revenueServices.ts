import { httpClient } from "@/shared/api/httpClient";
import {
  CreateRevenueRequest,
  UpdateRevenueRequest,
  ListRevenueResponse,
  CreateRevenueResponse,
  RevenueRetrieveResponse,
  RevenueUpdateResponse,
  RevenueDeleteResponse,
  RevenueStatsResponse,
  RevenueExportResponse,
} from "../types/revenue.types";
import { REVENUE_ENDPOINTS } from "../constants/revenue.constants";

export const revenueServices = {
  listRevenue: (params?: {
    search?: string;
    start_date?: string;
    end_date?: string;
    project?: string;
    page?: number;
    page_size?: number;
  }) => httpClient.get<ListRevenueResponse>(REVENUE_ENDPOINTS.LIST, { params }),

  createRevenue: (data: CreateRevenueRequest) =>
    httpClient.post<CreateRevenueResponse>(REVENUE_ENDPOINTS.CREATE, data),

  getRevenue: (id: string) =>
    httpClient.get<RevenueRetrieveResponse>(`${REVENUE_ENDPOINTS.RETRIEVE}${id}/`),

  updateRevenue: (data: UpdateRevenueRequest) =>
    httpClient.put<RevenueUpdateResponse>(`${REVENUE_ENDPOINTS.UPDATE}${data.id}/`, data.data),

  deleteRevenue: (id: string) =>
    httpClient.delete<RevenueDeleteResponse>(`${REVENUE_ENDPOINTS.DELETE}${id}/`),

  getRevenueStats: () =>
    httpClient.get<RevenueStatsResponse>(REVENUE_ENDPOINTS.STATS),

  exportRevenue: (params?: {
    status?: string;
    pay_method?: string;
    start_date?: string;
    end_date?: string;
  }) =>
    httpClient.get<RevenueExportResponse>(REVENUE_ENDPOINTS.EXPORT, { params }),
};
