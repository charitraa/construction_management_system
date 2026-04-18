import { useQuery } from "@tanstack/react-query";
import { payrollServices } from "../api/payrollServices";
import { PayrollSummaryResponse } from "../types/payroll.types";
import { PAYROLL_QUERY_KEYS } from "../constants/payroll.constants";

export const usePayrollSummary = (month: string) => {
  return useQuery<PayrollSummaryResponse>({
    queryKey: [PAYROLL_QUERY_KEYS.SUMMARY, month],
    queryFn: () => payrollServices.getPayrollSummary(month),
    enabled: !!month,
  });
};
