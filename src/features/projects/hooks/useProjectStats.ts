import { useQuery } from "@tanstack/react-query";
import { projectServices } from "../api/projectServices";
import { ProjectStatsResponse } from "../types/project.types";
import { PROJECT_QUERY_KEYS } from "../constants/project.constants";

export const useProjectStats = () => {
  return useQuery<ProjectStatsResponse>({
    queryKey: [PROJECT_QUERY_KEYS.STATS],
    queryFn: projectServices.getProjectStats,
  });
};
