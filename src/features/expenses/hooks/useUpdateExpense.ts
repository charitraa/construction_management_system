import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseServices } from "../api/expenseServices";
import {
  UpdateExpenseRequest,
  UpdateExpenseResponse,
} from "../types/expense.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { EXPENSE_QUERY_KEYS } from "../constants/expense.constants";
import { toast } from "@/hooks/use-toast";

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateExpenseResponse,
    ApiErrorResponse,
    { id: string; data: UpdateExpenseRequest }
  >({
    mutationFn: ({ id, data }) => expenseServices.updateExpense(id, data),
    mutationKey: [EXPENSE_QUERY_KEYS.UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSE_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({ queryKey: [EXPENSE_QUERY_KEYS.DETAIL] });
      queryClient.invalidateQueries({ queryKey: [EXPENSE_QUERY_KEYS.STATS] });
      toast({
        title: "Expense Updated",
        description: "Expense has been successfully updated",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error?.message || "Failed to update expense",
      });
    },
  });
};