import { useQuery } from "@tanstack/react-query";
import { expenseServices } from "../api/expenseServices";
import { GetExpenseStatsResponse } from "../types/expense.types";
import { EXPENSE_QUERY_KEYS } from "../constants/expense.constants";

export const useGetExpenseStats = () => {
  return useQuery<GetExpenseStatsResponse>({
    queryKey: [EXPENSE_QUERY_KEYS.STATS],
    queryFn: () => expenseServices.getExpenseStats(),
  });
};