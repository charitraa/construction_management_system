export const PAYROLL_QUERY_KEYS = {
  BY_DATE: "payroll-by-date",
  SUMMARY: "payroll-summary",
  EXPORT: "payroll-export",
  MARK_AS_PAID: "payroll-mark-as-paid",
} as const;

export const PAYROLL_ENDPOINTS = {
  BY_DATE: "/payroll/by-date/",
  SUMMARY: "/payroll/summary/",
  EXPORT: "/payroll/export/",
  MARK_AS_PAID: "/payroll/pay/",
} as const;
