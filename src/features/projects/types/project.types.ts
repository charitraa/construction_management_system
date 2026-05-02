export interface Project {
  id: string;
  name: string;
  description: string;
  client_name: string;
  location: string;
  start_date: string;
  status: "ongoing" | "completed" | "delayed";
  budget: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  client_name: string;
  location: string;
  start_date: string;
  status: "ongoing" | "completed" | "delayed";
  budget: number;
}

export interface UpdateProjectRequest {
  id: string;
  data: Partial<CreateProjectRequest>;
}

export interface ProjectStats {
  total: number;
  ongoing: number;
  by_status: {
    completed: number;
    ongoing: number;
    delayed?: number;
  };
}

export interface ProjectPagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface ListProjectsResponse {
  data: Project[];
  pagination: ProjectPagination;
  message: string;
}

export interface CreateProjectResponse {
  data: Project;
  message: string;
}

export interface ProjectRetrieveResponse {
  data: Project;
  message: string;
}

export interface ProjectDeleteResponse {
  message: string;
}

export interface ProjectExportResponse {
  data: string;
  message: string;
}

export interface ProjectStatsResponse {
  data: ProjectStats;
  message: string;
}
