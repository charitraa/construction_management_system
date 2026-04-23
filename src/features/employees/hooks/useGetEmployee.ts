import { useQuery } from "@tanstack/react-query";
import { employeeServices } from "../api/employeeServices";
import { EmployeeDetailsResponse } from "../types/employee.types";
import { EMPLOYEE_QUERY_KEYS } from "../constants/employee.constants";

export const useGetEmployee = (id: string, enabled = true) => {
  return useQuery<EmployeeDetailsResponse>({
    queryKey: [EMPLOYEE_QUERY_KEYS.DETAILS, id],
    queryFn: () => employeeServices.getEmployee(id),
    enabled: enabled && !!id,
  });
};
