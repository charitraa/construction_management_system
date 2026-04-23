import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeServices } from "../api/employeeServices";
import {
  UpdateEmployeeRequest,
  UpdateEmployeeResponse,
} from "../types/employee.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { EMPLOYEE_QUERY_KEYS } from "../constants/employee.constants";
import { toast } from "@/hooks/use-toast";

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateEmployeeResponse,
    ApiErrorResponse,
    { id: string; data: UpdateEmployeeRequest }
  >({
    mutationFn: ({ id, data }) => employeeServices.updateEmployee(id, data),
    mutationKey: [EMPLOYEE_QUERY_KEYS.UPDATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEYS.LIST] });
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEYS.STATS] });
      toast({
        title: "Employee Updated",
        description: "Employee has been successfully updated",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error?.message || "Failed to update employee",
      });
    },
  });
};
