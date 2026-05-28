import { httpClient } from "@/shared/api/httpClient";
import { ReceivablesParams, ReceivablesResponse } from "../types/receivables.types";
import { RECEIVABLES_ENDPOINTS } from "../constants/receivables.constants";

export const receivablesServices = {
  listReceivables: (params?: ReceivablesParams) =>
    httpClient.get<ReceivablesResponse>(RECEIVABLES_ENDPOINTS.LIST, { params }),
};
