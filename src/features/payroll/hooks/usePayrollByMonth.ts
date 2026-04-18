import { useQuery } from "@tanstack/react-query";
import { payrollServices } from "../api/payrollServices";
import { PayrollByMonthResponse } from "../types/payroll.types";
import { PAYROLL_QUERY_KEYS } from "../constants/payroll.constants";

export const usePayrollByMonth = (month: string) => {
  return useQuery<PayrollByMonthResponse>({
    queryKey: [PAYROLL_QUERY_KEYS.BY_MONTH, month],
    queryFn: () => payrollServices.getPayrollByMonth(month),
    enabled: !!month,
  });
};
