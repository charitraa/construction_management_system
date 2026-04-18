export interface Project {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "ongoing" | "completed" | "delayed";
  budget: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "ongoing" | "completed" | "delayed";
  budget: number;
}

export interface ProjectStats {
  total: number;
  ongoing: number;
  completed: number;
  delayed: number;
}

export interface ListProjectsResponse {
  data: Project[];
  message: string;
}

export interface CreateProjectResponse {
  data: Project;
  message: string;
}

export interface ProjectStatsResponse {
  data: ProjectStats;
  message: string;
}
