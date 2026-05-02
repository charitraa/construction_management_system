import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revenueServices } from "../api/revenueServices";
import {
  UpdateRevenueRequest,
  RevenueUpdateResponse,
} from "../types/revenue.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { REVENUE_QUERY_KEYS } from "../constants/revenue.constants";
import { toast } from "@/hooks/use-toast";

export const useUpdateRevenue = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RevenueUpdateResponse,
    ApiErrorResponse,
    UpdateRevenueRequest
  >({
    mutationFn: revenueServices.updateRevenue,
    mutationKey: [REVENUE_QUERY_KEYS.UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEYS.STATS] });

      toast({
        title: "Revenue Updated",
        description: "Revenue record has been successfully updated",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error?.message || "Failed to update revenue record",
      });
    },
  });
};