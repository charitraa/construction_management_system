import { useMutation, useQueryClient } from "@tanstack/react-query";
import { advanceServices } from "../api/advanceServices";
import {
  UpdateAdvanceRequest,
  UpdateAdvanceResponse,
} from "../types/advance.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { ADVANCE_QUERY_KEYS } from "../constants/advance.constants";
import { toast } from "@/hooks/use-toast";

export const useUpdateAdvance = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateAdvanceResponse,
    ApiErrorResponse,
    { advanceId: string; data: UpdateAdvanceRequest }
  >({
    mutationFn: ({ advanceId, data }) =>
      advanceServices.updateAdvance(advanceId, data),
    mutationKey: [ADVANCE_QUERY_KEYS.UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADVANCE_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({
        queryKey: [ADVANCE_QUERY_KEYS.STATS],
      });
      toast({
        variant: "success",
        title: "Advance Updated",
        description: "Advance has been successfully updated",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error?.message || "Failed to update advance",
      });
    },
  });
};