import { useQuery } from "@tanstack/react-query";
import { revenueServices } from "../api/revenueServices";
import { RevenueStatsResponse } from "../types/revenue.types";
import { REVENUE_QUERY_KEYS } from "../constants/revenue.constants";

export const useRevenueStats = () => {
  return useQuery<RevenueStatsResponse, Error>({
    queryKey: [REVENUE_QUERY_KEYS.STATS],
    queryFn: () => revenueServices.getRevenueStats(),
  });
};