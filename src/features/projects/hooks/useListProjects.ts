import { useQuery } from "@tanstack/react-query";
import { projectServices } from "../api/projectServices";
import { ListProjectsResponse } from "../types/project.types";
import { PROJECT_QUERY_KEYS } from "../constants/project.constants";

export const useListProjects = (params?: {
  status?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery<ListProjectsResponse>({
    queryKey: [PROJECT_QUERY_KEYS.LIST, params],
    queryFn: () => projectServices.listProjects(params),
  });
};
