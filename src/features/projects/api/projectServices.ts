import { httpClient } from "@/shared/api/httpClient";
import {
  CreateProjectRequest,
  UpdateProjectRequest,
  ListProjectsResponse,
  CreateProjectResponse,
  ProjectRetrieveResponse,
  ProjectDeleteResponse,
  ProjectExportResponse,
  ProjectStatsResponse,
  Project,
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

  getProject: (id: string) =>
    httpClient.get<ProjectRetrieveResponse>(`${PROJECT_ENDPOINTS.RETRIEVE}${id}/`),

  updateProject: (data: UpdateProjectRequest) =>
    httpClient.put<CreateProjectResponse>(`${PROJECT_ENDPOINTS.UPDATE}${data.id}/`, data.data),

  deleteProject: (id: string) =>
    httpClient.delete<ProjectDeleteResponse>(`${PROJECT_ENDPOINTS.DELETE}${id}/`),

  getProjectStats: () =>
    httpClient.get<ProjectStatsResponse>(PROJECT_ENDPOINTS.STATS),

  exportProjects: (params?: {
    location?: string;
    status?: string;
  }) =>
    httpClient.get<ProjectExportResponse>(PROJECT_ENDPOINTS.EXPORT, { params }),
};
