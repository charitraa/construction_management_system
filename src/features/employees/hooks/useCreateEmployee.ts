import { useMutation, useQueryClient } from "@tanstack/react-query";
import { employeeServices } from "../api/employeeServices";
import {
  CreateEmployeeRequest,
  CreateEmployeeResponse,
} from "../types/employee.types";
import { ApiErrorResponse } from "@/shared/types/http.types";
import { EMPLOYEE_QUERY_KEYS } from "../constants/employee.constants";
import { toast } from "@/hooks/use-toast";

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateEmployeeResponse,
    ApiErrorResponse,
    CreateEmployeeRequest
  >({
    mutationFn: employeeServices.createEmployee,
    mutationKey: [EMPLOYEE_QUERY_KEYS.CREATE],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_QUERY_KEYS.LIST] });
      toast({
        title: "Employee Created",
        description: "Employee has been successfully created",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: error?.message || "Failed to create employee",
      });
    },
  });
};
