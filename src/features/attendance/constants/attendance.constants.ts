export const ATTENDANCE_QUERY_KEYS = {
  LIST: "attendance-list",
  CREATE: "attendance-create",
  BY_DATE: "attendance-by-date",
  STATS: "attendance-stats",
  EMPLOYEES: "attendance-employees",
  DEPARTMENTS: "attendance-departments",
  SUMMARY: "attendance-summary",
  EXPORT: "attendance-export",
  DETAIL: "attendance-detail",
  UPDATE: "attendance-update",
  DELETE: "attendance-delete",
} as const;

export const ATTENDANCE_ENDPOINTS = {
  LIST: "/attendance/list/",
  CREATE: "/attendance/create/",
  BY_DATE: "/attendance/by-date/",
  STATS: "/attendance/stats/",
  EXPORT: "/attendance/export/",
  EMPLOYEES: "/attendance/employees/",
  DEPARTMENTS: "/attendance/departments/",
  SUMMARY: "/attendance/summary/",
  DETAIL: "/attendance/details/",
  UPDATE: "/attendance/update/",
  DELETE: "/attendance/delete/",
} as const;
