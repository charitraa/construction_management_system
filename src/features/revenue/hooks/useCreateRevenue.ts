import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revenueServices } from "../api/revenueServices";
import {
  CreateRevenueRequest,
  CreateRevenueResponse,
} from "../types/revenue.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { REVENUE_QUERY_KEYS } from "../constants/revenue.constants";
import { toast } from "@/hooks/use-toast";

export const useCreateRevenue = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateRevenueResponse,
    ApiErrorResponse,
    CreateRevenueRequest
  >({
    mutationFn: revenueServices.createRevenue,
    mutationKey: [REVENUE_QUERY_KEYS.CREATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEYS.LIST] });
      toast({
        title: "Revenue Recorded",
        description: "Revenue has been successfully recorded",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Recording Failed",
        description: error?.message || "Failed to record revenue",
      });
    },
  });
};
