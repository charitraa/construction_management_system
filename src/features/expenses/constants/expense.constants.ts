export const EXPENSE_QUERY_KEYS = {
  LIST: "expense-list",
  DETAIL: "expense-detail",
  CREATE: "expense-create",
  UPDATE: "expense-update",
  DELETE: "expense-delete",
  STATS: "expense-stats",
  EXPORT: "expense-export",
} as const;

export const EXPENSE_ENDPOINTS = {
  LIST: "/expense/list/",
  DETAIL: (id: string) => `/expense/details/${id}/`,
  CREATE: "/expense/create/",
  UPDATE: (id: string) => `/expense/update/${id}/`,
  DELETE: (id: string) => `/expense/delete/${id}/`,
  STATS: "/expense/stats/",
  EXPORT: "/expense/export/",
} as const;
