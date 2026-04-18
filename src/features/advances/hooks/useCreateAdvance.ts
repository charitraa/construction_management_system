import { useMutation, useQueryClient } from "@tanstack/react-query";
import { advanceServices } from "../api/advanceServices";
import {
  CreateAdvanceRequest,
  CreateAdvanceResponse,
} from "../types/advance.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { ADVANCE_QUERY_KEYS } from "../constants/advance.constants";
import { toast } from "@/hooks/use-toast";

export const useCreateAdvance = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateAdvanceResponse,
    ApiErrorResponse,
    CreateAdvanceRequest
  >({
    mutationFn: advanceServices.createAdvance,
    mutationKey: [ADVANCE_QUERY_KEYS.CREATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ADVANCE_QUERY_KEYS.LIST] });
      toast({
        title: "Advance Recorded",
        description: "Advance has been successfully recorded",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Recording Failed",
        description: error?.message || "Failed to record advance",
      });
    },
  });
};
