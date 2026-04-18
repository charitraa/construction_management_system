import { useQuery } from "@tanstack/react-query";
import { dashboardServices } from "../api/dashboardServices";
import { DashboardOverviewResponse } from "../types/dashboard.types";
import { DASHBOARD_QUERY_KEYS } from "../constants/dashboard.constants";

export const useDashboardOverview = () => {
  return useQuery<DashboardOverviewResponse>({
    queryKey: [DASHBOARD_QUERY_KEYS.OVERVIEW],
    queryFn: dashboardServices.getDashboardOverview,
  });
};
