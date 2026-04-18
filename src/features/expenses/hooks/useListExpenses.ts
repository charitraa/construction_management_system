import { useQuery } from "@tanstack/react-query";
import { expenseServices } from "../api/expenseServices";
import { ListExpensesResponse } from "../types/expense.types";
import { EXPENSE_QUERY_KEYS } from "../constants/expense.constants";

export const useListExpenses = (params?: {
  category?: string;
  start_date?: string;
  end_date?: string;
  project?: string;
  page?: number;
  page_size?: number;
}) => {
  return useQuery<ListExpensesResponse>({
    queryKey: [EXPENSE_QUERY_KEYS.LIST, params],
    queryFn: () => expenseServices.listExpenses(params),
  });
};
