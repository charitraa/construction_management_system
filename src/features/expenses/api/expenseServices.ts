import { httpClient } from "@/shared/api/httpClient";
import {
  CreateExpenseRequest,
  UpdateExpenseRequest,
  ListExpensesResponse,
  GetExpenseResponse,
  CreateExpenseResponse,
  UpdateExpenseResponse,
  GetExpenseStatsResponse,
  ExportExpensesResponse,
} from "../types/expense.types";
import { EXPENSE_ENDPOINTS } from "../constants/expense.constants";

export const expenseServices = {
  listExpenses: (params?: {
    category?: string;
    start_date?: string;
    end_date?: string;
    project?: string;
    search?: string;
    page?: number;
    page_size?: number;
  }) =>
    httpClient.get<ListExpensesResponse>(EXPENSE_ENDPOINTS.LIST, { params }),

  getExpense: (id: string) =>
    httpClient.get<GetExpenseResponse>(EXPENSE_ENDPOINTS.DETAIL(id)),

  createExpense: (data: CreateExpenseRequest) =>
    httpClient.post<CreateExpenseResponse>(EXPENSE_ENDPOINTS.CREATE, data),

  updateExpense: (id: string, data: UpdateExpenseRequest) =>
    httpClient.put<UpdateExpenseResponse>(EXPENSE_ENDPOINTS.UPDATE(id), data),

  deleteExpense: (id: string) =>
    httpClient.delete(EXPENSE_ENDPOINTS.DELETE(id)),

  getExpenseStats: () =>
    httpClient.get<GetExpenseStatsResponse>(EXPENSE_ENDPOINTS.STATS),

  exportExpenses: (params?: {
    category?: string;
    start_date?: string;
    end_date?: string;
  }) =>
    httpClient.get<ExportExpensesResponse>(EXPENSE_ENDPOINTS.EXPORT, { params }),
};
