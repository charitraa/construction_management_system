export const PROJECT_QUERY_KEYS = {
  LIST: "projects-list",
  CREATE: "projects-create",
  STATS: "projects-stats",
} as const;

export const PROJECT_ENDPOINTS = {
  LIST: "/projects/list/",
  CREATE: "/projects/create/",
  STATS: "/projects/stats/",
} as const;
