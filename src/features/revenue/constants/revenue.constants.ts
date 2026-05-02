export const REVENUE_QUERY_KEYS = {
  LIST: "revenue-list",
  CREATE: "revenue-create",
  RETRIEVE: "revenue-retrieve",
  UPDATE: "revenue-update",
  DELETE: "revenue-delete",
  STATS: "revenue-stats",
  EXPORT: "revenue-export",
} as const;

export const REVENUE_ENDPOINTS = {
  LIST: "/revenue/list/",
  CREATE: "/revenue/create/",
  RETRIEVE: "/revenue/details/",
  UPDATE: "/revenue/update/",
  DELETE: "/revenue/delete/",
  STATS: "/revenue/stats/",
  EXPORT: "/revenue/export/",
} as const;
