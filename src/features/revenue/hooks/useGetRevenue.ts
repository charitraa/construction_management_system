import { useQuery } from "@tanstack/react-query";
import { revenueServices } from "../api/revenueServices";
import { RevenueRetrieveResponse } from "../types/revenue.types";
import { REVENUE_QUERY_KEYS } from "../constants/revenue.constants";

export const useGetRevenue = (id: string) => {
  return useQuery<RevenueRetrieveResponse, Error>({
    queryKey: [REVENUE_QUERY_KEYS.RETRIEVE, id],
    queryFn: () => revenueServices.getRevenue(id),
    enabled: !!id,
  });
};