import { useMutation } from "@tanstack/react-query";
import { expenseServices } from "../api/expenseServices";
import { ExportExpensesResponse } from "../types/expense.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { toast } from "@/hooks/use-toast";

export const useExportExpenses = () => {
  return useMutation<
    ExportExpensesResponse,
    ApiErrorResponse,
    {
      category?: string;
      start_date?: string;
      end_date?: string;
    }
  >({
    mutationFn: (params) => expenseServices.exportExpenses(params),
    onSuccess: (response) => {
      // Create and download CSV file
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expenses.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Expenses have been exported to CSV",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error?.message || "Failed to export expenses",
      });
    },
  });
};