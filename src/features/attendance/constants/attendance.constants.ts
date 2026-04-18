export const ATTENDANCE_QUERY_KEYS = {
  LIST: "attendance-list",
  CREATE: "attendance-create",
  BY_DATE: "attendance-by-date",
  STATS: "attendance-stats",
} as const;

export const ATTENDANCE_ENDPOINTS = {
  LIST: "/attendance/list/",
  CREATE: "/attendance/create/",
  BY_DATE: "/attendance/by-date/",
  STATS: "/attendance/stats/",
} as const;
