import { httpClient } from "@/shared/api/httpClient";
import {
  CreateAdvanceRequest,
  ListAdvancesResponse,
  CreateAdvanceResponse,
  AdvanceStatsResponse,
} from "../types/advance.types";
import { ADVANCE_ENDPOINTS } from "../constants/advance.constants";

export const advanceServices = {
  listAdvances: (params?: { page?: number; page_size?: number }) =>
    httpClient.get<ListAdvancesResponse>(ADVANCE_ENDPOINTS.LIST, { params }),

  createAdvance: (data: CreateAdvanceRequest) =>
    httpClient.post<CreateAdvanceResponse>(ADVANCE_ENDPOINTS.CREATE, data),

  getAdvanceStats: () =>
    httpClient.get<AdvanceStatsResponse>(ADVANCE_ENDPOINTS.STATS),
};
