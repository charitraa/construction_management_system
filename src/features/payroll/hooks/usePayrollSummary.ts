import { useQuery } from "@tanstack/react-query";
import { payrollServices } from "../api/payrollServices";
import { PayrollSummaryResponse } from "../types/payroll.types";
import { PAYROLL_QUERY_KEYS } from "../constants/payroll.constants";

export const usePayrollSummary = (date: string) => {
  return useQuery<PayrollSummaryResponse>({
    queryKey: [PAYROLL_QUERY_KEYS.SUMMARY, date],
    queryFn: () => payrollServices.getPayrollSummary(date),
    enabled: !!date,
  });
};
