export const EMPLOYEE_ENDPOINTS = {
  LIST: "/employee/list/",
  CREATE: "/employee/create/",
  DETAILS: (id: string) => `/employee/details/${id}/`,
  UPDATE: (id: string) => `/employee/update/${id}/`,
  DELETE: (id: string) => `/employee/delete/${id}/`,
  SEARCH: "/employee/search/",
  STATS: "/employee/stats/",
} as const;

export const EMPLOYEE_ROLES = [
  { value: "manager", label: "Manager" },
  { value: "engineer", label: "Engineer" },
  { value: "supervisor", label: "Supervisor" },
  { value: "worker", label: "Worker" },
  { value: "accountant", label: "Accountant" },
  { value: "admin", label: "Admin" },
] as const;

export const EMPLOYEE_STATUS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_leave", label: "On Leave" },
  { value: "terminated", label: "Terminated" },
] as const;