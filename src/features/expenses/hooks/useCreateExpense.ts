import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseServices } from "../api/expenseServices";
import {
  CreateExpenseRequest,
  CreateExpenseResponse,
} from "../types/expense.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { EXPENSE_QUERY_KEYS } from "../constants/expense.constants";
import { toast } from "@/hooks/use-toast";

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateExpenseResponse,
    ApiErrorResponse,
    CreateExpenseRequest
  >({
    mutationFn: expenseServices.createExpense,
    mutationKey: [EXPENSE_QUERY_KEYS.CREATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSE_QUERY_KEYS.LIST] });
      toast({
        title: "Expense Recorded",
        description: "Expense has been successfully recorded",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Recording Failed",
        description: error?.message || "Failed to record expense",
      });
    },
  });
};
