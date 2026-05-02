import { useQuery } from "@tanstack/react-query";
import { expenseServices } from "../api/expenseServices";
import { GetExpenseResponse } from "../types/expense.types";
import { EXPENSE_QUERY_KEYS } from "../constants/expense.constants";

export const useGetExpense = (id: string) => {
  return useQuery<GetExpenseResponse>({
    queryKey: [EXPENSE_QUERY_KEYS.DETAIL, id],
    queryFn: () => expenseServices.getExpense(id),
    enabled: !!id,
  });
};