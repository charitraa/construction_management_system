import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectServices } from "../api/projectServices";
import { ProjectDeleteResponse } from "../types/project.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { PROJECT_QUERY_KEYS } from "../constants/project.constants";
import { toast } from "@/hooks/use-toast";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProjectDeleteResponse,
    ApiErrorResponse,
    string
  >({
    mutationFn: projectServices.deleteProject,
    mutationKey: [PROJECT_QUERY_KEYS.DELETE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEYS.STATS] });

      toast({
        title: "Project Deleted",
        description: "Project has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error?.message || "Failed to delete project",
      });
    },
  });
};