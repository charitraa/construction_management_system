import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectServices } from "../api/projectServices";
import {
  CreateProjectRequest,
  CreateProjectResponse,
} from "../types/project.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { PROJECT_QUERY_KEYS } from "../constants/project.constants";
import { toast } from "@/hooks/use-toast";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateProjectResponse,
    ApiErrorResponse,
    CreateProjectRequest
  >({
    mutationFn: projectServices.createProject,
    mutationKey: [PROJECT_QUERY_KEYS.CREATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEYS.STATS] });

      toast({
        title: "Project Created",
        description: "Project has been successfully created",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error?.message || "Failed to create project",
      });
    },
  });
};
