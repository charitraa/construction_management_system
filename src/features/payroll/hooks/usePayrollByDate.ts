import { useQuery } from "@tanstack/react-query";
import { payrollServices } from "../api/payrollServices";
import { PayrollByMonthResponse } from "../types/payroll.types";
import { PAYROLL_QUERY_KEYS } from "../constants/payroll.constants";

export const usePayrollByDate = (date: string) => {
  return useQuery<PayrollByMonthResponse>({
    queryKey: [PAYROLL_QUERY_KEYS.BY_DATE, date],
    queryFn: () => payrollServices.getPayrollByDate(date),
    enabled: !!date,
  });
};
