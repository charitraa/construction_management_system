import { httpClient } from "@/shared/api/httpClient";
import {
  CreateExpenseRequest,
  ListExpensesResponse,
  CreateExpenseResponse,
} from "../types/expense.types";
import { EXPENSE_ENDPOINTS } from "../constants/expense.constants";

export const expenseServices = {
  listExpenses: (params?: {
    category?: string;
    start_date?: string;
    end_date?: string;
    project?: string;
    page?: number;
    page_size?: number;
  }) =>
    httpClient.get<ListExpensesResponse>(EXPENSE_ENDPOINTS.LIST, { params }),

  createExpense: (data: CreateExpenseRequest) =>
    httpClient.post<CreateExpenseResponse>(EXPENSE_ENDPOINTS.CREATE, data),
};
