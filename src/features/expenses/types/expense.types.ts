export interface Expense {
  id: string;
  date: string;
  description: string;
  category: "Labor" | "Materials" | "Equipment" | "Other";
  amount: number;
  project: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExpenseRequest {
  date: string;
  description: string;
  category: "Labor" | "Materials" | "Equipment" | "Other";
  amount: number;
  project: string;
}

export interface ListExpensesResponse {
  data: Expense[];
  message: string;
}

export interface CreateExpenseResponse {
  data: Expense;
  message: string;
}
