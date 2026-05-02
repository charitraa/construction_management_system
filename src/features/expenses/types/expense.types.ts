export interface Expense {
  id: string;
  date: string;
  description: string;
  category: string; // API returns various categories like "Materials", "Advance"
  amount: string; // API returns amount as string like "2000.00"
  project: string | null;
  project_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseRequest {
  date: string;
  description: string;
  category: string;
  amount: string; // Send as string to match API expectation
  project: string;
}

export interface UpdateExpenseRequest {
  date?: string;
  description?: string;
  category?: string;
  amount?: string;
  project?: string;
}

export interface ListExpensesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    data: Expense[];
    message: string;
  };
}

export interface GetExpenseResponse {
  data: Expense;
  message: string;
}

export interface CreateExpenseResponse {
  data: Expense;
  message: string;
}

export interface UpdateExpenseResponse {
  data: Expense;
  message: string;
}

export interface ExpenseStats {
  total_expenses: number;
  category_breakdown: Record<string, number>;
  transaction_count: number;
  average_expense: number;
  highest_expense: number;
}

export interface GetExpenseStatsResponse {
  data: ExpenseStats;
  message: string;
}

export interface ExportExpensesResponse {
  data: string; // CSV content
  message: string;
}
