import { useMutation } from "@tanstack/react-query";
import { payrollServices } from "../api/payrollServices";
import { PAYROLL_QUERY_KEYS } from "../constants/payroll.constants";

export const usePayrollExport = () => {
  return useMutation({
    mutationKey: [PAYROLL_QUERY_KEYS.EXPORT],
    mutationFn: (date: string) => payrollServices.exportPayroll(date),
  });
};