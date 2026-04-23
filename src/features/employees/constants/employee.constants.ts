export const EMPLOYEE_QUERY_KEYS = {
  LIST: "employees-list",
  CREATE: "employees-create",
  UPDATE: "employees-update",
  DELETE: "employees-delete",
  DETAILS: "employees-details",
  STATS: "employees-stats",
  EXPORT: "employees-export",
} as const;

export const EMPLOYEE_ENDPOINTS = {
  LIST: "/employees/list/",
  CREATE: "/employees/create/",
  UPDATE: "/employees/update/",
  DELETE: "/employees/delete/",
  DETAILS: "/employees/details/",
  STATS: "/employees/stats/",
  EXPORT: "/employees/export/",
} as const;
