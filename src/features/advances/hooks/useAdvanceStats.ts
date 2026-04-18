import { useQuery } from "@tanstack/react-query";
import { advanceServices } from "../api/advanceServices";
import { AdvanceStatsResponse } from "../types/advance.types";
import { ADVANCE_QUERY_KEYS } from "../constants/advance.constants";

export const useAdvanceStats = () => {
  return useQuery<AdvanceStatsResponse>({
    queryKey: [ADVANCE_QUERY_KEYS.STATS],
    queryFn: advanceServices.getAdvanceStats,
  });
};
