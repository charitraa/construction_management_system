export const PROJECT_QUERY_KEYS = {
  LIST: "projects-list",
  CREATE: "projects-create",
  RETRIEVE: "projects-retrieve",
  UPDATE: "projects-update",
  DELETE: "projects-delete",
  STATS: "projects-stats",
  EXPORT: "projects-export",
} as const;

export const PROJECT_ENDPOINTS = {
  LIST: "/projects/list/",
  CREATE: "/projects/create/",
  RETRIEVE: "/projects/details/",
  UPDATE: "/projects/update/",
  DELETE: "/projects/delete/",
  STATS: "/projects/stats/",
  EXPORT: "/projects/export/",
} as const;
