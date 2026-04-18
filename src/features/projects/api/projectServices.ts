import { httpClient } from "@/shared/api/httpClient";
import {
  CreateProjectRequest,
  ListProjectsResponse,
  CreateProjectResponse,
  ProjectStatsResponse,
} from "../types/project.types";
import { PROJECT_ENDPOINTS } from "../constants/project.constants";

export const projectServices = {
  listProjects: (params?: {
    status?: string;
    page?: number;
    page_size?: number;
  }) =>
    httpClient.get<ListProjectsResponse>(PROJECT_ENDPOINTS.LIST, { params }),

  createProject: (data: CreateProjectRequest) =>
    httpClient.post<CreateProjectResponse>(PROJECT_ENDPOINTS.CREATE, data),

  getProjectStats: () =>
    httpClient.get<ProjectStatsResponse>(PROJECT_ENDPOINTS.STATS),
};
