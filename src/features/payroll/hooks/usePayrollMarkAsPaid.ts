import { useMutation, useQueryClient } from "@tanstack/react-query";
import { payrollServices } from "../api/payrollServices";
import { PAYROLL_QUERY_KEYS } from "../constants/payroll.constants";

export const usePayrollMarkAsPaid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      employee_id: string;
      start_date: string;
      end_date: string;
      amount: number;
      days_paid: number;
    }) => {
      return payrollServices.markAsPaid(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PAYROLL_QUERY_KEYS.BY_DATE] });
      queryClient.invalidateQueries({ queryKey: [PAYROLL_QUERY_KEYS.SUMMARY] });
      queryClient.invalidateQueries({ queryKey: [PAYROLL_QUERY_KEYS.EXPORT] });
    },
  });
};