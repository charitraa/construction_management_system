import { httpClient } from "@/shared/api/httpClient";
import {
  CreateAdvanceRequest,
  UpdateAdvanceRequest,
  ListAdvancesResponse,
  CreateAdvanceResponse,
  AdvanceStatsResponse,
  AdvanceDetailResponse,
  UpdateAdvanceResponse,
  DeleteAdvanceResponse,
} from "../types/advance.types";
import { ADVANCE_ENDPOINTS } from "../constants/advance.constants";

export const advanceServices = {
  listAdvances: (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    employee_id?: string;
    start_date?: string;
    end_date?: string;
    year?: number;
    month?: number;
  }) =>
    httpClient.get<ListAdvancesResponse>(ADVANCE_ENDPOINTS.LIST, { params }),

  createAdvance: (data: CreateAdvanceRequest) =>
    httpClient.post<CreateAdvanceResponse>(ADVANCE_ENDPOINTS.CREATE, data),

  getAdvanceStats: () =>
    httpClient.get<AdvanceStatsResponse>(ADVANCE_ENDPOINTS.STATS),

  getAdvanceDetail: (advanceId: string) =>
    httpClient.get<AdvanceDetailResponse>(`${ADVANCE_ENDPOINTS.DETAIL}${advanceId}/`),

  updateAdvance: (advanceId: string, data: UpdateAdvanceRequest) =>
    httpClient.put<UpdateAdvanceResponse>(`${ADVANCE_ENDPOINTS.UPDATE}${advanceId}/`, data),

  deleteAdvance: (advanceId: string) =>
    httpClient.delete<DeleteAdvanceResponse>(`${ADVANCE_ENDPOINTS.DELETE}${advanceId}/`),
};
