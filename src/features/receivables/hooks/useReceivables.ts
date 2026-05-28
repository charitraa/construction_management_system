import { useQuery } from "@tanstack/react-query";
import { receivablesServices } from "../api/receivablesServices";
import { ReceivablesParams, ReceivablesResponse } from "../types/receivables.types";
import { RECEIVABLES_QUERY_KEYS } from "../constants/receivables.constants";

export const useReceivables = (params?: ReceivablesParams) => {
  return useQuery<ReceivablesResponse>({
    queryKey: [RECEIVABLES_QUERY_KEYS.LIST, params],
    queryFn: () => receivablesServices.listReceivables(params),
  });
};
