import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeServices } from "../api/employeeServices";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { EMPLOYEE_QUERY_KEYS } from "../constants/employee.constants";
import { toast } from "@/hooks/use-toast";

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiErrorResponse, string>({
    mutationFn: employeeServices.deleteEmployee,
    mutationKey: [EMPLOYEE_QUERY_KEYS.DELETE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEYS.STATS] });
      toast({
        title: "Employee Deleted",
        description: "Employee has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error?.message || "Failed to delete employee",
      });
    },
  });
};
