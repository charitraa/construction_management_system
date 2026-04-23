import { useMutation } from "@tanstack/react-query";
import { employeeServices } from "../api/employeeServices";
import { ExportEmployeesResponse } from "../types/employee.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { EMPLOYEE_QUERY_KEYS } from "../constants/employee.constants";
import { toast } from "@/hooks/use-toast";

export const useExportEmployees = () => {
  return useMutation<ExportEmployeesResponse, ApiErrorResponse>({
    mutationFn: employeeServices.exportEmployees,
    mutationKey: [EMPLOYEE_QUERY_KEYS.EXPORT],
    onSuccess: (response) => {
      const csvContent = response.data;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute("download", `employees_export_${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Employee data has been exported to CSV",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error?.message || "Failed to export employees",
      });
    },
  });
};
