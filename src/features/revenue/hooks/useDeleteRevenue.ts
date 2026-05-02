import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revenueServices } from "../api/revenueServices";
import { RevenueDeleteResponse } from "../types/revenue.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { REVENUE_QUERY_KEYS } from "../constants/revenue.constants";
import { toast } from "@/hooks/use-toast";

export const useDeleteRevenue = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RevenueDeleteResponse,
    ApiErrorResponse,
    string
  >({
    mutationFn: revenueServices.deleteRevenue,
    mutationKey: [REVENUE_QUERY_KEYS.DELETE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({ queryKey: [REVENUE_QUERY_KEYS.STATS] });

      toast({
        title: "Revenue Deleted",
        description: "Revenue record has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error?.message || "Failed to delete revenue record",
      });
    },
  });
};