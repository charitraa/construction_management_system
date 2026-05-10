import { useQuery } from "@tanstack/react-query";
import { advanceServices } from "../api/advanceServices";
import { ListAdvancesResponse } from "../types/advance.types";
import { ADVANCE_QUERY_KEYS } from "../constants/advance.constants";

export const useListAdvances = (params?: {
  page?: number;
  page_size?: number;
  search?: string;
  employee_id?: string;
  start_date?: string;
  end_date?: string;
  year?: number;
  month?: number;
}) => {
  return useQuery<ListAdvancesResponse>({
    queryKey: [ADVANCE_QUERY_KEYS.LIST, params],
    queryFn: () => advanceServices.listAdvances(params),
  });
};
