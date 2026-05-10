import { httpClient } from "@/shared/api/httpClient";
import {
  PayrollByMonthResponse,
  PayrollSummaryResponse,
} from "../types/payroll.types";
import { PAYROLL_ENDPOINTS } from "../constants/payroll.constants";

export const payrollServices = {
  getPayrollByDate: (date: string) =>
    httpClient.get<PayrollByMonthResponse>(
      `${PAYROLL_ENDPOINTS.BY_DATE}?month=${date.slice(0, 7)}`,
    ),

  getPayrollSummary: (date: string) =>
    httpClient.get<PayrollSummaryResponse>(
      `${PAYROLL_ENDPOINTS.SUMMARY}?month=${date.slice(0, 7)}`,
    ),

  exportPayroll: (date: string) =>
    httpClient.get<{ data: string; message: string }>(
      `${PAYROLL_ENDPOINTS.EXPORT}?month=${date.slice(0, 7)}`,
    ),

  markAsPaid: (payload: {
    employee_id: string;
    start_date: string;
    end_date: string;
    amount: number;
    days_paid: number;
  }) =>
    httpClient.post(`${PAYROLL_ENDPOINTS.MARK_AS_PAID}`, payload),
};
