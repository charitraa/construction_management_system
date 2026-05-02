import { useQuery } from "@tanstack/react-query";
import { revenueServices } from "../api/revenueServices";
import { ListRevenueResponse } from "../types/revenue.types";
import { REVENUE_QUERY_KEYS } from "../constants/revenue.constants";

export const useListRevenue = (params?: {
  search?: string;
  start_date?: string;
  end_date?: string;
  project?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery<ListRevenueResponse>({
    queryKey: [REVENUE_QUERY_KEYS.LIST, params],
    queryFn: () => revenueServices.listRevenue(params),
  });
};
