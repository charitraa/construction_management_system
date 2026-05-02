import { useMutation } from "@tanstack/react-query";
import { projectServices } from "../api/projectServices";
import { ProjectExportResponse } from "../types/project.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { PROJECT_QUERY_KEYS } from "../constants/project.constants";
import { toast } from "@/hooks/use-toast";

export const useExportProjects = () => {
  return useMutation<
    ProjectExportResponse,
    ApiErrorResponse,
    { location?: string; status?: string }
  >({
    mutationFn: projectServices.exportProjects,
    mutationKey: [PROJECT_QUERY_KEYS.EXPORT],
    onSuccess: (data) => {
      // Create and download CSV file
      const blob = new Blob([data.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'projects_export.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Projects have been exported to CSV",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error?.message || "Failed to export projects",
      });
    },
  });
};