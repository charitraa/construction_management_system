import { useMutation, useQueryClient } from "@tanstack/react-query";
import { advanceServices } from "../api/advanceServices";
import { DeleteAdvanceResponse } from "../types/advance.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { ADVANCE_QUERY_KEYS } from "../constants/advance.constants";
import { toast } from "@/hooks/use-toast";

export const useDeleteAdvance = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteAdvanceResponse, ApiErrorResponse, string>({
    mutationFn: (advanceId) => advanceServices.deleteAdvance(advanceId),
    mutationKey: [ADVANCE_QUERY_KEYS.DELETE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADVANCE_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({
        queryKey: [ADVANCE_QUERY_KEYS.STATS],
      });
      toast({
        variant: "success",
        title: "Advance Deleted",
        description: "Advance record has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error?.message || "Failed to delete advance",
      });
    },
  });
};