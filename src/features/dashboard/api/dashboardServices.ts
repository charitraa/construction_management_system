import { httpClient } from "@/shared/api/httpClient";
import { DashboardOverviewResponse } from "../types/dashboard.types";
import { DASHBOARD_ENDPOINTS } from "../constants/dashboard.constants";

export const dashboardServices = {
  getDashboardOverview: () =>
    httpClient.get<DashboardOverviewResponse>(DASHBOARD_ENDPOINTS.OVERVIEW),
};
