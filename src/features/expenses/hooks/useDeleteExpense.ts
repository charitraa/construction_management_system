import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expenseServices } from "../api/expenseServices";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { EXPENSE_QUERY_KEYS } from "../constants/expense.constants";
import { toast } from "@/shared/hooks/use-toast";

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    ApiErrorResponse,
    string
  >({
    mutationFn: (id) => expenseServices.deleteExpense(id),
    mutationKey: [EXPENSE_QUERY_KEYS.DELETE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXPENSE_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({ queryKey: [EXPENSE_QUERY_KEYS.STATS] });
      toast({
        variant: "success",
        title: "Expense Deleted",
        description: "Expense has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error?.message || "Failed to delete expense",
      });
    },
  });
};