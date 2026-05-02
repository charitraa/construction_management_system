import { useMutation } from "@tanstack/react-query";
import { revenueServices } from "../api/revenueServices";
import { RevenueExportResponse } from "../types/revenue.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { REVENUE_QUERY_KEYS } from "../constants/revenue.constants";
import { toast } from "@/hooks/use-toast";

export const useExportRevenue = () => {
  return useMutation<
    RevenueExportResponse,
    ApiErrorResponse,
    { search?: string; project?: string; status?: string; pay_method?: string; start_date?: string; end_date?: string }
  >({
    mutationFn: revenueServices.exportRevenue,
    mutationKey: [REVENUE_QUERY_KEYS.EXPORT],
    onSuccess: (data) => {
      // Create and download CSV file
      const blob = new Blob([data.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Revenue data has been exported to CSV",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error?.message || "Failed to export revenue data",
      });
    },
  });
};