import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectServices } from "../api/projectServices";
import {
  UpdateProjectRequest,
  CreateProjectResponse,
} from "../types/project.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { PROJECT_QUERY_KEYS } from "../constants/project.constants";
import { toast } from "@/hooks/use-toast";

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateProjectResponse,
    ApiErrorResponse,
    UpdateProjectRequest
  >({
    mutationFn: projectServices.updateProject,
    mutationKey: [PROJECT_QUERY_KEYS.UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEYS.STATS] });

      toast({
        title: "Project Updated",
        description: "Project has been successfully updated",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error?.message || "Failed to update project",
      });
    },
  });
};