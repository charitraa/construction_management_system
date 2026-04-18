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
    onSuccess: () => {
      toast({
        title: "Export Started",
        description: "Employee data export has been initiated",
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
