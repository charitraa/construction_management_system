import { useQuery } from "@tanstack/react-query";
import { projectServices } from "../api/projectServices";
import { ProjectRetrieveResponse } from "../types/project.types";
import { PROJECT_QUERY_KEYS } from "../constants/project.constants";

export const useGetProject = (id: string) => {
  return useQuery<ProjectRetrieveResponse, Error>({
    queryKey: [PROJECT_QUERY_KEYS.RETRIEVE, id],
    queryFn: () => projectServices.getProject(id),
    enabled: !!id,
  });
};