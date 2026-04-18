import { httpClient } from "@/shared/api/httpClient";
import {
  PayrollByMonthResponse,
  PayrollSummaryResponse,
} from "../types/payroll.types";
import { PAYROLL_ENDPOINTS } from "../constants/payroll.constants";

export const payrollServices = {
  getPayrollByMonth: (month: string) =>
    httpClient.get<PayrollByMonthResponse>(
      `${PAYROLL_ENDPOINTS.BY_MONTH}?month=${month}`,
    ),

  getPayrollSummary: (month: string) =>
    httpClient.get<PayrollSummaryResponse>(
      `${PAYROLL_ENDPOINTS.SUMMARY}?month=${month}`,
    ),
};
